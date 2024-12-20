import { Link } from 'react-router-dom';

function PostItem({ post }) {
  return (
    <li style={{ marginBottom: '1em', borderBottom: '1px solid #ccc' }}>
      <h3><Link to={`#/blog/${post.id}`}>{post.title}</Link></h3>
      <p>{post.excerpt}</p>
    </li>
  );
}

export default PostItem;
