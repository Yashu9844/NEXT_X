import Link from "next/link";
import { HiDotsHorizontal } from "react-icons/hi";
import Icons from "./Icons";

const Post = ({ post, id }) => {
  return (
    <div className="flex p-3 border-b border-gray-100 hover:bg-gray-200">
      {/* User Profile Image */}
      <img 
        src={post?.profileImg} 
        alt={`${post?.name}'s profile`} 
        className="h-11 w-11 rounded-full mr-4 object-cover" 
      />
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
          {/* User Info */}
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-sm truncate">{post?.name}</h4>
            <span className="text-xs text-gray-600 truncate">@{post?.username}</span>
          </div>
          <HiDotsHorizontal className="text-sm cursor-pointer" />
        </div>

        {/* Post Content */}
        <Link href={`/posts/${id}`}>
          <p className="text-gray-800 text-sm mt-1 cursor-pointer">
            {post?.text}
          </p>
        </Link>

        {/* Post Image */}
        {post?.imageUrl && (
          <Link href={`/posts/${id}`} >
            <img 
              src={post?.imageUrl} 
              alt={`Image for ${post?.text}`} 
              className="rounded-2xl mt-2 cursor-pointer max-h-[250px] object-cover" 
            />
          </Link>
        )}
        <Icons id={id} uid={post.uid}/>
      </div>
    </div>
  );
};

export default Post;
