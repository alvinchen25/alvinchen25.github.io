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

function extractExcerpt(content, wordCount = 50) {
  const words = content.split(/\s+/).slice(8, wordCount);
  return words.join(' ') + (content.split(/\s+/).length > wordCount ? '...' : '');
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
          const excerpt = extractExcerpt(content);

          return { postId, title, description, image, excerpt };
        });
      })
    ).then(postList => {
      setPosts(postList);
    }).catch(err => {
      console.error('Error loading posts:', err);
    });
  }, []);

  return (
    <section className="blog-section">
      <h2>Blog</h2>
      <div className="blog-header">
        <p className="blog-intro">
          Welcome to my blog! Here you'll find my thoughts, experiences, and insights on various topics. 
          From personal reflections to technical discussions, I share what I learn and discover along the way.
          Feel free to explore the posts below and join me on this journey of continuous learning and growth.
        </p>
        <img 
          src="/blog/mainpic.jpg" 
          alt="Blog Main" 
          className="blog-main-image" 
        />
      </div>
      <ul className="blog-list">
        {posts.map(({ postId, title, description, image, excerpt }) => (
          <li key={postId} className="blog-list-item">
            <Link to={`/blog/${postId}`} className="blog-list-item-link">
              <div className="blog-list-item-content">
                <div className="blog-text">
                  <h3 className="blog-post-title">{title}</h3>
                  {description && <p className="blog-post-description">{description}</p>}
                  {excerpt && <p className="blog-post-excerpt">{excerpt}</p>}
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
