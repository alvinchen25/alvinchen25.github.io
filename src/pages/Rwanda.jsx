import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import matter from 'gray-matter'; 

// Import all markdown files inside rwanda folder
const rwandaPosts = import.meta.glob('../posts/rwanda/*.md', { query: '?raw', import: 'default' });

// Import the stylesheet
import './Rwanda.css';

function extractFirstImage(content) {
  const imgRegex = /!\[.*?\]\((.*?)\)/;
  const match = imgRegex.exec(content);
  return match ? match[1] : null;
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
          const image = data.image || `${extractFirstImage(content)}`;

          return { postId, title, description, image };
        });
      })
    ).then(postList => {
      setPosts(postList);
    });
  }, []);

  return (
    <section className="rwanda-section">
      <h2>Rwanda</h2>
      <div className="rwanda-header">
        <p className="rwanda-intro">
          In January 2024 I went to Rwanda as part of{' '}
          <a 
            href="https://misti.mit.edu/your-resources/crafting-your-experience/types-programs/global-teaching-labs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="rwanda-link"
          >
            Global Teaching Labs
          </a>. 
          Tony, Yuka, and I spent almost two and a half weeks visiting schools, 
          working with secondary school math students, and training coaches in developing Rwanda's math olympiad program for future years. 
          While not teaching, we visited milk bars, learned Kinyarwanda, rode motorbikes, went on a safari, and drank banana beer. 
          Here's my journal from my time there.
        </p>
        <img 
          src="/rwanda/mainpic.jpeg" 
          alt="Rwanda Main" 
          className="rwanda-main-image" 
        />
      </div>
      <ul className="rwanda-list">
        {posts.map(({ postId, title, description, image }) => (
          <li key={postId} className="rwanda-list-item">
            <Link to={`/rwanda/${postId}`} className="rwanda-list-item-link">
              <div className="rwanda-list-item-content">
                <div className="rwanda-text">
                  <h3 className="rwanda-post-title">{title}</h3>
                  {description && <p className="rwanda-post-description">{description}</p>}
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
