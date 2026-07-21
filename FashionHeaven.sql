USE master;
GO

-- Xóa database cũ nếu tồn tại để tạo lại từ đầu
IF DB_ID('FashionHeaven') IS NOT NULL
BEGIN
    ALTER DATABASE FashionHeaven SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE FashionHeaven;
END
GO

CREATE DATABASE FashionHeaven;
GO

USE FashionHeaven;
GO

-- ==========================================
-- 1. TẠO CÁC BẢNG (TABLES)
-- ==========================================

CREATE TABLE ChucVu (
    MaChucVu INT IDENTITY(1,1) PRIMARY KEY,
    TenChucVu NVARCHAR(255) NOT NULL
);

CREATE TABLE ChiNhanh (
    MaChiNhanh INT IDENTITY(1,1) PRIMARY KEY,
    TenChiNhanh NVARCHAR(255) NOT NULL,
    DiaChi NVARCHAR(MAX) NOT NULL,
    DienThoai NVARCHAR(50) NOT NULL
);

CREATE TABLE NhanVien (
    MaNhanVien INT IDENTITY(1,1) PRIMARY KEY,
    TenNhanVien NVARCHAR(255) NOT NULL,
    MaChucVu INT NOT NULL FOREIGN KEY REFERENCES ChucVu(MaChucVu),
    MaChiNhanh INT NOT NULL FOREIGN KEY REFERENCES ChiNhanh(MaChiNhanh),
    NgaySinh DATETIME2 NULL,
    GioiTinh NVARCHAR(50) NULL,
    DiaChi NVARCHAR(MAX) NULL,
    DienThoai NVARCHAR(50) NULL
);

CREATE TABLE Account (
    MaNhanVien INT PRIMARY KEY FOREIGN KEY REFERENCES NhanVien(MaNhanVien),
    UserName NVARCHAR(255) NOT NULL UNIQUE,
    PassWord NVARCHAR(255) NOT NULL,
    Role NVARCHAR(50) DEFAULT 'USER' NOT NULL
);

CREATE TABLE KhachHang (
    MaKhachHang INT IDENTITY(1,1) PRIMARY KEY,
    TenKhach NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    MatKhau NVARCHAR(255) NOT NULL,
    DiaChi NVARCHAR(MAX) NULL,
    DienThoai NVARCHAR(50) NULL,
    HangThanhVien NVARCHAR(100) NULL
);

CREATE TABLE LoaiHang (
    MaLoaiHang INT IDENTITY(1,1) PRIMARY KEY,
    TenLoaiHang NVARCHAR(255) NOT NULL
);

CREATE TABLE Kho (
    MaKho INT IDENTITY(1,1) PRIMARY KEY,
    TenKho NVARCHAR(255) NOT NULL,
    DiaChi NVARCHAR(MAX) NOT NULL
);

CREATE TABLE NhaCungCap (
    MaNCC INT IDENTITY(1,1) PRIMARY KEY,
    TenNCC NVARCHAR(255) NOT NULL,
    DiaChi NVARCHAR(MAX) NULL,
    DienThoai NVARCHAR(50) NULL
);

CREATE TABLE SanPham (
    MaSanPham INT IDENTITY(1,1) PRIMARY KEY,
    TenSanPham NVARCHAR(255) NOT NULL,
    MaLoaiHang INT NOT NULL FOREIGN KEY REFERENCES LoaiHang(MaLoaiHang),
    SoLuong INT DEFAULT 0 NOT NULL,
    DonGiaNhap FLOAT NOT NULL,
    DonGiaBan FLOAT NOT NULL,
    Anh NVARCHAR(MAX) NULL,
    GhiChu NVARCHAR(MAX) NULL,
    MaKho INT NOT NULL FOREIGN KEY REFERENCES Kho(MaKho),
    MaNCC INT NOT NULL FOREIGN KEY REFERENCES NhaCungCap(MaNCC)
);

CREATE TABLE YeuCauNhapHang (
    MaNhanVien INT NOT NULL FOREIGN KEY REFERENCES NhanVien(MaNhanVien),
    MaSanPham INT NOT NULL FOREIGN KEY REFERENCES SanPham(MaSanPham),
    ThoiGian DATETIME2 DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (MaNhanVien, MaSanPham, ThoiGian)
);

CREATE TABLE PhieuNhap (
    MaPhieuNhap INT IDENTITY(1,1) PRIMARY KEY,
    MaNhanVien INT NOT NULL FOREIGN KEY REFERENCES NhanVien(MaNhanVien),
    NgayNhap DATETIME2 DEFAULT CURRENT_TIMESTAMP NOT NULL,
    MaNCC INT NOT NULL FOREIGN KEY REFERENCES NhaCungCap(MaNCC),
    TongTien FLOAT NOT NULL,
    MaKho INT NOT NULL FOREIGN KEY REFERENCES Kho(MaKho)
);

CREATE TABLE CTPhieuNhap (
    STT INT IDENTITY(1,1) PRIMARY KEY,
    MaPhieuNhap INT NOT NULL FOREIGN KEY REFERENCES PhieuNhap(MaPhieuNhap),
    MaSanPham INT NOT NULL FOREIGN KEY REFERENCES SanPham(MaSanPham),
    SoLuong INT NOT NULL,
    DonGiaNhap FLOAT NOT NULL,
    GiamGia FLOAT DEFAULT 0 NOT NULL,
    ThanhTien FLOAT NOT NULL
);

CREATE TABLE PhieuXuat (
    MaPhieuXuat INT IDENTITY(1,1) PRIMARY KEY,
    MaNhanVien INT NOT NULL FOREIGN KEY REFERENCES NhanVien(MaNhanVien),
    NgayXuat DATETIME2 DEFAULT CURRENT_TIMESTAMP NOT NULL,
    MaKhachHang INT NOT NULL FOREIGN KEY REFERENCES KhachHang(MaKhachHang),
    TongTien FLOAT NOT NULL,
    MaKho INT NOT NULL FOREIGN KEY REFERENCES Kho(MaKho),
    TrangThai NVARCHAR(50) DEFAULT 'PENDING' NOT NULL
);

CREATE TABLE CTPhieuXuat (
    STT INT IDENTITY(1,1) PRIMARY KEY,
    MaPhieuXuat INT NOT NULL FOREIGN KEY REFERENCES PhieuXuat(MaPhieuXuat),
    MaSanPham INT NOT NULL FOREIGN KEY REFERENCES SanPham(MaSanPham),
    SoLuong INT NOT NULL,
    DonGiaBan FLOAT NOT NULL,
    GiamGia FLOAT DEFAULT 0 NOT NULL,
    ThanhTien FLOAT NOT NULL
);

CREATE TABLE BaiViet (
    MaBaiViet INT IDENTITY(1,1) PRIMARY KEY,
    TieuDe NVARCHAR(255) NOT NULL,
    MoTa NVARCHAR(MAX) NOT NULL,
    Anh NVARCHAR(MAX) NOT NULL,
    TheLoai NVARCHAR(50) NOT NULL,
    NgayTao DATETIME2 DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE LienHe (
    MaLienHe INT IDENTITY(1,1) PRIMARY KEY,
    HoTen NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    NoiDung NVARCHAR(MAX) NOT NULL,
    NgayTao DATETIME2 DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ==========================================
-- 2. ĐỔ DỮ LIỆU MẪU (SEED DATA)
-- ==========================================

INSERT INTO ChucVu (TenChucVu) VALUES (N'Quản Trị Viên'), (N'Nhân Viên Bán Hàng');
DECLARE @MaChucVuAdmin INT = SCOPE_IDENTITY() - 1;

INSERT INTO ChiNhanh (TenChiNhanh, DiaChi, DienThoai) VALUES (N'Trụ sở Fashion Heaven', N'123 Đường Thời Trang, TP.HCM', '19001234');
DECLARE @MaChiNhanh INT = SCOPE_IDENTITY();

INSERT INTO NhanVien (TenNhanVien, MaChucVu, MaChiNhanh, DiaChi, DienThoai) 
VALUES (N'Super Admin', @MaChucVuAdmin, @MaChiNhanh, N'TP.HCM', '0987654321');
DECLARE @MaNhanVien INT = SCOPE_IDENTITY();

INSERT INTO Account (MaNhanVien, UserName, PassWord, Role) 
VALUES (@MaNhanVien, 'admin', '123', 'ADMIN');

INSERT INTO KhachHang (TenKhach, Email, MatKhau, DiaChi, DienThoai, HangThanhVien) 
VALUES (N'Nguyễn Văn A', 'nva@gmail.com', '123456', N'Hà Nội', '0912345678', N'Thân Thiết'), (N'Trần Thị B', 'ttb@gmail.com', '123456', N'Đà Nẵng', '0988776655', N'VIP');

INSERT INTO LoaiHang (TenLoaiHang) VALUES (N'Đồng Hồ'), (N'Kính Mát'), (N'Quần Áo Nam Nữ');
INSERT INTO Kho (TenKho, DiaChi) VALUES (N'Kho Trung Tâm', N'Quận 1, TP.HCM');
INSERT INTO NhaCungCap (TenNCC, DienThoai) VALUES (N'Fashion Global Co.', '0123456789');

-- Thêm Sản Phẩm
INSERT INTO SanPham (TenSanPham, MaLoaiHang, SoLuong, DonGiaNhap, DonGiaBan, Anh, MaKho, MaNCC) VALUES
(N'Đồng Hồ Thông Minh 2025', 1, 15, 2000000, 3200000, '/images/dong-ho-thong-minh.jpg', 1, 1),
(N'Đồng Hồ Nam Dây Da', 1, 20, 1000000, 1500000, '/images/dong-ho.jpg', 1, 1),
(N'Kính Mát Nữ cao cấp', 2, 12, 3000000, 4500000, '/images/trang-diem-mua-he-2025.jpg', 1, 1),
(N'Áo Dài Trắng Truyền Thống', 3, 50, 300000, 550000, '/images/ao-dai.jpg', 1, 1),
(N'Áo Sơ Mi Nam', 3, 30, 500000, 850000, '/images/ao-somi-nam.jpg', 1, 1),
(N'Áo Thun Nữ', 3, 40, 150000, 250000, '/images/ao-thun-nu.png', 1, 1),
(N'Áo Vest Nam Hiện Đại', 3, 10, 1500000, 2150000, '/images/ao-vest-nam.jpg', 1, 1),
(N'Giày Boots Nam', 3, 12, 1200000, 1850000, '/images/giay-boots-nam.jpg', 1, 1);

-- Phiếu xuất (Đơn hàng)
INSERT INTO PhieuXuat (MaNhanVien, MaKhachHang, TongTien, MaKho) VALUES
(@MaNhanVien, 1, 3200000, 1),
(@MaNhanVien, 2, 850000, 1);

-- CT Phiếu xuất
INSERT INTO CTPhieuXuat (MaPhieuXuat, MaSanPham, SoLuong, DonGiaBan, ThanhTien) VALUES
(1, 1, 1, 3200000, 3200000),
(2, 5, 1, 850000, 850000);

-- Thêm Bài viết Tin tức / Xu hướng
INSERT INTO BaiViet (TieuDe, MoTa, Anh, TheLoai) VALUES
(N'Chăm Sóc Da Mùa Lạnh', N'Cách giữ làn da căng mịn giữa những ngày gió lạnh, khô hanh.', '/images/trang-diem-mua-he-2025.jpg', 'news'),
(N'Biểu Tượng Thời Trang 2025', N'Gặp gỡ những gương mặt định hình xu hướng thời trang toàn cầu.', '/images/Bieu-tuong-thoi-trang.png', 'news'),
(N'Xuân Hè 2025', N'Những thiết kế tươi mới cho kỷ nguyên mới.', '/images/co-dien.jpg', 'trend'),
(N'Thời Trang Công Sở', N'Sự kết hợp giữa thanh lịch và hiện đại.', '/images/thoi-trang-cong-so.jpg', 'trend');

-- Liên hệ mẫu
INSERT INTO LienHe (HoTen, Email, NoiDung) VALUES
(N'Lê Tình', 'letinh@gmail.com', N'Chào shop, báo giá giùm em bộ sưu tập mới nha.');

GO
PRINT 'FashionHeaven Database Setup Completed Successfully!';
