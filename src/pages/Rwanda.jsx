// src/pages/Rwanda.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import matter from 'gray-matter'; 

// Import all markdown files inside rwanda folder
const rwandaPosts = import.meta.glob('../posts/rwanda/*.md', { query: '?raw', import: 'default' });

// Import the stylesheet
import './Rwanda.css';

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

function Rwanda() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const keys = Object.keys(rwandaPosts);

    Promise.all(
      keys.map(key => {
        return rwandaPosts[key]().then(rawContent => {
          const { data, content } = matter(rawContent);
          
          const filename = key.split('/').pop(); 
          const postId = filename.replace('.md', '');

          const title = data.title || postId;
          const description = data.description || '';
          const image = data.image 
            ? `/rwanda/${data.image}` 
            : extractFirstImage(content) 
              ? `/rwanda/${extractFirstImage(content)}`
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
      <h2>Rwanda</h2>
      <div className="rwanda-header">
        <p className="rwanda-intro">
          In January 2024, I went to Rwanda as part of{' '}
          <a 
            href="https://misti.mit.edu/your-resources/crafting-your-experience/types-programs/global-teaching-labs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="rwanda-link"
          >
            Global Teaching Labs
          </a> at MIT. 
          Tony, Yuka, and I spent almost two and a half weeks visiting schools, 
          working with secondary school math students, and training coaches in developing Rwanda's math olympiad program for future years. 
          While not teaching, we visited milk bars, learned Kinyarwanda, rode motorbikes, went on a safari, made friends, and drank banana beer. 
          Here's my journal from my time there.
        </p>
        <img 
          src="/rwanda/mainpic.jpeg" 
          alt="Rwanda Main" 
          className="rwanda-main-image" 
        />
      </div>
      <ul className="rwanda-list">
        {posts.map(({ postId, title, description, image, excerpt }) => (
          <li key={postId} className="rwanda-list-item">
            <Link to={`/rwanda/${postId}`} className="rwanda-list-item-link">
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

export default Rwanda;
