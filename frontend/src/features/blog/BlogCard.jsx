import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  if (!blog) return null;

  console.log(blog.image); 

  return (
    <div className="bg-white rounded-md overflow-hidden shadow border">
    <img
      src={
        blog.image
          ? blog.image.startsWith("/uploads")
            ? `${process.env.REACT_APP_API_URL}${blog.image}`
            : blog.image
          : "../assets/default.png" 
      }
      alt={blog.title ? `Article : ${blog.title}` : "Image blog"}
      className="w-full h-56 object-cover"
    />




      
      <div className="flex flex-col justify-between">
        <h4 className="font-semibold text-gray-900 mb-2 text-base">{blog.title}</h4>
        <Link to={`/blog/${blog.id_blog}`} className="text-sm text-gray-700 underline hover:text-gray-900">
          Lire l'article
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;


