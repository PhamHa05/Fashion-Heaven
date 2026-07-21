import React, { useState } from 'react';
import './Auth.css';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    
    fetch('http://localhost:4000/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.user && data.token) {
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        localStorage.setItem('isAdmin', 'false');
        window.location.href = '/';
      } else {
        setError(data.error || 'Đăng ký thất bại.');
      }
    })
    .catch(() => {
      setError('Lỗi kết nối máy chủ dữ liệu.');
    });
  };

  return (
    <div className="RegisterPage">
       <a href="/" className="back-home-btn"><i className="fas fa-arrow-left"></i> Về trang chủ</a>
       <div className="auth-container">
        <form className="auth-form" onSubmit={handleRegister}>
          <h1>Tạo Tài Khoản</h1>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          
          <div className="social-login">
            <button type="button" className="btn-social">
              <i className="fab fa-google google"></i> Đăng ký với Google
            </button>
            <button type="button" className="btn-social">
              <i className="fab fa-facebook facebook"></i> Đăng ký với Facebook
            </button>
          </div>

          <div className="auth-divider">HOẶC ĐĂNG KÝ BẰNG EMAIL</div>

          <div className="form-group">
            <input type="text" placeholder="Họ và tên" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <input type="email" placeholder="Email của bạn" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <input type="password" placeholder="Xác nhận mật khẩu" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>
          
          <button className="btn btn-primary" type="submit">Đăng ký</button>
          
          <p className="terms-text">
            Bằng việc đăng ký, bạn đã đồng ý với <a href="#!">Điều khoản sử dụng</a> và <a href="#!">Chính sách bảo mật</a> của Fashion Haven.
          </p>

          <div className="auth-switch">
            Đã có tài khoản? <a href="/login">Đăng nhập</a>
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

export default Register;
