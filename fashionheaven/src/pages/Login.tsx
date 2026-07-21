import React, { useState } from 'react';
import './Auth.css'; // Add imported CSS to map exact old html classes

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('http://localhost:4000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.user && data.token) {
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        localStorage.setItem('token', data.token); // Lưu JWT Token
        if (data.user.role === 'admin') {
          localStorage.setItem('isAdmin', 'true');
          window.location.href = '/admin'; // Redirect tới Admin
        } else {
          localStorage.setItem('isAdmin', 'false');
          window.location.href = '/'; // Redirect trang chủ
        }
      } else {
        setError(data.error || 'Đăng nhập thất bại.');
      }
    })
    .catch(() => {
      setError('Lỗi kết nối máy chủ dữ liệu.');
    });
  };

  return (
    <div className="LoginPage">
      <a href="/" className="back-home-btn"><i className="fas fa-arrow-left"></i> Về trang chủ</a>
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleLogin}>
          <h1>Đăng Nhập</h1>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="qr-login">
            <p className="qr-text">Hoặc đăng nhập nhanh bằng mã QR</p>
            <i className="fas fa-qrcode" style={{ fontSize: '40px', color: '#333' }}></i>
          </div>

          <div className="social-login">
            <button type="button" className="btn-social">
              <i className="fab fa-google google"></i> Đăng nhập với Google
            </button>
            <button type="button" className="btn-social">
              <i className="fab fa-facebook facebook"></i> Đăng nhập với Facebook
            </button>
          </div>

          <p className="or-divider"><span>HOẶC CẬP NHẬT BẰNG TÀI KHOẢN</span></p>
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Email hoặc Tên đăng nhập" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input type="password" placeholder="Mật khẩu (dùng 123456)" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          
          <div className="forgot-password">
            <a href="#!">Quên mật khẩu?</a>
          </div>

          <button className="btn btn-primary" type="submit">Đăng nhập</button>
          
          <div className="auth-switch">
            Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
          </div>
        </form>
      </div>

      <div className="brand-footer">
        <h3>Fashion Haven</h3>
        <p className="brand-slogan">Thời trang đương đại - Nâng tầm phong cách</p>
      </div>
    </div>
  );
};

export default Login;
