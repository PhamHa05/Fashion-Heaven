import React, { useState, useEffect } from 'react';
import './Header.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.reduce((total: number, item: any) => total + (item.quantity || 1), 0));
  };

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error(e);
      }
    }
    
    // Khởi tạo và lắng nghe thay đổi giỏ hàng
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    // Lắng nghe thay đổi localStorage từ tab khác
    window.addEventListener('storage', updateCartCount);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    window.location.reload();
  };

  return (
    <header id="header">
      <div className="top-bar">
        <a href="/" className="logo">Fashion<span>Heaven</span></a>
        <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <i className="fas fa-bars"></i>
        </button>
        <nav>
          <ul className={isMenuOpen ? "show" : ""}>
            <li className="search-container">
              <div className="search-box">
                <input type="text" id="search-input" placeholder="Tìm kiếm..." />
                <button className="search-btn">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </li>
            <li><a href="/" style={{ color: 'red' }}>Trang chủ</a></li>
            <li><a href="/products">Sản phẩm</a></li>
            <li><a href="/trends">Xu hướng</a></li>
            <li><a href="/news">Tin tức</a></li>
            <li><a href="/contact">Liên hệ</a></li>
            <li>
              <a href="/cart" className="cart-icon">
                <i className="fas fa-shopping-cart"></i>
                <span className="cart-count">{cartCount}</span>
              </a>
            </li>
            {!currentUser ? (
              <li className="auth-buttons">
                <a href="/login" className="btn-nav">Đăng nhập</a>
                <a href="/register" className="btn-nav btn-register">Đăng ký</a>
              </li>
            ) : (
              <li className="user-dropdown" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <span className="dropdown-toggle" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <i className="fas fa-user-circle"></i> {currentUser.name} <i className="fas fa-caret-down"></i>
                </span>
                <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                  <a href="/profile"><i className="fas fa-user"></i> Thông tin tài khoản</a>
                  {currentUser.role === 'admin' && (
                    <a href="/admin"><i className="fas fa-cogs"></i> Trang quản trị</a>
                  )}
                  <a href="#!" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Đăng xuất</a>
                </div>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
