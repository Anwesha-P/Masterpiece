--
-- This SQL script builds a database for the merchandising audit and replinishment app
--

--Drop previous versions of the tables if they exist
DROP TABLE IF EXISTS ReplenishmentOrders
DROP TABLE IF EXISTS AuditLogs
DROP TABLE IF EXISTS Stores
DROP TABLE IF EXISTS Thresholds

--This is the schema for the stores, AuditLogs, Thresholds, and ReplenishmentOrders tables
CREATE TABLE Stores (
      id TEXT PRIMARY KEY
    , storeName TEXT NOT NULL
    , address TEXT NOT NULL
)

CREATE TABLE AuditLogs (
      id TEXT PRIMARY KEY
    , storeid TEXT REFERENCES Stores(id)
    , sku TEXT NOT NULL
    , quantity INTEGER NOT NULL
    , condition TEXT NOT NULL CHECK (condition IN ('excellent', 'good', 'fair', 'poor'))
    , timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE Thresholds (
      sku TEXT PRIMARY KEY
    , threshold INTEGER NOT NULL
)

CREATE TABLE ReplenishmentOrders (
      id TEXT PRIMARY KEY
    , storeid TEXT REFERENCES Stores(id)
    , sku TEXT NOT NULL
    , quantityNeeded INTEGER NOT NULL
    , createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 


--insert values
INSERT INTO Stores (id, storeName, address) VALUES
('store001', 'Green Haven East', '123 Maple Ave, Boston, MA'),
('store002', 'Sunshine Garden', '456 Oak St, Atlanta, GA'),
('store003', 'Desert Blooms', '789 Palm Dr, Phoenix, AZ'),
('store004', 'Pacific Flora', '321 Ocean Blvd, San Diego, CA'),
('store005', 'Windy City Roots', '111 Lake Shore Dr, Chicago, IL'),
('store006', 'Rocky Mountain Garden', '888 Summit Rd, Denver, CO'),
('store007', 'Lone Star Botanicals', '999 Alamo St, San Antonio, TX'),
('store008', 'Evergreen Valley', '777 Rainier Ave, Seattle, WA');

INSERT INTO Thresholds (sku, threshold) VALUES
('SKU001', 5), ('SKU002', 3), ('SKU003', 8), ('SKU004', 6), ('SKU005', 4),
('SKU006', 10), ('SKU007', 2), ('SKU008', 7), ('SKU009', 6), ('SKU010', 5),
('SKU011', 4), ('SKU012', 3), ('SKU013', 6), ('SKU014', 5), ('SKU015', 9),
('SKU016', 3), ('SKU017', 4), ('SKU018', 8), ('SKU019', 6), ('SKU020', 7),
('SKU021', 2), ('SKU022', 5), ('SKU023', 6), ('SKU024', 4), ('SKU025', 3);

INSERT INTO AuditLogs (id, storeId, sku, quantity, condition) VALUES
-- Store 1
('audit001', 'store001', 'SKU001', 2, 'fair'),
('audit002', 'store001', 'SKU002', 6, 'good'),

-- Store 2
('audit003', 'store002', 'SKU003', 1, 'poor'),
('audit004', 'store002', 'SKU004', 7, 'excellent');