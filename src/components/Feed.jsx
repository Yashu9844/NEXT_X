import {collection , getDocs , getFirestore,orderBy,query} from 'firebase/firestore'
import { app } from '../firebase.js'
import Post from './Post.jsx';


const Feed = async () => {
  
    const db = getFirestore(app)
    const q = query(collection(db,'posts'),orderBy('timestamp','desc'));

    const querrySnapShot = await getDocs(q);

    let data=[];

    querrySnapShot.forEach((doc) => {
        data.push({id:doc.id,...doc.data()})
    });



  return (
    <div>
       {data.map((post)=>(
        <Post key={post.id} post={post} id={post.id} />
       ))}
    </div>
  )
}

export default Feed
