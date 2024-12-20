import PostList from '../components/PostList';
import postList from '../data/PostList';

function Blog() {
  return (
    <section>
      <h2>Posts</h2>
      <PostList posts={postList} />
    </section>
  );
}

export default Blog;
