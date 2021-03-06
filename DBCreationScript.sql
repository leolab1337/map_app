DROP DATABASE IF EXISTS mapApp;
CREATE DATABASE mapApp;
USE mapApp;

CREATE TABLE Manufacturer
(
    manufacturerUsername VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    PRIMARY KEY (manufacturerUsername)
);

CREATE TABLE Client
(
    clientUsername VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    PRIMARY KEY (clientUsername)
);

CREATE TABLE Address
(
    addressId INT NOT NULL AUTO_INCREMENT,
    city VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    building VARCHAR(10) NOT NULL,
    flat INT,
    lon DOUBLE NOT NULL,
    lat DOUBLE NOT NULL,
    PRIMARY KEY (addressId)
);

CREATE TABLE OrderData
(
    orderId INT NOT NULL AUTO_INCREMENT,
    manufacturerUsername VARCHAR(255) NOT NULL,
    clientUsername VARCHAR(255) NOT NULL,
    shipmentAddressId INT NOT NULL,
    deliveryAddressId INT NOT NULL,
    PRIMARY KEY (orderId),
    FOREIGN KEY (manufacturerUsername) REFERENCES Manufacturer(manufacturerUsername),
    FOREIGN KEY (clientUsername) REFERENCES Client(clientUsername),
    FOREIGN KEY (shipmentAddressId) REFERENCES Address(addressId),
    FOREIGN KEY (deliveryAddressId) REFERENCES Address(addressId)
);

CREATE TABLE AsShipmentAddress
(
    addressId INT NOT NULL,
    manufacturerUsername VARCHAR(255) NOT NULL,
    PRIMARY KEY (addressId, manufacturerUsername),
    FOREIGN KEY (addressId) REFERENCES Address(addressId),
    FOREIGN KEY (manufacturerUsername) REFERENCES Manufacturer(manufacturerUsername)
);

CREATE TABLE AsDeliveryAddress
(
    addressId INT NOT NULL,
    clientUsername VARCHAR(255) NOT NULL,
    PRIMARY KEY (addressId, clientUsername),
    FOREIGN KEY (addressId) REFERENCES Address(addressId),
    FOREIGN KEY (clientUsername) REFERENCES Client(clientUsername)
);

CREATE TABLE Data
(
    name VARCHAR(255) NOT NULL PRIMARY KEY,
    value VARCHAR(255),
    lastUpdated DATETIME DEFAULT NOW() ON UPDATE NOW()
);

CREATE TABLE Area(
    areaName VARCHAR(255) NOT NULL PRIMARY KEY,
    type VARCHAR(255) NOT NULL
);
CREATE TABLE AreaCoordinates(
    coordinateId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    orderNumber INT NOT NULL,
    polygonNumber INT NOT NULL,
    lon DOUBLE NOT NULL,
    lat DOUBLE NOT NULL,
    areaName VARCHAR(255) NOT NULL,
    FOREIGN KEY (areaName) REFERENCES Area(areaName)
);

CREATE TABLE TMS(
    stationId INT NOT NULL PRIMARY KEY,
    sensor1Id INT,
    sensor2Id INT,
    lon DOUBLE NOT NULL,
    lat DOUBLE NOT NULL
);

INSERT INTO AREA (areaName, type) VALUES ('SlowTraffic', 'MultiPolygon');

INSERT INTO DATA (name, value) VALUES ('gasoline', '2.1');
INSERT INTO DATA (name, value) VALUES ('diesel', '2.2');
INSERT INTO DATA (name, value) VALUES ('lpg', '1.9');
INSERT INTO DATA (name, value) VALUES ('TrafficSituation', '');