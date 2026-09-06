-- SECOND STORIES - DATABASE FINAL
-- Jika kamu masih memakai database versi lama, script ini mereset database second_stories.
DROP DATABASE IF EXISTS second_stories;
CREATE DATABASE second_stories CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE second_stories;

CREATE TABLE users (
 id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(100) NOT NULL,
 email VARCHAR(150) NOT NULL UNIQUE,
 password VARCHAR(255) NOT NULL,
 location VARCHAR(100) DEFAULT NULL,
 bio TEXT,
 avatar LONGTEXT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
 id INT AUTO_INCREMENT PRIMARY KEY,
 seller_id INT NOT NULL,
 name VARCHAR(150) NOT NULL,
 category VARCHAR(100) NOT NULL,
 condition_name VARCHAR(50) NOT NULL,
 price DECIMAL(12,2) NOT NULL,
 original_price DECIMAL(12,2) NULL,
 rating DECIMAL(3,2) DEFAULT 0,
 sold INT DEFAULT 0,
 stock INT DEFAULT 1,
 location VARCHAR(100),
 featured BOOLEAN DEFAULT FALSE,
 image LONGTEXT,
 gallery LONGTEXT,
 description TEXT,
 ownership VARCHAR(100),
 note TEXT,
 status ENUM('active','sold','hidden') DEFAULT 'active',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
 INDEX idx_products_category(category),
 INDEX idx_products_status(status)
);

CREATE TABLE cart_items (
 id INT AUTO_INCREMENT PRIMARY KEY,
 user_id INT NOT NULL,
 product_id INT NOT NULL,
 quantity INT NOT NULL DEFAULT 1,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
 UNIQUE KEY unique_cart_item(user_id,product_id)
);

CREATE TABLE wishlist_items (
 id INT AUTO_INCREMENT PRIMARY KEY,
 user_id INT NOT NULL,
 product_id INT NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
 UNIQUE KEY unique_wishlist_item(user_id,product_id)
);

CREATE TABLE orders (
 id INT AUTO_INCREMENT PRIMARY KEY,
 user_id INT NOT NULL,
 total_amount DECIMAL(12,2) NOT NULL,
 status VARCHAR(50) DEFAULT 'pending',
 shipping_address TEXT,
 shipping_cost DECIMAL(12,2) DEFAULT 0,
 discount DECIMAL(12,2) DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE order_items (
 id INT AUTO_INCREMENT PRIMARY KEY,
 order_id INT NOT NULL,
 product_id INT NOT NULL,
 quantity INT NOT NULL,
 price DECIMAL(12,2) NOT NULL,
 FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
 FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE reviews (
 id INT AUTO_INCREMENT PRIMARY KEY,
 user_id INT NOT NULL,
 product_id INT NOT NULL,
 rating INT NOT NULL,
 comment TEXT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE conversations (
 id INT AUTO_INCREMENT PRIMARY KEY,
 buyer_id INT NOT NULL,
 seller_id INT NOT NULL,
 product_id INT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

CREATE INDEX idx_conversations_pair ON conversations(buyer_id, seller_id);
CREATE INDEX idx_conversations_pair_reverse ON conversations(seller_id, buyer_id);

CREATE TABLE messages (
 id INT AUTO_INCREMENT PRIMARY KEY,
 conversation_id INT NOT NULL,
 sender_id INT NOT NULL,
 message TEXT NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
 FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);
