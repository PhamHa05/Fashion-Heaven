import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-column">
          <h3>Về chúng tôi</h3>
          <ul>
            <li><a href="/about">Câu chuyện thương hiệu</a></li>
            <li><a href="/mission">Sứ mệnh</a></li>
            <li><a href="/careers">Tuyển dụng</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Dịch vụ khách hàng</h3>
          <ul>
            <li><a href="/contact">Liên hệ</a></li>
            <li><a href="/guide">Hướng dẫn mua hàng</a></li>
            <li><a href="/return-policy">Chính sách đổi trả</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Thông tin</h3>
          <ul>
            <li><a href="/terms">Điều khoản sử dụng</a></li>
            <li><a href="/privacy">Chính sách bảo mật</a></li>
            <li><a href="/faq">Câu hỏi thường gặp</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Kết nối với chúng tôi</h3>
          <div className="social-icons">
            <a href="https://www.facebook.com/"><i className="fab fa-facebook-f"></i></a>
            <a href="http://instagram.com/"><i className="fab fa-instagram"></i></a>
            <a href="http://twitter.com/"><i className="fab fa-twitter"></i></a>
            <a href="http://pinterest.com/"><i className="fab fa-pinterest"></i></a>
          </div>
        </div>
      </div>
      <div className="copyright">
        <p>&copy; 2025 Fashion Heaven. Developed by Tran Pham Ha.</p>
      </div>
    </footer>
  );
};

export default Footer;
