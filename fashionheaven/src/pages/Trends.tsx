import React, { useState, useEffect } from 'react';
import './TrendsNewsContact.css';

const DEFAULT_TRENDS = [
  { id: 1, type: 'trend', title: 'Xuân Hè 2025', description: 'Những thiết kế tươi mới cho kỷ nguyên mới.', image: '/images/co-dien.jpg' },
  { id: 2, type: 'trend', title: 'Thời Trang Công Sở', description: 'Sự kết hợp giữa thanh lịch và hiện đại.', image: '/images/thoi-trang-cong-so.jpg' },
];

const Trends: React.FC = () => {
  const [trendsList, setTrendsList] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/posts')
      .then(res => res.json())
      .then(data => {
        let currentTrends = data.filter((p: any) => p.type === 'trend');
        if (currentTrends.length === 0) currentTrends = DEFAULT_TRENDS;
        setTrendsList(currentTrends);
      })
      .catch(() => {
        setTrendsList(DEFAULT_TRENDS);
      });
  }, []);

  return (
    <div className="TrendsPage">
      <main style={{ padding: '40px 0' }}>
        <section className="main-banner">
          <div className="main-banner-inner">
            <img src="/images/thoi-trang-da-dang.jpg" alt="Fashion Runway" className="main-banner-img" style={{objectFit:'cover'}} />
            <div className="banner-overlay"></div>
            <div className="banner-caption">
                <h2>Fashion Haven 2025</h2>
                <p className="tagline">Sàn diễn thời trang đẳng cấp – Tỏa sáng cá tính riêng của bạn</p>
                <a href="/products" className="btn btn-banner">Khám phá sản phẩm</a>
            </div>
          </div>
        </section>

        <section style={{ marginTop: '40px', padding: '0 5%' }}>
            <h2 className="section-title">Xu Hướng Nổi Bật</h2>
            <div className="trend-grid">
                {trendsList.map((item, index) => (
                <div key={index} className="trend-card">
                    <img src={item.image} alt={item.title} style={{width: '100%', height:'300px', objectFit:'cover'}} />
                    <div className="trend-content">
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                    </div>
                </div>
                ))}
            </div>
        </section>
      </main>
    </div>
  );
};

export default Trends;
