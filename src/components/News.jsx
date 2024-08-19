"use client";
import React, { useEffect, useState } from 'react'

const News = () => {
   const [news,setNews] = useState([]);
   const [newCount,setNewsCount]= useState(3);

  useEffect(()=>{
    fetch("https://saurav.tech/NewsAPI/top-headlines/category/business/in.json").then((res)=>res.json()).then((data)=>setNews(data.articles))
  },[])
  return (
    <div className='text-gray-700 bg-gray-100 rounded-lg pt-2 px-2 space-y-5'>
      <h1 className='font-bold text-xl px-4'>Whats Happening</h1>
      {news.slice(0,newCount).map((article,i)=>(
        <div key={i}>
         <a href={article.url} target='_blank'>
          <div className="flex items-center space-x-1 px-4 py-2 hover:bg-gray-200 transition-all duration-200 justify-between">
            <div className="space-y-0.5">
              <h6 className='text-sm font-bold'>{article.title}</h6>
              <p className='text-xs font-medium text-gray-500'>{article.source.name}</p>
            </div>
            <img src={article.urlToImage} alt="image" width={70} className='rounded-md' />
          </div>
         </a>
        </div>
      ))}
    <div className="flex items-center justify-between ">
    <button onClick={()=>setNewsCount(newCount+3)}
     className='text-sm px-4 text-blue-400 pb-2 hover:text-blue-200 transition-all duration-200'
    >
          Load More  
    </button>
{newCount > 3 ? (
   <button onClick={()=>setNewsCount(newCount-3)}
   className='text-sm px-4 text-red-500 pb-2 hover:text-red-100 transition-all duration-200'
  >
        Load Less  
  </button>
):""}

    </div>


    </div>
  )
}

export default News
