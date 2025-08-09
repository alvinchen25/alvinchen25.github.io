import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import matter from 'gray-matter';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

// Import the new stylesheet
import './Post.css';

// Import all markdown files from all post directories
const allPosts = import.meta.glob('../posts/**/*.md', { as: 'raw' });

function Post() {
  const { postId } = useParams();
  const [postData, setPostData] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [postType, setPostType] = useState('');
  const [prevPost, setPrevPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Look for a file that ends with `/${postId}.md`
    const matchedKey = Object.keys(allPosts).find(path => path.endsWith(`/${postId}.md`));
    
    if (!matchedKey) {
      setContent(null);
      setLoading(false);
      return;
    }

    // Determine post type from the path
    let currentPostType = '';
    if (matchedKey.includes('/rwanda/')) {
      currentPostType = 'rwanda';
    } else if (matchedKey.includes('/bhutan/')) {
      currentPostType = 'bhutan';
    } else if (matchedKey.includes('/blog/')) {
      currentPostType = 'blog';
    }
    setPostType(currentPostType);

    // Navigation logic
    const postPaths = Object.keys(allPosts).filter(path => path.includes(`/${currentPostType}/`));
    const sortedPosts = postPaths.sort((a, b) => {
      const dateA = a.split('/').pop().replace('.md', '');
      const dateB = b.split('/').pop().replace('.md', '');
      return dateA.localeCompare(dateB);
    });

    const currentIndex = sortedPosts.findIndex(path => path.endsWith(`/${postId}.md`));

    if (currentIndex > 0) {
      const prevPath = sortedPosts[currentIndex - 1];
      setPrevPost(prevPath.split('/').pop().replace('.md', ''));
    }

    if (currentIndex < sortedPosts.length - 1) {
      const nextPath = sortedPosts[currentIndex + 1];
      setNextPost(nextPath.split('/').pop().replace('.md', ''));
    }

    allPosts[matchedKey]().then(rawContent => {
      const { data, content } = matter(rawContent);
      setPostData(data);
      setContent(content);
      setLoading(false);
    });
  }, [postId]);

  if (loading) return <p>Loading...</p>;
  if (!postData || content === null) return <p>Post not found!</p>;

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

  const components = {
    img: ({ src, alt }) => <img src={`${imagePathPrefix}${src}`} alt={alt} />
  };

  return (
    <article className="post-content">
      {(postData.title || postData.description) && (
        <div className="post-header">
          <h1 className="post-title">{postData.title}</h1>
          {postData.description && <p className="post-description">{postData.description}</p>}
          {postData.date && <p className="post-date">{postData.date}</p>}
        </div>
      )}
      <div className="post-body">
        <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]} components={components}>
          {content}
        </ReactMarkdown>
      </div>
      <div className="post-navigation">
        {prevPost && <Link to={`/${postType}/${prevPost}`}>&larr; Previous</Link>}
        {nextPost && <Link to={`/${postType}/${nextPost}`}>Next &rarr;</Link>}
      </div>
    </article>
  );
}

export default Post;
