import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import matter from 'gray-matter';

// Glob all .md files inside rwanda folder
const rwandaPosts = import.meta.glob('../posts/rwanda/*.md', { as: 'raw' });

function RwandaPost() {
  const { postId } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Look for a file that ends with `/${postId}.md`
    const matchedKey = Object.keys(rwandaPosts).find(path => path.endsWith(`/${postId}.md`));
    
    if (!matchedKey) {
      setContent(null);
      setLoading(false);
      return;
    }

    rwandaPosts[matchedKey]().then(rawContent => {
      const { data, content } = matter(rawContent);
      // `content` now contains only the markdown body without frontmatter
      // `data` holds any frontmatter fields if present.

      // Check what content looks like in the console
      console.log('Post content:', content);

      setContent(content);
      setLoading(false);
    });
  }, [postId]);

  if (loading) return <p>Loading...</p>;
  if (content === null) return <p>Post not found!</p>;

  return (
    <article className="rwanda-post-content">
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  );
}

export default RwandaPost;
