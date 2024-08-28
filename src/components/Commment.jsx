"use client"

import { HiDotsHorizontal } from "react-icons/hi"

const Commment = ({comment , id}) => {

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



       


  </div>
</div> 
)

  
   
  

}

export default Commment
