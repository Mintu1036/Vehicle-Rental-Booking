-- Sample Data for Vehicle Rental Database
USE vehicle_rent;

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
