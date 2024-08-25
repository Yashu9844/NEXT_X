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

const Input = () => {
  const { data: session } = useSession();
  const imagePickRef = useRef(null);
  const [imageFielUrl, setImageFileUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
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
    const storgeRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storgeRef, selectedFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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

  if (!session) return null;
  return (
    <div className="flex border-b border-gray-200 p-3 space-x-3 w-full ">
      <img
        src={session.user.image}
        alt="user-img"
        className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95"
      />
      <div className="w-full divide-y divide-gray-200 ">
        <textarea
          placeholder="Whats happening "
          rows={"2"}
          className="w-full border-none outline-none tracking-wide min-h-[50px]"
        ></textarea>
        {selectedFile && (
          <img
            src={imageFielUrl}
            alt="image-file"
            className="w-full max-h-[250px] object-cover cursor-pointer"
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
          <button className="bg-blue-400 text-white px-4 py-1.5 rounded-full  font-bold shadow-md hover:brightness-95 disabled:opacity-50 ">
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default Input;
