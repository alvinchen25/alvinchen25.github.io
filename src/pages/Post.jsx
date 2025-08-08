import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import matter from 'gray-matter';

// Import all markdown files from all post directories
const allPosts = import.meta.glob('../posts/**/*.md', { as: 'raw' });

function Post() {
  const { postId } = useParams();
  const [postData, setPostData] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [postType, setPostType] = useState('');

  useEffect(() => {
    // Look for a file that ends with `/${postId}.md`
    const matchedKey = Object.keys(allPosts).find(path => path.endsWith(`/${postId}.md`));
    
    if (!matchedKey) {
      setContent(null);
      setLoading(false);
      return;
    }

    // Determine post type from the path
    if (matchedKey.includes('/rwanda/')) {
      setPostType('rwanda');
    } else if (matchedKey.includes('/bhutan/')) {
      setPostType('bhutan');
    } else if (matchedKey.includes('/blog/')) {
      setPostType('blog');
    } else {
      setPostType('general');
    }

    allPosts[matchedKey]().then(rawContent => {
      const { data, content } = matter(rawContent);
      setPostData(data);
      setContent(content);
      setLoading(false);
    });
  }, [postId]);

  if (loading) return <p>Loading...</p>;
  if (content === null) return <p>Post not found!</p>;

  // Determine image path prefix based on post type
  const getImagePathPrefix = () => {
    switch (postType) {
      case 'rwanda':
        return '/rwanda/';
      case 'bhutan':
        return '/bhutan/';
      case 'blog':
        return '/blog/';
      default:
        return '/';
    }
  };

  const imagePathPrefix = getImagePathPrefix();

  return (
    <article className={`${postType}-post-content`}>
      {postData && (postData.title || postData.description) && (
        <header className={`${postType}-post-header`}>
          {postData.title && <h1 className={`${postType}-post-title`}>{postData.title}</h1>}
          {postData.description && <p className={`${postType}-post-description`}>{postData.description}</p>}
          {postData.date && <time className={`${postType}-post-date`}>{postData.date}</time>}
        </header>
      )}
      <div className={`${postType}-post-body`}>
        <ReactMarkdown 
          components={{
            img: ({ src, alt }) => <img src={`${imagePathPrefix}${src}`} alt={alt} />
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </article>
  );
}

export default Post;
