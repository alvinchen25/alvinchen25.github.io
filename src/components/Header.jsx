import { Link } from 'react-router-dom';

function Header() {
  return (
    <header style={{background: '#eee', padding: '1em', textAlign: 'center'}}>
      <h1>My Personal Website</h1>
      <nav>
        <Link to="/" style={{margin: '0 10px'}}>Home</Link>
        <Link to="/blog" style={{margin: '0 10px'}}>Blog</Link>
      </nav>
    </header>
  );
}

export default Header;
