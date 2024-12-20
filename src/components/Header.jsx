import { Link } from 'react-router-dom';

function Header() {
  // Access the base URL from Vite's environment variables
  const base = import.meta.env.BASE_URL;

  return (
    <header style={{background: '#eee', padding: '1em', textAlign: 'center'}}>
      <h1>Alvin Chen</h1>
      <nav>
        <Link to="/" style={{margin: '0 10px'}}>Home</Link>
        <a
          href={`${base}AlvinCV.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ margin: '0 10px' }}
        >
          CV
        </a>
        <Link to="/blog" style={{margin: '0 10px'}}>Blog</Link>
      </nav>
    </header>
  );
}

export default Header;
