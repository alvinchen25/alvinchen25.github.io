import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import matter from 'gray-matter';

// Glob all .md files inside bhutan folder
const bhutanPosts = import.meta.glob('../posts/bhutan/*.md', { as: 'raw' });

function BhutanPost() {
  const { postId } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Look for a file that ends with `/${postId}.md`
    const matchedKey = Object.keys(bhutanPosts).find(path => path.endsWith(`/${postId}.md`));
    
    if (!matchedKey) {
      setContent(null);
      setLoading(false);
      return;
    }

    bhutanPosts[matchedKey]().then(rawContent => {
      const { data, content } = matter(rawContent);
      // `content` now contains only the markdown body without frontmatter
      // `data` holds any frontmatter fields if present.

      setContent(content);
      setLoading(false);
    });
  }, [postId]);

  if (loading) return <p>Loading...</p>;
  if (content === null) return <p>Post not found!</p>;

  // Prepend the correct path to images
  const imagePathPrefix = '/bhutan/'; // Adjust this path as necessary

  return (
    <article className="rwanda-post-content">
      <ReactMarkdown 
        components={{
          img: ({ src, alt }) => <img src={`${imagePathPrefix}${src}`} alt={alt} />
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}

export default BhutanPost;
