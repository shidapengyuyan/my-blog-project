import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './Home';
import PostDetail from './PostDetail';
import CreatePost from './CreatePost';
import './App.css';

function AppLayout() {
  const location = useLocation();

  const isOnCreate = location.pathname === '/create';
  const isOnHome = location.pathname === '/' || location.pathname.startsWith('/posts/');

  return (
    <div className="App">
      <header className="app-header">
        <div className="nav-container">
          <Link to="/" className="logo">
            我的博客
          </Link>
          <nav className="nav-links">
            <Link
              to="/"
              className={`nav-link ${isOnHome ? 'nav-primary' : ''}`.trim()}
            >
              首页
            </Link>
            <Link
              to="/create"
              className={`nav-link ${isOnCreate ? 'nav-primary' : ''}`.trim()}
            >
              写文章
            </Link>
          </nav>
        </div>
      </header>
      <main className="app-main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/create" element={<CreatePost />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;