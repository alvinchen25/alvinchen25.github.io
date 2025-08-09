// src/pages/Blog.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import matter from 'gray-matter'; 

// Import all markdown files inside blog folder
const blogPosts = import.meta.glob('../posts/blog/*.md', { query: '?raw', import: 'default' });

// Import the stylesheet
import './Blog.css';

function extractFirstImage(content) {
  // This regex looks for the first Markdown image: ![alt](url)
  const imgRegex = /!\[.*?\]\((.*?)\)/;
  const match = imgRegex.exec(content);
  return match ? match[1] : null;
}

function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const keys = Object.keys(blogPosts);

    Promise.all(
      keys.map(key => {
        return blogPosts[key]().then(rawContent => {
          const { data, content } = matter(rawContent);
          
          const filename = key.split('/').pop(); 
          const postId = filename.replace('.md', '');

          const title = data.title || postId;
          const description = data.description || '';
          const image = data.image 
            ? `/blog/${data.image}` 
            : extractFirstImage(content) 
              ? `/blog/${extractFirstImage(content)}`
              : null;

          // Return the full post data including the visibility flag
          return { postId, title, description, image, visible: data.visible };
        });
      })
    ).then(postList => {
      // Filter posts where visible is not explicitly false
      const visiblePosts = postList.filter(post => post.visible !== false);
      setPosts(visiblePosts);
    }).catch(err => {
      console.error('Error loading posts:', err);
    });
  }, []);

  return (
    <section className="blog-section">
      <h2>Writing</h2>
      <div className="blog-header">
        <p className="blog-intro">
          Some journals from traveling to <Link to="/rwanda">Rwanda</Link> in 2024 and <Link to="/bhutan">Bhutan</Link> in 2025.
        </p>
      </div>
      <ul className="blog-list">
        {posts.map(({ postId, title, description, image }) => (
          <li key={postId} className="blog-list-item">
            <Link to={`/blog/${postId}`} className="blog-list-item-link">
              <div className="blog-list-item-content">
                <div className="blog-text">
                  <h3 className="blog-post-title">{title}</h3>
                  {description && <p className="blog-post-description">{description}</p>}
                </div>
                {image && (
                  <div className="blog-image-container">
                    <img 
                      src={image} 
                      alt={title} 
                      className="blog-post-image"
                    />
                  </div>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Blog;
