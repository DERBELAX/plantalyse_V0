import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "./BlogCard";


const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
  axios.get('/api/blogs')
    .then(res => {
      console.log("API /blogs a renvoyé :", res.data);
      setBlogs(res.data);
    })
    .catch(err => console.error(err));
}, []);


  return (
    <>
 
     
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {blogs.map((blog) => (
        <BlogCard key={blog.id_blog} blog={blog} />
      ))}
    </div>

     
   
   
    </>
    
  );
};

export default BlogList;
