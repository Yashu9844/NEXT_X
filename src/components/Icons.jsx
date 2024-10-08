'use client';

import {
  HiOutlineChat,
  HiOutlineHeart,
  HiOutlineTrash,
  HiHeart,
} from 'react-icons/hi';
import { signIn, useSession } from 'next-auth/react';
import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { app } from '../firebase';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { modalState,postIdState } from '../atom/modelAtom';






export default function Icons({ id ,uid}) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState([]);
  const [open,setOpen] = useRecoilState(modalState)
  const [postId, setPostId] = useRecoilState(postIdState)
  const [comment,setComments] = useState([])
  const db = getFirestore(app);


  useEffect(()=>{
    const unsubscribe = onSnapshot(collection(db,'posts',id,'comments'),(snapshot)=>{
    setComments(snapshot.docs)
    }) 
 return ()=> unsubscribe()
  },[id,db])



  const likePost = async () => {
    if (session) {
      if (!id) {
        console.error('Post ID is undefined.');
        return;
      }
      if (!session.user?.uid) {
        console.error('User ID is undefined in session.');
        return;
      }
      try {
        if (isLiked) {
          await deleteDoc(doc(db, 'posts', id, 'likes', session.user.uid));
          setIsLiked(false); // Update state to reflect the change
        } else {
          await setDoc(doc(db, 'posts', id, 'likes', session.user.uid), {
            username: session.user.username,
            timestamp: serverTimestamp(),
          });
          setIsLiked(true); // Update state to reflect the change
        }
      } catch (error) {
        console.error('Error liking/unliking post:', error);
      }
    } else {
      signIn();
    }
  };

  const deletePost =  ()=>{
    if(window.confirm('Are you sure you want to delete this post?')){

   if(session?.user?.uid === uid){
       

    deleteDoc(doc(db, 'posts',id)).then(()=>{
      console.log('Document deleted successfully');
      window.location.reload();
    }).catch((error)=>{
      console.error('Error deleting document:', error);
    })
  }
   }else{
    alert('Your not allowed to delete this posts')
   }

      
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'posts', id, 'likes'),
      (snapshot) => {
        setLikes(snapshot.docs.map((doc) => doc.data())); // Extract data from docs
        // Check if current user has liked the post
        setIsLiked(
          snapshot.docs.some((doc) => doc.id === session?.user?.uid)
        );
      },
      (error) => {
        console.error('Error fetching likes:', error);
      }
    );

    return () => unsubscribe(); // Cleanup on unmount
  }, [db, id, session?.user?.uid]);

  return (
    <div className='flex justify-start gap-5 p-2 text-gray-500'>
      <div className="flex items-center">
      <HiOutlineChat className='h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-out p-2 hover:text-sky-500 hover:bg-sky-100'
      onClick={()=>{
        if(!session){
               signIn()
        }else{
          setOpen(!open);
          setPostId(id)
        }
      }}
      />
      {
        comment.length > 0 && (
          <span className='text-xs' >{comment.length}</span>
        )
      }
      </div>

      <div className='flex items-center'>
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
      </div>
        
        {/* Only display delete button if the user is the post owner */}
        {session?.user?.uid === uid && (
 <HiOutlineTrash className='h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100'
 onClick={deletePost}
 
 />
        )}


     
    </div>
  );
}
