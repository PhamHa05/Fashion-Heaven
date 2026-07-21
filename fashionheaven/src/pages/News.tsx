import React, { useState, useEffect } from 'react';
import './TrendsNewsContact.css';

const DEFAULT_NEWS = [
  { id: 1, type: 'news', title: 'Chăm Sóc Da Mùa Lạnh', description: 'Cách giữ làn da căng mịn giữa những ngày gió lạnh, khô hanh.', image: '/images/trang-diem-mua-he-2025.jpg' },
  { id: 2, type: 'news', title: 'Biểu Tượng Thời Trang 2025', description: 'Gặp gỡ những gương mặt định hình xu hướng thời trang toàn cầu.', image: '/images/Bieu-tuong-thoi-trang.png' },
];

const News: React.FC = () => {
  const [newsList, setNewsList] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/posts')
      .then(res => res.json())
      .then(data => {
        let currentNews = data.filter((p: any) => p.type === 'news');
        if (currentNews.length === 0) currentNews = DEFAULT_NEWS;
        setNewsList(currentNews);
      })
      .catch(() => {
        setNewsList(DEFAULT_NEWS);
      });
  }, []);

  return (
    <div className="NewsPage">
      <main style={{ padding: '40px 5%' }}>
        <h2 className="section-title">Tin Tức Thời Trang & Làm Đẹp</h2>
        <div className="articles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginTop: '20px' }}>
          
          {newsList.map((item, index) => (
          <div key={index} className="article-card">
            <div className="article-badge" style={{ background: index % 2 === 0 ? '#e63946' : '#333' }}>Mới nhất</div>
            <img src={item.image} alt={item.title} style={{width: '100%', height:'250px', objectFit:'cover'}} />
            <div className="article-content">
              <h3>{item.title}</h3>
              <p className="short-description">{item.description}</p>
              <button className="btn" style={{ padding: '10px 20px', background: '#e63946', color: 'white', marginTop: '10px' }}>Đọc thêm</button>
            </div>
          </div>
          ))}

        </div>
      </main>
    </div>
  );
};

export default News;
