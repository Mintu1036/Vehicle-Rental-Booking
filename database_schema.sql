-- Vehicle Rental Database Schema
-- Database: vehicle_rent

CREATE DATABASE IF NOT EXISTS `vehicle_rent`;
USE `vehicle_rent`;

-- =========================
-- 1. USER TABLE
-- =========================
CREATE TABLE USER (
  UserID INT PRIMARY KEY AUTO_INCREMENT,
  FirstName VARCHAR(50) NOT NULL,
  LastName VARCHAR(50) NOT NULL,
  Email VARCHAR(100) NOT NULL UNIQUE,
  PhoneNumber VARCHAR(15) NOT NULL UNIQUE,
  Password VARCHAR(255) NOT NULL,
  DateOfBirth DATE NOT NULL,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 2. LOCATION TABLE
-- =========================
CREATE TABLE LOCATION (
  LocationID INT PRIMARY KEY AUTO_INCREMENT,
  Address VARCHAR(150) NOT NULL,
  City VARCHAR(50) NOT NULL,
  State VARCHAR(50) NOT NULL,
  Pincode VARCHAR(10) NOT NULL
);

-- =========================
-- 3. VEHICLE TABLE
-- =========================
CREATE TABLE VEHICLE (
  VehicleID INT PRIMARY KEY AUTO_INCREMENT,
  VehicleName VARCHAR(100) NOT NULL,
  Brand VARCHAR(50) NOT NULL,
  Model VARCHAR(50) NOT NULL,
  VehicleType VARCHAR(50) NOT NULL,
  FuelType VARCHAR(30) NOT NULL,
  TransmissionType VARCHAR(30) NOT NULL,
  PricePerDay DECIMAL(10,2) NOT NULL CHECK (PricePerDay > 0),
  AvailabilityStatus ENUM('Available','Booked','Maintenance','Pending') DEFAULT 'Pending',
  RegistrationNumber VARCHAR(20) NOT NULL UNIQUE,
  OwnerID INT,
  LocationID INT,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (OwnerID)
    REFERENCES USER(UserID)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  FOREIGN KEY (LocationID)
    REFERENCES LOCATION(LocationID)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- =========================
-- 4. BOOKING TABLE
-- =========================
CREATE TABLE BOOKING (
  BookingID INT PRIMARY KEY AUTO_INCREMENT,
  UserID INT NOT NULL,
  VehicleID INT NOT NULL,
  BookingDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  StartDate DATE NOT NULL,
  EndDate DATE NOT NULL,
  TotalPrice DECIMAL(10,2) NOT NULL CHECK (TotalPrice >= 0),
  BookingStatus ENUM('Pending','Confirmed','Cancelled') DEFAULT 'Pending',
  CONSTRAINT chk_dates CHECK (EndDate >= StartDate),
  FOREIGN KEY (UserID)
    REFERENCES USER(UserID)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (VehicleID)
    REFERENCES VEHICLE(VehicleID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- =========================
-- 5. PAYMENT TABLE
-- =========================
CREATE TABLE PAYMENT (
  PaymentID INT PRIMARY KEY AUTO_INCREMENT,
  BookingID INT NOT NULL,
  Amount DECIMAL(10,2) NOT NULL CHECK (Amount > 0),
  PaymentMethod ENUM('UPI','Card','Cash') NOT NULL,
  PaymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  PaymentStatus ENUM('Pending','Completed','Failed') DEFAULT 'Completed',
  FOREIGN KEY (BookingID)
    REFERENCES BOOKING(BookingID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- =========================
-- 6. REVIEW TABLE
-- =========================
CREATE TABLE REVIEW (
  ReviewID INT PRIMARY KEY AUTO_INCREMENT,
  UserID INT NOT NULL,
  VehicleID INT NOT NULL,
  Rating INT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
  Comment TEXT,
  ReviewDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (UserID)
    REFERENCES USER(UserID)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (VehicleID)
    REFERENCES VEHICLE(VehicleID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- =========================
-- 7. VEHICLE IMAGE TABLE
-- =========================
CREATE TABLE VEHICLE_IMAGE (
  ImageID INT PRIMARY KEY AUTO_INCREMENT,
  VehicleID INT NOT NULL,
  ImageURL VARCHAR(255) NOT NULL,
  UploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (VehicleID)
    REFERENCES VEHICLE(VehicleID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Insert sample locations
INSERT INTO LOCATION (Address, City, State, Pincode) VALUES
('123 Main St', 'New York', 'NY', '10001'),
('456 Oak Ave', 'Los Angeles', 'CA', '90001'),
('789 Pine Rd', 'Chicago', 'IL', '60007'),
('321 Elm St', 'Houston', 'TX', '77001'),
('654 Maple Dr', 'Phoenix', 'AZ', '85001');

-- Insert sample vehicles
INSERT INTO VEHICLE (VehicleName, Brand, Model, VehicleType, FuelType, TransmissionType, PricePerDay, RegistrationNumber, LocationID) VALUES
('Toyota Camry Sedan', 'Toyota', 'Camry', 'Sedan', 'Petrol', 'Automatic', 45.00, 'ABC123', 1),
('Honda CR-V SUV', 'Honda', 'CR-V', 'SUV', 'Petrol', 'Automatic', 65.00, 'DEF456', 1),
('Ford F-150 Truck', 'Ford', 'F-150', 'Truck', 'Diesel', 'Manual', 85.00, 'GHI789', 2),
('Harley Sportster', 'Harley-Davidson', 'Sportster', 'Motorcycle', 'Petrol', 'Manual', 35.00, 'JKL012', 3),
('Chevrolet Express Van', 'Chevrolet', 'Express', 'Van', 'Diesel', 'Automatic', 95.00, 'MNO345', 4);

-- Insert sample vehicle images
INSERT INTO VEHICLE_IMAGE (VehicleID, ImageURL) VALUES
(1, 'https://via.placeholder.com/400x300?text=Toyota+Camry+Exterior'),
(1, 'https://via.placeholder.com/400x300?text=Toyota+Camry+Interior'),
(2, 'https://via.placeholder.com/400x300?text=Honda+CR-V+Exterior'),
(2, 'https://via.placeholder.com/400x300?text=Honda+CR-V+Interior'),
(3, 'https://via.placeholder.com/400x300?text=Ford+F150+Exterior'),
(4, 'https://via.placeholder.com/400x300?text=Harley+Sportster+Exterior'),
(5, 'https://via.placeholder.com/400x300?text=Chevrolet+Express+Exterior');
