import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "../styles/Navbar.css";
import logo from '../assets/logo.webp';
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
        <h2 className="brand-name"><Link to="/">Emlak-Kirala-Al-Sat</Link></h2>
      </div>
      <div className="nav-links">
        <Link to="/">Ana Sayfa</Link>
        <Link to="/listings">Satin Al</Link>
        <Link to="/listing">Sat</Link>
        <Link to="/listing">Kirala</Link>
        {user ? (
          <div className="user-dropdown" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="nav-button dropdown-toggle">
              {user.name}
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile/profileinfo">Profilim</Link>
                <Link to="/profile/listings">Ilanlarim</Link>
                <Link to="/profile/settings">Ayarlar</Link>
                <Link className="logout-button" to="/" onClick={handleLogout}>Çıkış Yap</Link>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="nav-button">Giris Yap</Link>
            <Link to="/signup" className="nav-button">Kayit Ol</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
