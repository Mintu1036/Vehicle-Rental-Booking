-- Update existing database to support user-owned vehicles
USE vehicle_rent;

-- Add OwnerID column to VEHICLE table
ALTER TABLE VEHICLE 
ADD COLUMN OwnerID INT NULL AFTER RegistrationNumber,
ADD FOREIGN KEY (OwnerID) REFERENCES USER(UserID) ON DELETE SET NULL ON UPDATE CASCADE;

-- Update AvailabilityStatus enum to include 'Pending'
ALTER TABLE VEHICLE 
MODIFY COLUMN AvailabilityStatus ENUM('Available','Booked','Maintenance','Pending') DEFAULT 'Pending';

-- Update existing sample vehicles to have no owner (admin vehicles)
UPDATE VEHICLE SET OwnerID = NULL WHERE OwnerID IS NULL;
