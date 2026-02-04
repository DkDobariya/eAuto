
CREATE DATABASE app_eauto CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullname VARCHAR(255),
  email VARCHAR(255),
  contact VARCHAR(20),
  birthdate DATE,
  gender VARCHAR(10),
  password VARCHAR(255) -- needed for login
);

CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    brand VARCHAR(100),
    quantity INT DEFAULT 1
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  fullname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip VARCHAR(20) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    discount_amount DECIMAL(10,2),
    image VARCHAR(255),
    brand VARCHAR(100),
    main_brand ENUM('BRAND B', 'Hero', 'Honda') NOT NULL,
    rating FLOAT,
    reviews INT,
    stock_status ENUM('In Stock', 'Sold Out') DEFAULT 'In Stock'
);

INSERT INTO products (
    product_name, price, original_price, discount_amount,
    image, brand, main_brand, rating, reviews, stock_status
) VALUES
-- Product 1
('MINDA Lock Set for Bajaj Pulsar 150CC 2 Pin', 1189.00, NULL, NULL, 'p1.jpg', 'SPARK MINDA', 'BRAND B', 5.0, 25, 'In Stock'),

-- Product 2
('GOETZE Piston Cylinder Kit for Bajaj Discover 100 | 47mm Dia', 2050.00, 2499.00, 449.00, 'p2.jpg', 'GOETZE', 'BRAND B', 5.0, 5, 'Sold Out'),

-- Product 3
('ENDURANCE Rear Mono Shock Absorber for Bajaj Pulsar', 3330.00, 4260.00, 930.00, 'p3.jpg', 'ENDURANCE', 'BRAND B', 4.0, 24, 'In Stock'),

-- Product 4
('MINDA Lock Set for Bajaj Pulsar 4 Pin', 717.00, 1038.00, 321.00, 'p4.jpg', 'SPARK MINDA', 'BRAND B', 4.0, 1, 'Sold Out'),

-- Product 5
('ENDURANCE Clutch Cable for Bajaj Pulsar 220', 299.00, 799.00, 500.00, 'p5.jpg', 'ENDURANCE', 'BRAND B', 5.0, 18, 'In Stock'),

-- Product 6
('GOETZE Clutch Plate Set for Bajaj Avenger 220', 1150.00, 2000.00, 850.00, 'p6.jpg', 'GOETZE', 'BRAND B', 4.0, 11, 'In Stock'),

-- Product 7
('Rolon Chain Sprocket Kit for Bajaj Pulsar 180', 1899.00, NULL, NULL, 'p7.jpg', 'ROLON', 'BRAND B', 5.0, 9, 'In Stock'),

-- Product 8
('Bajaj Genuine Front Brake Pads for Pulsar 200NS', 650.00, NULL, NULL, 'p8.jpg', 'BAJAJ GENUINE', 'BRAND B', 4.0, 7, 'In Stock'),

-- Product 9
('Bajaj Genuine Headlamp Assembly for Pulsar 220F', 2450.00, NULL, NULL, 'p9.jpg', 'BAJAJ GENUINE', 'BRAND B', 5.0, 13, 'In Stock');

INSERT INTO products (
 product_name, price, original_price, discount_amount,
    image, brand, main_brand, rating, reviews, stock_status
) VALUES
-- Product 1
('Ensons Petrol Tank for Hero HF Deluxe 2016 (Black/Red)', 4120.00, 6170.00, 2050.00, 'p10.jpg', 'ENSONS', 'Hero', 5.0, 7, 'In Stock'),

-- Product 2
('Front Fork Pipe for Hero Splendor, Passion, CD Dawn, Glamour', 1610.00, 2420.00, 810.00, 'p11.jpg', 'ENDURANCE', 'Hero', 3.0, 3, 'In Stock'),

-- Product 3 (Sold out, no form)
('Engine Belt for Honda Activa Old | Dio | Maestro', 640.00, 910.00, 270.00, 'p12.jpg', 'OES ENGINE BELT', 'Hero', 1.0, 1, 'Sold Out'),

-- Product 4
('Gear Pinion Set for Hero Maestro | Gear Assembly', 1890.00, 2700.00, 810.00, 'p13.jpg', 'EAUTO', 'Hero', 1.0, 1, 'In Stock'),

-- Product 5 (Sold out)
('Carburetor Repair Kit for Hero Splendor', 640.00, 850.00, 210.00, 'p14.jpg', 'EAUTO', 'Hero', 5.0, 7, 'Sold Out'),

-- Product 6 (Sold out)
('Crank Shaft Assembly for Hero Splendor', 2190.00, 3800.00, 1610.00, 'p15.jpg', 'EAUTO', 'Hero', 4.0, 10, 'Sold Out'),

-- Product 7
('Rolon Chain Sprocket Kit for Hero Xtreme/Xpulse', 1740.00, 2436.00, 696.00, 'p16.jpg', 'ROLON', 'Hero', 2.0, 2, 'In Stock'),

-- Product 8
('Clutch Plate for Hero Karizma R / ZMR', 750.00, 1050.00, 300.00, 'p17.jpg', 'OES CLUTCH PLATE', 'Hero', 5.0, 5, 'In Stock'),

-- Product 9
('Rear Shock Absorber for Hero Hunk | Karizma ZMR', 2970.00, 8800.00, 5830.00, 'p18.jpg', 'SANRI ENGINEERING', 'Hero', 4.0, 20, 'In Stock');

INSERT INTO products (
    product_name, price, original_price, discount_amount,
    image, brand, main_brand, rating, reviews, stock_status
) VALUES
-- Product 1
('Techlon Starter Motor for Hero and Honda Scooters', 1040.00, 1287.00, 247.00, 'p19.jpg', 'TECHLON', 'Honda', 5.0, 7, 'In Stock'),

-- Product 2 (Sold Out)
('Engine Valve Set for Honda Activa 110', 500.00, 710.00, 210.00, 'p20.jpg', 'OES ENGINE VALVE SET', 'Honda', 4.0, 4, 'Sold Out'),

-- Product 3
('RR Unit for Honda CBR and Hero Karizma', 2310.00, 3470.00, 1160.00, 'p21.jpg', 'OES RR UNIT', 'Honda', 5.0, 9, 'In Stock'),

-- Product 4
('ROLON Chain Sprocket Kit for Honda CBR 250R', 2150.00, 3010.00, 860.00, 'p22.jpg', 'ROLON', 'Honda', 3.0, 3, 'In Stock'),

-- Product 5 (Sold Out)
('OES Wiring Harness for Honda Eterno 150', 1340.00, 1820.00, 480.00, 'p23.jpg', 'OES WIRING', 'Honda', 5.0, 6, 'Sold Out'),

-- Product 6
('Cam Shaft Assembly for Honda Activa 110 and Navi', 1280.00, 1792.00, 512.00, 'p24.jpg', 'OES CAM SHAFT', 'Honda', 5.0, 5, 'In Stock'),

-- Product 7
('Roller Weights for Honda Activa HET, Navi, Aviator', 565.00, 791.00, 226.00, 'p25.jpg', 'OES ROLLER WEIGHTS', 'Honda', 3.0, 5, 'In Stock'),

-- Product 8
('Lumax Tail Light Assembly for Honda CB Trigger', 1450.00, 1993.00, 543.00, 'p26.jpg', 'LUMAX', 'Honda', 1.0, 1, 'In Stock'),

-- Product 9
('Head Light Set for Honda CB Hornet 160R', 1460.00, 2150.00, 690.00, 'p27.jpg', 'OES HEAD LIGHT SET', 'Honda', 5.0, 31, 'In Stock');

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

