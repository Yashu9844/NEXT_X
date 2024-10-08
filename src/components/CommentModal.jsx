"use client";

import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../atom/modelAtom";
import Modal from "react-modal";
import { HiX } from "react-icons/hi";
import { useEffect, useState } from "react";
const { useSession } = require("next-auth/react");
import { app } from "../firebase.js";
import { addDoc, collection, doc, getFirestore, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";

const CommentModal = () => {
  const [open, setOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [post, setPost] = useState({});
  const [input, setInput] = useState("");
  const { data: session } = useSession();
  const db = getFirestore(app);
  const router = useRouter();

  useEffect(() => {
    if (postId !== "") {
      const postRef = doc(db, "posts", postId);
      const unsubscribe = onSnapshot(postRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          console.log("Fetched data:", data);
          setPost(data);
        } else {
          console.log("No such Document!!");
        }
      });
      return () => unsubscribe();
    }
  }, [postId]);

const sendComment = async ()=>{
  try {
    addDoc(collection(db,'posts', postId,'comments'),{
      userId:session.user.uid,
      name:session.user.name,
      username:session.user.username,
      userImg:session.user.image,
      comment: input,
      timestamp: new Date(),
    }).then(()=>{
      setInput("");
    setOpen(false);;
    router.push(`/posts/${postId}`);
    }).catch((error)=>{
      console.error("Error adding document: ", error);
    })
    
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}


  return (
    <div>
      {open && (
        <Modal
          isOpen={open}
          onRequestClose={() => setOpen(false)}
          ariaHideApp={false}
          className={
            "max-w-lg w-[90%] absolute top-24 left-[50%] translate-x-[-50%] bg-white border-2 border-gray-200 rounded-xl shadow-md "
          }
        >
          <div className="p-4">
            <div className="border-b border-gray-200 py-2 px-1.5 ">
              <HiX
                className="text-2xl text-gray-700 p-1 hover:bg-gray-200 rounded-full cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <div className="p-2 flex items-center space-x-1 relative">
              <span className="w-0.5 h-full z-[-1] absolute left-8 top-11 bg-gray-300" />
              <img
                src={post?.profileImg}
                alt="user-img"
                className="h-11 w-11 rounded-full mr-4"
              />
              <h4 className="font-bold sm:text-[16px] text-[15px] hover:underline truncate">
                {post?.name}
              </h4>
              <span className="sm:text-[15px] truncate text-sm text-gray-500">
                @{post?.username}
              </span>
            </div>
            <p className="text-gray-500 text-[15px] sm:text-[16px] ml-16 mb-2">
              {post?.text}
            </p>

            <div className="flex p-3 space-x-3">
              <img
                src={session.user.image}
                alt="commenter-image "
                className="rounded-full h-11 w-11 cursor-pointer hover:brightness-90"
              />
              <div className="w-full divide-y divide-gray-200">
                <div className="">
                  <textarea
                    className="w-full border-none outline-none tracking-wide min-h-[50px] text-gray-700 placeholder:text-gray-500 "
                    placeholder="Whats Happening"
                    rows={"2"}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex items-center justify-end pt-2.5">
                  <button
                    className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold
                shadow-md hover:brightness-95 disabled:opacity-50"
                disabled={input.trim() === ""}
                onClick={sendComment}
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CommentModal;
