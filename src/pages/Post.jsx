import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

// This will import any .md file found under ../posts and its subdirectories.
// Matches:
// - ../posts/my-first-post.md
// - ../posts/another-topic/content.md
// - ../posts/something-else/index.md
const postFiles = import.meta.glob('../posts/**/*.md', { as: 'raw' });

function Post() {
  const { postId } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First, try to find a top-level markdown file named `${postId}.md`.
    // e.g., ../posts/my-first-post.md
    const topLevelMatch = Object.keys(postFiles).find(path => path.endsWith(`/${postId}.md`));

    if (topLevelMatch) {
      // We found a top-level file directly named postId.md
      postFiles[topLevelMatch]().then(rawContent => {
        setContent(rawContent);
        setLoading(false);
      });
      return;
    }

    // If not found at top-level, look for a folder named after postId containing any .md file.
    // e.g., ../posts/my-first-post/something.md
    const folderMatch = Object.keys(postFiles).find(path => path.includes(`/${postId}/`));

    if (folderMatch) {
      postFiles[folderMatch]().then(rawContent => {
        setContent(rawContent);
        setLoading(false);
      });
    } else {
      // No matching file or folder found
      setContent(null);
      setLoading(false);
    }
  }, [postId]);

  if (loading) return <p>Loading...</p>;
  if (content === null) return <p>Post not found!</p>;

  return (
    <article>
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  );
}

export default Post;
