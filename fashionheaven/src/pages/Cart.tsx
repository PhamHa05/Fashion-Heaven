import React, { useState, useEffect } from 'react';
import './Cart.css';

const Cart: React.FC = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [isCheckoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [checkoutForm, setCheckoutForm] = useState({ name: '', phone: '', address: '', paymentMethod: 'COD' });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const arr = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(arr);
  };

  const updateQuantity = (index: number, change: number) => {
    const newCart = [...cart];
    const item = newCart[index];
    const newQty = Math.max(1, (item.quantity || 1) + change);
    
    // Kiểm tra tồn kho nếu đang tăng
    if (change > 0 && item.quantity !== undefined && newQty > (item.quantity)) {
      const stock = item.quantity;
      showToast(`⚠️ Sản phẩm "${item.name}" chỉ còn ${stock} trong kho!`);
      return;
    }

    newCart[index].quantity = newQty;
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleCheckoutClick = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) {
      alert('Vui lòng đăng nhập để thanh toán!');
      window.location.href = '/login';
      return;
    }
    setCheckoutForm({ ...checkoutForm, name: currentUser.name || '', phone: currentUser.phone || '', address: currentUser.address || '' });
    setCheckoutModalOpen(true);
  };

  const confirmCheckout = () => {
    if (!checkoutForm.name || !checkoutForm.phone || !checkoutForm.address) {
      showToast('⚠️ Vui lòng điền đầy đủ thông tin giao hàng.');
      return;
    }
    
    const token = localStorage.getItem('token');
    const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const shipping = subtotal > 500000 ? 0 : 30000;
    const total = subtotal + shipping;

    fetch('http://localhost:4000/api/orders/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        totalAmount: total,
        items: cart.map(item => ({
          id: item.id,
          price: item.price,
          quantity: item.quantity || 1
        }))
      })
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Thanh toán thất bại');
      return data;
    })
    .then(() => {
      localStorage.removeItem('cart');
      setCart([]);
      window.dispatchEvent(new Event('cartUpdated'));
      setCheckoutModalOpen(false);
      showToast('Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại Fashion Haven 💖');
      setTimeout(() => {
        window.location.href = '/profile';
      }, 1500);
    })
    .catch(err => {
      console.error(err);
      showToast('❌ ' + (err.message || 'Đã có lỗi xảy ra khi đặt hàng.'));
    });
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const shipping = subtotal > 500000 ? 0 : 30000;
  const total = subtotal + shipping;

  return (
    <>
      <section className="cart-section">
		<h2 className="section-title">Giỏ hàng của bạn</h2>
		<div className="cart-container">
			<div className="cart-items">
				{cart.length === 0 ? (
          <div className="cart-empty" style={{ display: 'block' }}>
            <i className="fas fa-shopping-cart"></i>
            <p>Giỏ hàng của bạn đang trống</p>
            <a href="/products" className="btn">Mua sắm ngay</a>
          </div>
        ) : (
          <table className="cart-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tổng</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="cart-item-info">
                        <img src={item.image} alt={item.name} className="cart-item-img" />
                        <span className="cart-item-name">{item.name}</span>
                    </div>
                  </td>
                  <td>{item.price.toLocaleString()}₫</td>
                  <td>
                    <div className="quantity-control">
                        <button className="quantity-btn" onClick={() => updateQuantity(index, -1)}>-</button>
                        <input type="text" className="quantity-input" value={item.quantity || 1} readOnly style={{ textAlign: 'center', width: '40px' }} />
                        <button className="quantity-btn" onClick={() => updateQuantity(index, 1)}>+</button>
                    </div>
                  </td>
                  <td>{(item.price * (item.quantity || 1)).toLocaleString()}₫</td>
                  <td><i className="fas fa-trash remove-item" style={{ cursor: 'pointer', color: '#e63946' }} onClick={() => removeItem(index)}></i></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
			</div>
			
      {cart.length > 0 && (
        <div className="cart-summary">
          <h3>Tóm tắt đơn hàng</h3>
          <div className="summary-row">
            <span>Tạm tính:</span>
            <span>{subtotal.toLocaleString()}₫</span>
          </div>
          <div className="summary-row">
            <span>Phí vận chuyển:</span>
            <span>{shipping === 0 ? 'Miễn phí' : shipping.toLocaleString() + '₫'}</span>
          </div>
          <div className="summary-row total">
            <span>Tổng cộng:</span>
            <span>{total.toLocaleString()}₫</span>
          </div>
          <button className="btn checkout-btn" onClick={handleCheckoutClick}>Thanh toán</button>
        </div>
      )}
		</div>
	  </section>

      {/* Modal Thanh toán giả lập theo CSS cũ */}
      {isCheckoutModalOpen && (
        <div className="modal" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, justifyContent: 'center', alignItems: 'center' }}>
          <div className="modal-content" style={{ background: '#fff', padding: '30px', borderRadius: '8px', width: '90%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '20px' }}>Thông Tin Thanh Toán</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label>Họ và tên</label>
                <input type="text" value={checkoutForm.name} onChange={e => setCheckoutForm({...checkoutForm, name: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
              </div>
              <div>
                <label>Số điện thoại</label>
                <input type="text" value={checkoutForm.phone} onChange={e => setCheckoutForm({...checkoutForm, phone: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
              </div>
              <div>
                <label>Địa chỉ giao hàng</label>
                <input type="text" value={checkoutForm.address} onChange={e => setCheckoutForm({...checkoutForm, address: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
              </div>
              
              <div style={{ marginTop: '10px' }}>
                <h4 style={{ marginBottom: '10px' }}>Phương thức thanh toán</h4>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <label><input type="radio" name="payment" value="COD" checked={checkoutForm.paymentMethod === 'COD'} onChange={e => setCheckoutForm({...checkoutForm, paymentMethod: e.target.value})} /> Thanh toán khi nhận hàng (COD)</label>
                </div>
                <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                  <label><input type="radio" name="payment" value="BankTransfer" checked={checkoutForm.paymentMethod === 'BankTransfer'} onChange={e => setCheckoutForm({...checkoutForm, paymentMethod: e.target.value})} /> Chuyển khoản ngân hàng</label>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="btn" style={{ background: '#ccc', color: '#333' }} onClick={() => setCheckoutModalOpen(false)}>Hủy</button>
              <button className="btn" style={{ background: '#e63946', color: '#fff' }} onClick={confirmCheckout}>Xác nhận đặt hàng</button>
            </div>
          </div>
        </div>
      )}

      {/* Hiệu ứng Toast */}
      <div className={`toast-message ${toastMessage ? 'show' : ''}`}>
        {toastMessage}
      </div>
    </>
  );
};

export default Cart;
