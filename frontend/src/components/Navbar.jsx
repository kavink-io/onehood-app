import './Navbar.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

function Navbar() {
  const { user, logout } = useAuth(); // We now get the full 'user' object

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand"><h2>OneHood</h2></Link>
      <div className="navbar-links">
        <Link to="/">Feed</Link>
        <Link to="/marketplace">Marketplace</Link>
        <Link to="/calendar">Calendar</Link>
        
        {user ? (
          // If user is logged in, show welcome message and logout button
          <>
            <ThemeToggle />
            <span>Welcome, {user.name}!</span>
            <button onClick={logout} className="logout-button">Logout</button>
          </>
        ) : (
          // If user is logged out, show login and register links
          <>
            <ThemeToggle />
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;