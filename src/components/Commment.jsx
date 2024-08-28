"use client"

import { collection, deleteDoc, doc, getFirestore, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore"
import { signIn, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { HiDotsHorizontal, HiHeart, HiOutlineHeart, HiOutlineTrash } from "react-icons/hi"
import { app } from '../firebase'

const Comment = ({ comment, commentId, originalPostId }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState([])
  const { data: session } = useSession()
  const db = getFirestore(app)

  useEffect(() => {
    if (!originalPostId || !commentId) return;
    
    const unsubscribe = onSnapshot(
      collection(db, 'posts', originalPostId, 'comments', commentId, 'likes'),
      (snapshot) => {
        setLikes(snapshot.docs)
      }
    )

    return () => unsubscribe()
  }, [originalPostId, commentId])

  useEffect(() => {
    if (!session?.user?.uid) return

    setIsLiked(
      likes.findIndex((like) => like.id === session.user.uid) !== -1
    )
  }, [likes, session?.user?.uid])

  const likePost = async () => {
    if (!session) {
      signIn()
      return
    }

    if (!session.user?.uid || !session.user?.username) {
      console.error('User ID or username is missing in the session.')
      return
    }

    try {
      const likeDocRef = doc(db, 'posts', originalPostId, 'comments', commentId, "likes", session.user.uid)
      
      if (isLiked) {
        await deleteDoc(likeDocRef)
        setIsLiked(false)
      } else {
        await setDoc(likeDocRef, {
          username: session.user.username,
          timestamp: serverTimestamp(),
        })
        setIsLiked(true)
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error)
    }
  }

  const deletePost = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      if (session?.user?.uid === comment?.userId) {
        try {
          await deleteDoc(doc(db, 'posts', originalPostId, 'comments', commentId))
       
        } catch (error) {
          console.error('Error deleting comment:', error)
        }
      } else {
        alert('You are not allowed to delete this comment.')
      }
    }
  }

  if (!comment) return null;

  return (
    <div className="flex p-3 border-b border-gray-100 hover:bg-gray-200 pl-10">
      {/* User Profile Image */}
      <img
        src={comment?.userImg}
        alt={`${comment?.name}'s profile`}
        className="h-11 w-11 rounded-full mr-4 object-cover"
      />

      <div className="flex-1">
        <div className="flex items-center justify-between">
          {/* User Info */}
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-sm truncate">{comment?.name}</h4>
            <span className="text-xs text-gray-600 truncate">@{comment?.username}</span>
          </div>
          <HiDotsHorizontal className="text-sm cursor-pointer" />
        </div>

        <p className="text-gray-800 text-sm mt-1 cursor-pointer">
          {comment?.comment}
        </p>

        <div className="flex items-center ">
          {isLiked ? (
            <HiHeart
              onClick={likePost}
              className='h-8 w-8 cursor-pointer rounded-full transition text-red-600 duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100'
            />
          ) : (
            <HiOutlineHeart
              onClick={likePost}
              className='h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100'
            />
          )}
          {likes.length > 0 && (
            <span className={`text-xs ${isLiked ? 'text-red-600' : ''}`}>
              {likes.length}
            </span>
          )}
           {session?.user?.uid === comment?.userId && (
          <HiOutlineTrash 
            className='h-8 w-8 cursor-pointer rounded-full text-gray-500 transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100'
            onClick={deletePost}
          />
        )}
        </div>

        
      </div>
    </div>
  )
}

export default Comment
