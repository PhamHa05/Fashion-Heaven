import React, { useState, useEffect } from 'react';
import './Products.css';

const SEED_PRODUCTS = [
  { id: 1, name: 'Tai nghe Sony WH-1000XM5', price: 7990000, category: 'electronics', image: '/images/dong-ho-thong-minh.jpg', quantity: 15 },
  { id: 2, name: 'Kính Mát Nữ cao cấp', price: 4500000, category: 'fashion', image: '/images/trang-diem-mua-he-2025.jpg', quantity: 20 },
  { id: 3, name: 'Áo Dài Trắng Truyền Thống', price: 550000, category: 'fashion', image: '/images/ao-dai.jpg', quantity: 50 },
  { id: 4, name: 'Áo Sơ Mi Nam', price: 850000, category: 'fashion', image: '/images/ao-somi-nam.jpg', quantity: 30 },
  { id: 5, name: 'Áo Thun Nữ', price: 250000, category: 'fashion', image: '/images/ao-thun-nu.png', quantity: 40 },
  { id: 6, name: 'Áo Vest Nam Hiện Đại', price: 2150000, category: 'fashion', image: '/images/ao-vest-nam.jpg', quantity: 10 },
  { id: 7, name: 'Balo Da Nam', price: 1250000, category: 'fashion', image: '/images/balo-da-nam.jpg', quantity: 25 },
  { id: 8, name: 'Đồng Hồ Thông Minh 2025', price: 3200000, category: 'electronics', image: '/images/dong-ho-thong-minh.jpg', quantity: 5 },
  { id: 9, name: 'Đồng Hồ Nam Dây Da', price: 1500000, category: 'electronics', image: '/images/dong-ho.jpg', quantity: 18 },
  { id: 10, name: 'Giày Boots Nam', price: 1850000, category: 'fashion', image: '/images/giay-boots-nam.jpg', quantity: 12 },
  { id: 11, name: 'Quần Jean Nam', price: 650000, category: 'fashion', image: '/images/quan-jean-nam.png', quantity: 35 },
  { id: 12, name: 'Bộ Sưu Tập Thời Trang Nam', price: 4500000, category: 'fashion', image: '/images/thoi-trang-nam.jpg', quantity: 8 },
];

const Products: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    // Đã nâng cấp! Lấy dữ liệu sản phẩm từ SQL Server thông qua API
    fetch('http://localhost:4000/api/products')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setProducts(data);
          // Vẫn lưu backup xuống localStorage để hỗ trợ Admin offline (nếu cần)
          localStorage.setItem('products', JSON.stringify(data));
        } else {
          // Fallback
          let savedProducts = JSON.parse(localStorage.getItem('products') || 'null');
          if (!savedProducts || savedProducts.length === 0) {
            savedProducts = SEED_PRODUCTS;
            localStorage.setItem('products', JSON.stringify(savedProducts));
          }
          setProducts(savedProducts);
        }
      })
      .catch((err) => {
        console.error("Lỗi API SQL Server:", err);
        // Fallback
        let savedProducts = JSON.parse(localStorage.getItem('products') || 'null');
        if (!savedProducts || savedProducts.length === 0) {
          savedProducts = SEED_PRODUCTS;
          localStorage.setItem('products', JSON.stringify(savedProducts));
        }
        setProducts(savedProducts);
      });
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const addToCart = (product: any) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      window.location.href = '/login';
      return;
    }

    // Kiểm tra tồn kho
    const stock = product.quantity ?? Infinity;
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === product.id || item.name === product.name);
    const currentQtyInCart = existingItem ? (existingItem.quantity || 1) : 0;

    if (currentQtyInCart + 1 > stock) {
      showToast(`⚠️ Sản phẩm "${product.name}" chỉ còn ${stock} trong kho!`);
      return;
    }

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1, image: product.image || '/images/ao-thun-nu.png' });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    showToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  // Logic Lọc Sản Phẩm
  const getFilteredProducts = () => {
    return products.filter((p) => {
      // Lọc danh mục
      if (categoryFilter !== 'all') {
        const cat = String(p.category || '').toLowerCase();
        if (cat !== categoryFilter) return false;
      }
      // Lọc theo giá
      if (priceFilter === 'under-500' && p.price >= 500000) return false;
      if (priceFilter === '500-1000' && (p.price < 500000 || p.price > 1000000)) return false;
      if (priceFilter === 'above-1000' && p.price <= 1000000) return false;

      return true;
    });
  };

  const resetFilters = () => {
    setPriceFilter('all');
    setCategoryFilter('all');
  };

  return (
    <>
      <section className="products">
        <div className="product-filters">
          <div className="filter-group">
            <label htmlFor="price-range">Lọc theo giá:</label>
            <select id="price-range" className="filter-select" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
              <option value="all">Tất cả mức giá</option>
              <option value="under-500">Dưới 500.000₫</option>
              <option value="500-1000">500.000₫ - 1.000.000₫</option>
              <option value="above-1000">Trên 1.000.000₫</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="category">Lọc theo danh mục:</label>
            <select id="category" className="filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">Tất cả danh mục</option>
              <option value="fashion">Thời Trang / Quần Áo</option>
              <option value="electronics">Phụ kiện / Công nghệ</option>
            </select>
          </div>

          <button className="btn filter-btn">Lọc sản phẩm</button>
          <button className="btn reset-btn" onClick={resetFilters}>Xóa bộ lọc</button>
        </div>

        <div className="product-list" id="productList">
          {getFilteredProducts().map(p => (
            <div key={p.id} className="collection-card">
              <img src={p.image} alt={p.name} className="collection-img" style={{ objectFit: 'cover' }} />
              <div className="collection-info">
                <h3>{p.name}</h3>
                <p className="price" style={{ color: '#e63946', fontWeight: 600 }}>{p.price.toLocaleString()}đ</p>
                <button className="btn add-to-cart" onClick={() => addToCart(p)}>Thêm vào giỏ</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">Bộ sưu tập mùa mới</h2>
        <div className="collections">
          <div className="collection-card">
            <img src="/images/ao-thun-nu.png"
              alt="Bộ sưu tập Xuân Hè" className="collection-img" />
            <div className="collection-info">
              <h3>Xuân Hè 2023</h3>
              <p>Những thiết kế tươi mới cho mùa hè rực rỡ</p>
              <a href="#!" className="btn">Xem thêm</a>
            </div>
          </div>
          <div className="collection-card">
            <img src="/images/ao-somi-nam.jpg"
              alt="Thời trang công sở" className="collection-img" />
            <div className="collection-info">
              <h3>Thời trang công sở</h3>
              <p>Thanh lịch và chuyên nghiệp cho không gian làm việc</p>
              <a href="#!" className="btn">Xem thêm</a>
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: '20px' }}></div>

      {/* Hiệu ứng Toast giống hệt website cũ */}
      <div className={`toast-message ${toastMessage ? 'show' : ''}`}>
        {toastMessage}
      </div>
    </>
  );
};

export default Products;
