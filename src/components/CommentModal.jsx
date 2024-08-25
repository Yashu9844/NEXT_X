"use client";

import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../atom/modelAtom";
import Modal from "react-modal";
import { HiX } from "react-icons/hi";
import { useEffect, useState } from "react";
const { useSession } = require("next-auth/react");
import { app } from "../firebase.js";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";

const CommentModal = () => {
  const [open, setOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [post, setPost] = useState({});
  const { data: session } = useSession();
  const db = getFirestore(app);

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
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CommentModal;
