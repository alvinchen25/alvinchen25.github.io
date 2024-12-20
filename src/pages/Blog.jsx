import PostList from '../components/PostList';
import postList from '../data/PostList';

function Blog() {
  return (
    <section>
      <h2>Coming soon</h2>
      <PostList posts={postList} />
    </section>
  );
}

export default Blog;
