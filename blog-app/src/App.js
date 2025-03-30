import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./App.css";

const App = () => {
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "The Future of AI",
      content: "Artificial Intelligence is evolving rapidly, shaping various industries...",
      image: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg",
      likes: 10,
      comments: ["Amazing read!", "Very insightful."],
      country: "United States"
    },
    {
      id: 2,
      title: "Exploring the Beauty of Nature",
      content: "Nature offers tranquility and peace, making it essential for well-being...",
      image: "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg",
      likes: 5,
      comments: ["Nature is truly mesmerizing!"],
      country: "Canada"
    }
  ]);
  const [newBlog, setNewBlog] = useState({ title: "", content: "", image: "", country: "" });
  const [countries, setCountries] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then(res => res.json())
      .then(data => setCountries(data.map(country => country.name.common)))
      .catch(err => console.error("Error fetching countries:", err)); // Error handling
  }, []);

  const handleLike = (id) => {
    setBlogs(blogs.map(blog => blog.id === id ? { ...blog, likes: blog.likes + 1 } : blog));
  };

  const handleComment = (id, comment) => {
    setBlogs(blogs.map(blog => blog.id === id ? { ...blog, comments: [...blog.comments, comment] } : blog));
  };

  const addBlog = () => {
    if (newBlog.title && newBlog.content && newBlog.image && newBlog.country) {
      setBlogs([...blogs, { ...newBlog, id: blogs.length + 1, likes: 0, comments: [] }]);
      setNewBlog({ title: "", content: "", image: "", country: "" });
    }
  };

  const deleteBlog = (id) => {
    setBlogs(blogs.filter(blog => blog.id !== id));
  };

  return (
    <div className="container">
      <nav className="navbar small-navbar">
        <h1>My Blog</h1>
        <button className="login-button">Login</button>
      </nav>

      {selectedBlog ? (
        <div className="blog-details">
          <button onClick={() => setSelectedBlog(null)}>⬅️ Back</button>
          <h2>{selectedBlog.title}</h2>
          <img src={selectedBlog.image} alt={selectedBlog.title} className="blog-image" />
          <p>{selectedBlog.content}</p>
          <p><strong>Country:</strong> {selectedBlog.country}</p>
          <button onClick={() => handleLike(selectedBlog.id)}>❤️ Like ({selectedBlog.likes})</button>
          <input type="text" placeholder="Add a comment..." 
                 onKeyDown={(e) => e.key === "Enter" && handleComment(selectedBlog.id, e.target.value)} />
          <ul>{selectedBlog.comments.map((c, i) => (<li key={i}>{c}</li>))}</ul>
        </div>
      ) : (
        <div className="blog-list">
          {blogs.map(blog => (
            <motion.div key={blog.id} className="blog-card" whileHover={{ scale: 1.05 }}>
              <img src={blog.image} alt={blog.title} className="blog-image" />
              <h2>{blog.title}</h2>
              <p>{blog.content.substring(0, 100)}...</p>
              <button onClick={() => setSelectedBlog(blog)}>🔍 View Details</button>
              <button onClick={() => handleLike(blog.id)}>❤️ Like ({blog.likes})</button>
              <input type="text" placeholder="Add a comment..." 
                     onKeyDown={(e) => e.key === "Enter" && handleComment(blog.id, e.target.value)} />
              <ul>{blog.comments.map((c, i) => (<li key={i}>{c}</li>))}</ul>
              <button onClick={() => deleteBlog(blog.id)} className="delete-button">🗑️ Delete</button>
            </motion.div>
          ))}
        </div>
      )}

      <div className="blog-form big-form">
        <h2>Create a Blog ✍️📖</h2>
        <p className="emoji-header">📝✨🎨 Make your blog stand out!</p>
        <input type="text" placeholder="Title" value={newBlog.title} onChange={e => setNewBlog({ ...newBlog, title: e.target.value })} />
        <textarea placeholder="Content" value={newBlog.content} onChange={e => setNewBlog({ ...newBlog, content: e.target.value })} />
        <input type="text" placeholder="Image URL" value={newBlog.image} onChange={e => setNewBlog({ ...newBlog, image: e.target.value })} />
        <select value={newBlog.country} onChange={e => setNewBlog({ ...newBlog, country: e.target.value })}>
          <option value="">Select Your Country</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>{country}</option>
          ))}
        </select>
        <button onClick={addBlog}>🚀 Publish</button>
      </div>
    </div>
  );
};

export default App;
