// src/pages/Bhutan.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import matter from 'gray-matter'; 

// Import all markdown files inside bhutan folder
const bhutanPosts = import.meta.glob('../posts/bhutan/*.md', { query: '?raw', import: 'default' });

// Import the stylesheet
import './Rwanda.css';

function extractFirstImage(content) {
  // This regex looks for the first Markdown image: ![alt](url)
  const imgRegex = /!\[.*?\]\((.*?)\)/;
  const match = imgRegex.exec(content);
  return match ? match[1] : null;
}

function extractExcerpt(content, wordCount = 50) {
  const words = content.split(/\s+/).slice(4, wordCount);
  return words.join(' ') + (content.split(/\s+/).length > wordCount ? '...' : '');
}

function Bhutan() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const keys = Object.keys(bhutanPosts);

    Promise.all(
      keys.map(key => {
        return bhutanPosts[key]().then(rawContent => {
          const { data, content } = matter(rawContent);
          
          const filename = key.split('/').pop(); 
          const postId = filename.replace('.md', '');

          const title = data.title || postId;
          const description = data.description || '';
          const image = data.image 
            ? `/bhutan/${data.image}` 
            : extractFirstImage(content) 
              ? `/bhutan/${extractFirstImage(content)}`
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
    <section className="rwanda-section">
      <h2>Bhutan</h2>
      <div className="rwanda-header">
        <p className="rwanda-intro">
          Bhutan, January 2025. I did {' '}
          <a 
            href="https://misti.mit.edu/your-resources/crafting-your-experience/types-programs/global-teaching-labs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="rwanda-link"
          >
            Global Teaching Labs
          </a> a second time. In my month there, I taught olympiad math, went on hikes with my students, ate lots of spicy food, and saw Ed Sheeran. Here are some of my journals from then.

          Some may be interested in our <a 
            href="https://drive.google.com/drive/folders/1rGYIPQextAx5BHHtW_lA8m1umyrG5w9k?usp=sharing"
            target="_blank" 
            rel="noopener noreferrer"
            className="rwanda-link"
          >teaching materials</a>.
        </p>
        <img 
          src="/bhutan/IMG_5077.jpeg" 
          alt="Bhutan Main" 
          className="rwanda-main-image" 
        />
      </div>
      <ul className="rwanda-list">
        {posts.map(({ postId, title, description, image, excerpt }) => (
          <li key={postId} className="rwanda-list-item">
            <Link to={`/bhutan/${postId}`} className="rwanda-list-item-link">
              <div className="rwanda-list-item-content">
                <div className="rwanda-text">
                  <h3 className="rwanda-post-title">{title}</h3>
                  {description && <p className="rwanda-post-description">{description}</p>}
                  {excerpt && <p className="rwanda-post-excerpt">{excerpt}</p>}
                </div>
                {image && (
                  <div className="rwanda-image-container">
                    <img 
                      src={image} 
                      alt={title} 
                      className="rwanda-post-image"
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

export default Bhutan;
