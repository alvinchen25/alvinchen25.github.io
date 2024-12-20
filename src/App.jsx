// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import App from './App';
import Rwanda from './pages/Rwanda';
import RwandaPost from './pages/RwandaPost';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Post from './pages/Post';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Routes>
        {/* Your existing routes */}
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:postId" element={<Post />} />
        
        {/* New Rwanda routes */}
        <Route path="/rwanda" element={<Rwanda />} />
        <Route path="/rwanda/:postId" element={<RwandaPost />} />
        
        {/* Catch all, etc. */}
      </Routes>
    </Router>
  );
}

export default App;
