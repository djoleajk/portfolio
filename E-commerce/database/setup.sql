CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    description TEXT
);

INSERT INTO products (name, price, image, description) VALUES
('Samsung S24 Ultra', 1299.99, 'samsung_s24.jpg', 'Latest flagship with 200MP camera'),
('iPhone 15 Pro', 999.99, 'iphone15.jpg', 'Apple''s premium smartphone'),
('MacBook Pro', 1499.99, 'macbook.jpg', 'Powerful laptop for professionals');
