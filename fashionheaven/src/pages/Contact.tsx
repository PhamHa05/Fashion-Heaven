import React from 'react';
import './TrendsNewsContact.css';

const Contact: React.FC = () => {
  return (
    <div className="ContactPage">
      <main className="contact-section">
        <h2 className="section-title">Liên Hệ Với Chúng Tôi</h2>
        <div className="contact-container">
            <div className="contact-info">
                <h3>Phòng CSKH Fashion Heaven</h3>
                <div className="info-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <p>123 Đường Thời Trang, Quận Phong Cách, Thành phố</p>
                </div>
                <div className="info-item">
                    <i className="fas fa-phone-alt"></i>
                    <p>1900 123 456</p>
                </div>
                <div className="info-item">
                    <i className="fas fa-envelope"></i>
                    <p>support@fashionheaven.com</p>
                </div>
            </div>
            
            <form className="contact-form" onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const contact = {
                    name: form.name.value,
                    email: form.email.value,
                    message: form.message.value
                };
                
                fetch('http://localhost:4000/api/contacts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(contact)
                }).then(() => {
                    alert('Cảm ơn bạn đã liên hệ! Yêu cầu đã được lưu vào CSDL.');
                    form.reset();
                }).catch(() => {
                    alert('Gửi thất bại, vui lòng thử lại sau.');
                });
            }}>
                <div className="form-group">
                    <label>Họ Tên</label>
                    <input type="text" name="name" required placeholder="Nhập tên của bạn" />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" required placeholder="Nhập email của bạn" />
                </div>
                <div className="form-group">
                    <label>Lời nhắn</label>
                    <textarea name="message" required rows={5} placeholder="Nhập lời nhắn"></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', background: '#e63946', color: 'white' }}>Gửi Yêu Cầu</button>
            </form>
        </div>
      </main>
    </div>
  );
};

export default Contact;
