import { Link } from 'react-router-dom';

function Home() {
    return (
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Hi it's Alvin!</h1>
          <p>Coming soon: <Link to="/blog">Blog</Link></p>
          <p><Link to="/rwanda">Rwanda</Link></p>
        </div>
        <img src="/public/IMG_3173-EDIT.jpg" alt="Alvin picture" style={{ maxWidth: '50%', height: 'auto' }} />
      </section>
    );
  }
  
  export default Home;