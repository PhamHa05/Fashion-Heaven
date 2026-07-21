import React, { useEffect, useState } from 'react';
import './Profile.css';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    // Lấy thông tin user
    fetch('http://localhost:4000/api/users/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) throw new Error(data.error);
      setUser(data);
      setFormData({ name: data.TenKhach || '', phone: data.DienThoai || '', address: data.DiaChi || '' });
    })
    .catch(err => {
      console.error(err);
      if (err.message === 'Token không hợp lệ hoặc đã hết hạn.' || err.message === 'Truy cập bị từ chối. Không có token.') {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAdmin');
        window.location.href = '/login';
      } else {
        setMessage('Không thể tải thông tin: ' + err.message);
      }
    });

    // Lấy lịch sử đơn hàng
    fetch('http://localhost:4000/api/orders/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (!data.error) setOrders(data);
    })
    .catch(console.error);

  }, []);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    fetch('http://localhost:4000/api/users/profile', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) setMessage('Lỗi: ' + data.error);
      else {
        setMessage('Cập nhật thông tin thành công!');
        setUser(data);
        // Cập nhật lại localStorage currentUser
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        currentUser.name = data.TenKhach;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        setTimeout(() => setMessage(''), 3000);
      }
    })
    .catch(() => setMessage('Lỗi kết nối'));
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage('Lỗi: Mật khẩu mới không khớp.');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordMessage('Lỗi: Mật khẩu mới phải từ 6 ký tự.');
      return;
    }
    const token = localStorage.getItem('token');
    fetch('http://localhost:4000/api/users/change-password', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) setPasswordMessage('Lỗi: ' + data.error);
      else {
        setPasswordMessage('Thành công: ' + data.message);
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setPasswordMessage(''), 3000);
      }
    })
    .catch(() => setPasswordMessage('Lỗi kết nối máy chủ.'));
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
    window.location.href = '/login';
  };

  return (
    <div className="ProfilePage">
      <main className="profile-container">
        <div className="profile-sidebar">
            <div className="user-avatar">
                <i className="fas fa-user-circle"></i>
                <h3>{user ? user.TenKhach : "Đang tải..."}</h3>
            </div>
            <div className="profile-nav">
                <a href="#userInfo" className="active"><i className="fas fa-user"></i> Thông tin tài khoản</a>
                <a href="#security"><i className="fas fa-shield-alt"></i> Quản lý bảo mật</a>
                <a href="#orderHistory"><i className="fas fa-shopping-bag"></i> Lịch sử đơn hàng</a>
                <a href="#!" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Đăng xuất</a>
            </div>
        </div>

        <div className="profile-content">
            <section className="profile-section" id="userInfo">
                <h2>Cập Nhật Thông Tin</h2>
                {message && <div style={{ padding: '10px', background: '#d4edda', color: '#155724', marginBottom: '15px', borderRadius: '4px' }}>{message}</div>}
                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label>Email (Không thể thay đổi)</label>
                        <input type="email" value={user ? user.Email : ""} disabled />
                    </div>
                    <div className="form-group">
                        <label>Họ và tên</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label>Số điện thoại</label>
                        <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label>Địa chỉ</label>
                        <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                    </div>
                    <button type="submit" className="btn-primary">Lưu Thay Đổi</button>
                </form>
            </section>

            <section className="profile-section" id="security" style={{ marginTop: '50px' }}>
                <h2>Quản Lý Bảo Mật (Đổi Mật Khẩu)</h2>
                {passwordMessage && <div style={{ padding: '10px', background: passwordMessage.startsWith('Lỗi') ? '#f8d7da' : '#d4edda', color: passwordMessage.startsWith('Lỗi') ? '#721c24' : '#155724', marginBottom: '15px', borderRadius: '4px' }}>{passwordMessage}</div>}
                <form onSubmit={handleChangePassword}>
                    <div className="form-group">
                        <label>Mật khẩu cũ</label>
                        <input type="password" value={passwordData.oldPassword} onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>Mật khẩu mới</label>
                        <input type="password" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>Xác nhận mật khẩu mới</label>
                        <input type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} required />
                    </div>
                    <button type="submit" className="btn-primary">Đổi Mật Khẩu</button>
                </form>
            </section>

            <section className="profile-section" id="orderHistory" style={{ marginTop: '50px' }}>
                <h2>Lịch sử đơn hàng</h2>
                <div className="table-responsive">
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>Mã Đơn</th>
                                <th>Ngày Đặt</th>
                                <th>Tổng Tiền</th>
                                <th>Trạng Thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                              <tr key={order.MaPhieuXuat}>
                                  <td>#ORD-{order.MaPhieuXuat}</td>
                                  <td>{new Date(order.NgayXuat).toLocaleDateString('vi-VN')}</td>
                                  <td>{order.TongTien.toLocaleString()}₫</td>
                                  <td>
                                    <span className={`badge ${order.TrangThai === 'Hoàn thành' ? 'badge-success' : order.TrangThai === 'Đã hủy' ? 'badge-danger' : 'badge-warning'}`}>
                                      {order.TrangThai}
                                    </span>
                                  </td>
                              </tr>
                            ))}
                            {orders.length === 0 && (
                              <tr><td colSpan={4} style={{ textAlign: 'center' }}>Bạn chưa có đơn hàng nào.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
      </main>
    </div>
  );
};

export default Profile;
