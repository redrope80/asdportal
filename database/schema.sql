-- Customer Portal Database Schema
-- Run this script to create the database structure

-- Create Users table
CREATE TABLE Users (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    email NVARCHAR(255) NOT NULL UNIQUE,
    firstName NVARCHAR(100) NOT NULL,
    lastName NVARCHAR(100) NOT NULL,
    customerCode NVARCHAR(50) NOT NULL,
    role NVARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    passwordHash NVARCHAR(255), -- For future password authentication
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    lastLoginAt DATETIME2,
    isActive BIT NOT NULL DEFAULT 1,
    INDEX IX_Users_Email (email),
    INDEX IX_Users_CustomerCode (customerCode)
);

-- Create Categories table
CREATE TABLE Categories (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(100) NOT NULL,
    slug NVARCHAR(100) NOT NULL UNIQUE,
    description NVARCHAR(500),
    imageUrl NVARCHAR(500),
    sortOrder INT NOT NULL DEFAULT 0,
    isActive BIT NOT NULL DEFAULT 1,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    INDEX IX_Categories_Slug (slug),
    INDEX IX_Categories_Active_Sort (isActive, sortOrder)
);

-- Create Products table
CREATE TABLE Products (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(200) NOT NULL,
    sku NVARCHAR(50) NOT NULL UNIQUE,
    description NVARCHAR(MAX),
    shortDescription NVARCHAR(500),
    price DECIMAL(10,2) NOT NULL,
    categoryId UNIQUEIDENTIFIER NOT NULL,
    isActive BIT NOT NULL DEFAULT 1,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (categoryId) REFERENCES Categories(id),
    INDEX IX_Products_SKU (sku),
    INDEX IX_Products_Category (categoryId),
    INDEX IX_Products_Active (isActive)
);

-- Create ProductImages table
CREATE TABLE ProductImages (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    productId UNIQUEIDENTIFIER NOT NULL,
    url NVARCHAR(500) NOT NULL,
    alt NVARCHAR(200),
    caption NVARCHAR(500),
    sortOrder INT NOT NULL DEFAULT 0,
    isPrimary BIT NOT NULL DEFAULT 0,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE,
    INDEX IX_ProductImages_Product (productId),
    INDEX IX_ProductImages_Primary (productId, isPrimary)
);

-- Create ProductSpecifications table
CREATE TABLE ProductSpecifications (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    productId UNIQUEIDENTIFIER NOT NULL,
    name NVARCHAR(100) NOT NULL,
    value NVARCHAR(200) NOT NULL,
    unit NVARCHAR(20),
    sortOrder INT NOT NULL DEFAULT 0,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE,
    INDEX IX_ProductSpecs_Product (productId)
);

-- Create News table
CREATE TABLE News (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    title NVARCHAR(200) NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    summary NVARCHAR(500),
    imageUrl NVARCHAR(500),
    publishedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    expiresAt DATETIME2,
    isActive BIT NOT NULL DEFAULT 1,
    authorId UNIQUEIDENTIFIER NOT NULL,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (authorId) REFERENCES Users(id),
    INDEX IX_News_Published (publishedAt DESC),
    INDEX IX_News_Active_Published (isActive, publishedAt DESC),
    INDEX IX_News_Expires (expiresAt)
);

-- Create Orders table
CREATE TABLE Orders (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    orderNumber NVARCHAR(50) NOT NULL UNIQUE,
    customerCode NVARCHAR(50) NOT NULL,
    customerName NVARCHAR(200) NOT NULL,
    orderDate DATETIME2 NOT NULL,
    totalAmount DECIMAL(12,2) NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    
    -- Shipping Address
    shippingStreet NVARCHAR(200) NOT NULL,
    shippingCity NVARCHAR(100) NOT NULL,
    shippingState NVARCHAR(50) NOT NULL,
    shippingZipCode NVARCHAR(20) NOT NULL,
    shippingCountry NVARCHAR(50) NOT NULL DEFAULT 'USA',
    
    -- Billing Address
    billingStreet NVARCHAR(200) NOT NULL,
    billingCity NVARCHAR(100) NOT NULL,
    billingState NVARCHAR(50) NOT NULL,
    billingZipCode NVARCHAR(20) NOT NULL,
    billingCountry NVARCHAR(50) NOT NULL DEFAULT 'USA',
    
    notes NVARCHAR(1000),
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    INDEX IX_Orders_OrderNumber (orderNumber),
    INDEX IX_Orders_Customer (customerCode),
    INDEX IX_Orders_Date (orderDate DESC),
    INDEX IX_Orders_Status (status)
);

-- Create OrderItems table
CREATE TABLE OrderItems (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    orderId UNIQUEIDENTIFIER NOT NULL,
    productId UNIQUEIDENTIFIER NOT NULL,
    productName NVARCHAR(200) NOT NULL, -- Denormalized for historical data
    productSku NVARCHAR(50) NOT NULL,   -- Denormalized for historical data
    quantity INT NOT NULL,
    unitPrice DECIMAL(10,2) NOT NULL,
    totalPrice DECIMAL(12,2) NOT NULL,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (orderId) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES Products(id),
    INDEX IX_OrderItems_Order (orderId)
);

-- Create ContactSubmissions table (for contact form submissions)
CREATE TABLE ContactSubmissions (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    phone NVARCHAR(20),
    subject NVARCHAR(200) NOT NULL,
    message NVARCHAR(MAX) NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in-progress', 'resolved', 'closed')),
    submittedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    respondedAt DATETIME2,
    assignedToId UNIQUEIDENTIFIER,
    FOREIGN KEY (assignedToId) REFERENCES Users(id),
    INDEX IX_ContactSubmissions_Status (status),
    INDEX IX_ContactSubmissions_Date (submittedAt DESC)
);

-- Create triggers to update the updatedAt columns
GO
CREATE TRIGGER TR_Categories_UpdatedAt ON Categories
AFTER UPDATE AS
UPDATE Categories SET updatedAt = GETDATE() WHERE id IN (SELECT id FROM inserted);

GO
CREATE TRIGGER TR_Products_UpdatedAt ON Products
AFTER UPDATE AS
UPDATE Products SET updatedAt = GETDATE() WHERE id IN (SELECT id FROM inserted);

GO
CREATE TRIGGER TR_News_UpdatedAt ON News
AFTER UPDATE AS
UPDATE News SET updatedAt = GETDATE() WHERE id IN (SELECT id FROM inserted);

GO
CREATE TRIGGER TR_Orders_UpdatedAt ON Orders
AFTER UPDATE AS
UPDATE Orders SET updatedAt = GETDATE() WHERE id IN (SELECT id FROM inserted);

GO