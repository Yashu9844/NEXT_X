"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { HiOutlinePhotograph } from "react-icons/hi";
import { app } from "../firebase.js";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";

const Input = () => {
  const { data: session } = useSession();
  const imagePickRef = useRef(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [text, setText] = useState('');
  const [postLoading, setPostLoading] = useState(false);

  const addImageToPost = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (selectedFile) {
      uploadImageToStorage();
    }
  }, [selectedFile]);

  const uploadImageToStorage = () => {
    setImageUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + selectedFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);
    
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error("An error occurred while uploading the file:", error);
        setImageUploading(false);
        setImageFileUrl(null);
        setSelectedFile(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setImageUploading(false);
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPostLoading(true);

    const db = getFirestore(app);

    await addDoc(collection(db, 'posts'), {
      uid: session.user.uid,
      name: session.user.name,
      username: session.user.username,
      text: text,
      profileImg: session.user.image,
      imageUrl: imageFileUrl,  // Added this line to include the image URL in the post
      timestamp: serverTimestamp(),
    });

    setPostLoading(false);
    setImageFileUrl(null);
    setText('');
    setSelectedFile(null);
    location.reload();
  };

  if (!session) return null;

  return (
    <div className="flex border-b border-gray-200 p-3 space-x-3 w-full">
      <img
        src={session.user.image}
        alt="user-img"
        className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95"
      />
      <div className="w-full divide-y divide-gray-200">
        <textarea
          placeholder="What's happening"
          rows="2"
          className="w-full border-none outline-none tracking-wide min-h-[50px]"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        {selectedFile && (
          <img
            src={imageFileUrl}
            alt="image-file"
            className={`w-full max-h-[250px] object-cover cursor-pointer
            ${imageUploading ? 'animate-pulse' : " " }`}
          />
        )}
        <div className="flex items-center justify-between p-3">
          <HiOutlinePhotograph
            onClick={() => imagePickRef.current.click()}
            className="h-10 w-10 p-2 text-sky-500 hover:bg-sky-100 rounded-full cursor-pointer"
          />
          <input
            hidden
            type="file"
            ref={imagePickRef}
            accept="image/*"
            onChange={addImageToPost}
          />
          <button
            className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
            disabled={text.trim() === '' || postLoading || imageUploading}
            onClick={handleSubmit}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default Input;
