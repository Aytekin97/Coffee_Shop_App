import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "../styles/Navbar.css";
import logo from '../assets/logo.png';
import { AuthContext } from '../context/AuthContext';
import type { AuthContextType } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const authContext = useContext<AuthContextType | undefined>(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { user, logout } = authContext;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={logo} alt="al-sat-kirala" className="logo" />
        <h2 className="brand-name"><Link to="/">Brew Beans App</Link></h2>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {user ? (
          <div className="user-dropdown" ref={dropdownRef}>         
            <button onClick={toggleDropdown} className="nav-button dropdown-toggle">
              {user.name}
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile">Profile</Link>
                <Link to="/my-orders">My Orders</Link>
                <Link className="logout-button" to="/" onClick={handleLogout}>Log Out</Link>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="nav-button">Login</Link>
            <Link to="/signup" className="nav-button">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
