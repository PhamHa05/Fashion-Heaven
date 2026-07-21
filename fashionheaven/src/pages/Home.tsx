import React, { useState, useEffect } from 'react';

const Home: React.FC = () => {
  const [slideIndex, setSlideIndex] = useState(1);
  const totalSlides = 3;

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev % totalSlides) + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = (n: number) => {
    setSlideIndex(n);
  };

  const plusSlides = (n: number) => {
    setSlideIndex((prev) => {
      let next = prev + n;
      if (next > totalSlides) return 1;
      if (next < 1) return totalSlides;
      return next;
    });
  };

  return (
    <div className="HomePage">
      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="slideshow-container">
            {/* Slide 1 */}
            <div className={`slide ${slideIndex === 1 ? 'fade' : ''}`} style={{ display: slideIndex === 1 ? 'block' : 'none' }}>
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Thời trang cao cấp" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              <div className="hero-content">
                <h1>Phong cách của bạn, Câu chuyện của bạn</h1>
                <p>Khám phá bộ sưu tập mới nhất của chúng tôi với những thiết kế độc đáo phù hợp với mọi dịp.</p>
                <a href="/products" className="btn">Mua sắm ngay</a>
              </div>
            </div>

            {/* Slide 2 */}
            <div className={`slide ${slideIndex === 2 ? 'fade' : ''}`} style={{ display: slideIndex === 2 ? 'block' : 'none' }}>
              <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Xu hướng mùa hè" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              <div className="hero-content">
                <h1>Xu hướng mùa hè 2025</h1>
                <p>Bộ sưu tập mới nhất với những thiết kế tươi mát và năng động.</p>
                <a href="/trends" className="btn">Khám phá ngay</a>
              </div>
            </div>

            {/* Slide 3 */}
            <div className={`slide ${slideIndex === 3 ? 'fade' : ''}`} style={{ display: slideIndex === 3 ? 'block' : 'none' }}>
              <img src="https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Phụ kiện thời trang" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              <div className="hero-content">
                <h1>Phụ kiện hoàn hảo</h1>
                <p>Điểm nhấn tinh tế cho mọi trang phục của bạn.</p>
                <a href="/products" className="btn">Xem ngay</a>
              </div>
            </div>

            {/* Navigation arrows */}
            <a className="prev" onClick={() => plusSlides(-1)}>&#10094;</a>
            <a className="next" onClick={() => plusSlides(1)}>&#10095;</a>

            {/* Dots */}
            <div className="dots-container">
              <span className={`dot ${slideIndex === 1 ? 'active' : ''}`} onClick={() => currentSlide(1)}></span>
              <span className={`dot ${slideIndex === 2 ? 'active' : ''}`} onClick={() => currentSlide(2)}></span>
              <span className={`dot ${slideIndex === 3 ? 'active' : ''}`} onClick={() => currentSlide(3)}></span>
            </div>
          </div>
        </section>

        {/* Fashion Display Section */}
        <section className="fashion-showcase">
          <h2 className="section-title">Thời trang phong cách mới</h2>
          <div className="showcase-grid">
            <a href="/products" className="showcase-item">
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Trang phục công sở thanh lịch" />
              <div className="showcase-caption">
                <h3>Phong Cách Công Sở</h3>
                <p>Sự kết hợp giữa thanh lịch và hiện đại</p>
              </div>
            </a>
            <a href="/products" className="showcase-item">
              <img src="https://images.unsplash.com/photo-1542295669297-4d352b042bca?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" alt="Giày thể thao thời trang" />
              <div className="showcase-caption">
                <h3>Giày Thể Thao</h3>
                <p>Năng động và thoải mái</p>
              </div>
            </a>
            <a href="/products" className="showcase-item">
              <img src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80" alt="Phụ kiện cao cấp" />
              <div className="showcase-caption">
                <h3>Phụ Kiện</h3>
                <p>Điểm nhấn hoàn hảo</p>
              </div>
            </a>
          </div>
        </section>

        <section>
          <h2 className="section-title">Bộ sưu tập mùa mới</h2>
          <div className="collections">
            <a href="/products" className="collection-card">
              <img src="https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" alt="Xuân Hè" className="collection-img" />
              <div className="collection-info">
                <h3>Xuân Hè 2023</h3>
                <p>Những thiết kế tươi mới cho mùa hè rực rỡ</p>
              </div>
            </a>
            <a href="/products" className="collection-card">
              <img src="https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" alt="Công sở" className="collection-img" />
              <div className="collection-info">
                <h3>Thời trang công sở</h3>
                <p>Thanh lịch và chuyên nghiệp cho không gian làm việc</p>
              </div>
            </a>
            <a href="/products" className="collection-card">
              <img src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" alt="Phụ kiện" className="collection-img" />
              <div className="collection-info">
                <h3>Phụ kiện cao cấp</h3>
                <p>Điểm nhấn hoàn hảo cho mọi trang phục</p>
              </div>
            </a>
            <a href="/products" className="collection-card">
              <img src="/images/ao-dai.jpg" alt="Áo dài" className="collection-img" />
              <div className="collection-info">
                <h3>Áo dài cách tân</h3>
                <p>Kết hợp hiện đại và truyền thống</p>
              </div>
            </a>
          </div>
        </section>

        {/* Xu hướng banner */}
        <section className="main-banner">
          <div className="main-banner-inner">
            <img src="https://images.unsplash.com/photo-1521336575822-6da63fb45455?auto=format&fit=crop&w=1600&q=80" alt="Fashion Runway" className="main-banner-img" style={{objectFit: 'cover'}} />
            <div className="banner-overlay"></div>
            <div className="banner-caption">
              <h2>Fashion Haven 2025</h2>
              <p className="tagline">Sàn diễn thời trang đẳng cấp – Tỏa sáng cá tính riêng của bạn</p>
              <a href="/trends" className="btn btn-banner">Khám phá xu hướng</a>
            </div>
          </div>
        </section>

        {/* Category */}
        <section className="category-section">
          <div className="category">
            <h2>Làm đẹp</h2>
            <ul>
              <li><a href="/trends">Xu hướng trang điểm mùa hè 2025</a></li>
              <li><a href="/trends">Top 5 serum phục hồi da hiệu quả</a></li>
              <li><a href="/trends">Cách chọn nước hoa phù hợp cá tính</a></li>
            </ul>
          </div>
          <div className="category">
            <h2>Thời trang</h2>
            <ul>
              <li><a href="/trends">Mix đồ công sở chuẩn fashionista</a></li>
              <li><a href="/trends">Các màu sắc sẽ lên ngôi trong năm nay</a></li>
              <li><a href="/trends">Bí quyết phối phụ kiện sang trọng</a></li>
            </ul>
          </div>
        </section>

        <section className="newsletter">
          <h2>Đăng ký nhận bản tin</h2>
          <p>Cập nhật những xu hướng mới nhất và nhận ưu đãi đặc biệt dành riêng cho thành viên.</p>
          <form className="newsletter-form">
            <a href="/register">
              <button type="button">Đăng ký</button>
            </a>
          </form>
        </section>

      </main>
    </div>
  );
};

export default Home;
