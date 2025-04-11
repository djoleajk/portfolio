-- Insert categories
INSERT INTO categories (name, description) VALUES
('Laptops', 'High performance laptops'),
('Smartphones', 'Latest mobile devices'),
('Accessories', 'Tech accessories'),
('Gaming', 'Gaming consoles and accessories');

-- Insert products
INSERT INTO products (category_id, name, description, price, stock, image) VALUES
(1, 'MacBook Pro', 'Apple M2 chip, 16GB RAM, 512GB SSD', 1299.99, 10, 'macbook.jpg'),
(1, 'Dell XPS 15', 'Intel i7, 32GB RAM, 1TB SSD', 1499.99, 8, 'dell.jpg'),
(2, 'iPhone 14 Pro', '256GB, Midnight Black', 999.99, 15, 'iphone.jpg'),
(2, 'Samsung S23', '512GB, Phantom Silver', 899.99, 12, 'samsung.jpg'),
(3, 'AirPods Pro', 'Wireless earbuds with noise cancellation', 249.99, 20, 'airpods.jpg'),
(1, 'MacBook Air', 'Apple M1 chip, 8GB RAM, 256GB SSD', 999.99, 20, 'macbook_air.jpg'),
(1, 'HP Spectre x360', 'Intel i7, 16GB RAM, 512GB SSD', 1299.99, 15, 'hp_spectre.jpg'),
(2, 'Google Pixel 7', '128GB, Obsidian Black', 799.99, 25, 'pixel_7.jpg'),
(2, 'OnePlus 11', '256GB, Titan Black', 699.99, 30, 'oneplus_11.jpg'),
(3, 'Logitech MX Master 3', 'Wireless mouse with ergonomic design', 99.99, 50, 'logitech_mouse.jpg'),
(3, 'Razer BlackWidow V3', 'Mechanical gaming keyboard', 149.99, 40, 'razer_keyboard.jpg'),
(4, 'PlayStation 5', 'Next-gen gaming console', 499.99, 10, 'ps5.jpg'),
(4, 'Xbox Series X', 'Powerful gaming console', 499.99, 12, 'xbox_series_x.jpg'),
(1, 'Lenovo ThinkPad X1 Carbon', 'Intel i7, 16GB RAM, 512GB SSD', 1299.99, 10, 'lenovo_thinkpad.jpg'),
(1, 'Asus ROG Zephyrus G14', 'AMD Ryzen 9, 16GB RAM, 1TB SSD', 1499.99, 8, 'asus_rog.jpg'),
(2, 'Samsung Galaxy S22 Ultra', '256GB, Phantom Black', 1199.99, 15, 'galaxy_s22.jpg'),
(2, 'Google Pixel 6 Pro', '128GB, Stormy Black', 899.99, 12, 'pixel_6_pro.jpg'),
(3, 'Logitech G502 Hero', 'High-performance gaming mouse', 79.99, 20, 'logitech_g502.jpg'),
(3, 'Corsair K95 RGB Platinum', 'Mechanical gaming keyboard', 199.99, 15, 'corsair_k95.jpg'),
(2, 'Samsung S24 Ultra', 'The latest flagship smartphone with a stunning display, advanced camera, and powerful performance.', 1299.99, 20, 'samsung_s24_ultra.jpg');

-- Verify database insertion
SELECT * FROM products;
