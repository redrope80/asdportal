-- Sample Data for Customer Portal
-- Run this script after creating the schema to populate with test data

-- Insert Categories
INSERT INTO Categories (id, name, slug, description, sortOrder) VALUES
(NEWID(), 'Desert Collection', 'desert-collection', 'Beautiful frameless shower doors inspired by desert landscapes', 1),
(NEWID(), 'Bypass Enclosures', 'bypass-enclosures', 'Space-saving sliding shower door systems', 2),
(NEWID(), 'Swing Enclosures', 'swing-enclosures', 'Traditional hinged shower door solutions', 3);

-- Get category IDs for reference
DECLARE @DesertCategoryId UNIQUEIDENTIFIER = (SELECT id FROM Categories WHERE slug = 'desert-collection');
DECLARE @BypassCategoryId UNIQUEIDENTIFIER = (SELECT id FROM Categories WHERE slug = 'bypass-enclosures');
DECLARE @SwingCategoryId UNIQUEIDENTIFIER = (SELECT id FROM Categories WHERE slug = 'swing-enclosures');

-- Insert Sample Users
INSERT INTO Users (id, email, firstName, lastName, customerCode, role) VALUES
(NEWID(), 'admin@arizonashowerdoor.com', 'Admin', 'User', 'ADMIN001', 'admin'),
(NEWID(), 'john.doe@example.com', 'John', 'Doe', 'CUST001', 'customer'),
(NEWID(), 'jane.smith@example.com', 'Jane', 'Smith', 'CUST002', 'customer'),
(NEWID(), 'mike.johnson@example.com', 'Mike', 'Johnson', 'CUST003', 'customer');

-- Get admin user ID for news articles
DECLARE @AdminUserId UNIQUEIDENTIFIER = (SELECT id FROM Users WHERE email = 'admin@arizonashowerdoor.com');

-- Insert Sample Products for Desert Collection
INSERT INTO Products (id, name, sku, description, shortDescription, price, categoryId) VALUES
(NEWID(), 'Desert Mirage Frameless', 'DM-001', 'Our signature Desert Mirage frameless shower door combines sleek design with durability. Features tempered glass and premium hardware finishes.', 'Premium frameless shower door with desert-inspired design', 1299.99, @DesertCategoryId),
(NEWID(), 'Sedona Supreme', 'SS-001', 'Inspired by the red rocks of Sedona, this frameless door features a unique bronze hardware finish and crystal-clear tempered glass.', 'Bronze hardware frameless door with Sedona styling', 1449.99, @DesertCategoryId),
(NEWID(), 'Phoenix Elite', 'PE-001', 'The Phoenix Elite represents the pinnacle of our desert collection with brushed nickel hardware and anti-spot glass treatment.', 'Elite frameless door with anti-spot glass treatment', 1599.99, @DesertCategoryId);

-- Insert Sample Products for Bypass Enclosures
INSERT INTO Products (id, name, sku, description, shortDescription, price, categoryId) VALUES
(NEWID(), 'Classic Bypass 60"', 'CB-60', 'Traditional bypass shower door system perfect for smaller bathrooms. Smooth sliding action with adjustable panels.', 'Space-saving 60-inch bypass shower door system', 899.99, @BypassCategoryId),
(NEWID(), 'Modern Bypass 72"', 'MB-72', 'Contemporary bypass design with sleek lines and premium rollers for effortless operation.', 'Modern 72-inch bypass with premium hardware', 1099.99, @BypassCategoryId),
(NEWID(), 'Luxury Bypass 84"', 'LB-84', 'Our largest bypass system featuring heavy-duty hardware and thick tempered glass panels.', 'Premium 84-inch bypass for luxury installations', 1399.99, @BypassCategoryId);

-- Insert Sample Products for Swing Enclosures
INSERT INTO Products (id, name, sku, description, shortDescription, price, categoryId) VALUES
(NEWID(), 'Traditional Swing 36"', 'TS-36', 'Classic hinged shower door with traditional styling and reliable hardware.', 'Traditional 36-inch hinged shower door', 799.99, @SwingCategoryId),
(NEWID(), 'Contemporary Swing 42"', 'CS-42', 'Modern hinged door design with concealed hinges and clean lines.', 'Contemporary 42-inch swing door with concealed hinges', 949.99, @SwingCategoryId),
(NEWID(), 'Premium Swing 48"', 'PS-48', 'Our premium swing door featuring soft-close hinges and premium glass.', 'Premium 48-inch swing door with soft-close hinges', 1199.99, @SwingCategoryId);

-- Add Product Images (using placeholder URLs - in production, these would be actual image URLs)
DECLARE @ProductId UNIQUEIDENTIFIER;

-- Desert Mirage images
SET @ProductId = (SELECT id FROM Products WHERE sku = 'DM-001');
INSERT INTO ProductImages (productId, url, alt, isPrimary, sortOrder) VALUES
(@ProductId, 'https://images.arizonashowerdoor.com/desert-mirage-1.jpg', 'Desert Mirage Frameless Door - Main View', 1, 1),
(@ProductId, 'https://images.arizonashowerdoor.com/desert-mirage-2.jpg', 'Desert Mirage Frameless Door - Detail View', 0, 2),
(@ProductId, 'https://images.arizonashowerdoor.com/desert-mirage-3.jpg', 'Desert Mirage Frameless Door - Installed', 0, 3);

-- Sedona Supreme images
SET @ProductId = (SELECT id FROM Products WHERE sku = 'SS-001');
INSERT INTO ProductImages (productId, url, alt, isPrimary, sortOrder) VALUES
(@ProductId, 'https://images.arizonashowerdoor.com/sedona-supreme-1.jpg', 'Sedona Supreme Door - Main View', 1, 1),
(@ProductId, 'https://images.arizonashowerdoor.com/sedona-supreme-2.jpg', 'Sedona Supreme Door - Bronze Hardware Detail', 0, 2);

-- Add Product Specifications
SET @ProductId = (SELECT id FROM Products WHERE sku = 'DM-001');
INSERT INTO ProductSpecifications (productId, name, value, unit, sortOrder) VALUES
(@ProductId, 'Glass Thickness', '8', 'mm', 1),
(@ProductId, 'Height Range', '72-96', 'inches', 2),
(@ProductId, 'Width Range', '28-60', 'inches', 3),
(@ProductId, 'Hardware Finish', 'Brushed Stainless Steel', '', 4),
(@ProductId, 'Glass Type', 'Tempered Safety Glass', '', 5);

SET @ProductId = (SELECT id FROM Products WHERE sku = 'CB-60');
INSERT INTO ProductSpecifications (productId, name, value, unit, sortOrder) VALUES
(@ProductId, 'Glass Thickness', '6', 'mm', 1),
(@ProductId, 'Door Width', '60', 'inches', 2),
(@ProductId, 'Height', '72', 'inches', 3),
(@ProductId, 'Hardware Finish', 'Chrome', '', 4),
(@ProductId, 'Operation', 'Sliding Bypass', '', 5);

-- Insert Sample News Articles
INSERT INTO News (id, title, content, summary, publishedAt, authorId) VALUES
(NEWID(), 'New Desert Collection Launch', 
'We are excited to announce the launch of our new Desert Collection, featuring frameless shower doors inspired by the natural beauty of Arizona''s desert landscape. Each door in this collection combines premium materials with stunning design elements that bring the serenity of the desert into your bathroom.

The Desert Collection includes three signature models: Desert Mirage, Sedona Supreme, and Phoenix Elite. Each model features our proprietary anti-spot glass treatment and premium hardware finishes that complement any bathroom décor.

Visit our showroom to see these beautiful doors in person and speak with our design consultants about creating the perfect shower enclosure for your home.',
'Introducing our new Desert Collection of premium frameless shower doors',
DATEADD(day, -5, GETDATE()),
@AdminUserId),

(NEWID(), 'Spring Installation Special', 
'This spring, we''re offering special pricing on professional installation services. Book your shower door installation during March and April to take advantage of these limited-time savings.

Our certified installation team has over 20 years of experience and provides a full warranty on all work. We handle everything from measurement to final cleanup, ensuring your new shower door is installed perfectly.

Contact us today to schedule your free in-home consultation and measurement. Our design team will help you select the perfect door for your space and style preferences.',
'Special spring pricing on professional installation services',
DATEADD(day, -10, GETDATE()),
@AdminUserId),

(NEWID(), 'Maintenance Tips for Shower Doors', 
'Proper maintenance ensures your shower door will look beautiful and function smoothly for years to come. Here are our top tips for keeping your shower door in perfect condition:

1. Clean weekly with a non-abrasive glass cleaner
2. Dry the door after each use to prevent water spots
3. Check and tighten hardware every 6 months
4. Apply glass treatment annually for easy cleaning
5. Inspect seals and replace if worn

For professional maintenance service or replacement parts, contact our service department. We''re here to help you get the most from your Arizona Shower Door investment.',
'Essential maintenance tips to keep your shower door looking new',
DATEADD(day, -15, GETDATE()),
@AdminUserId);

-- Insert Sample Orders
DECLARE @Customer1Id NVARCHAR(50) = 'CUST001';
DECLARE @Customer2Id NVARCHAR(50) = 'CUST002';

INSERT INTO Orders (id, orderNumber, customerCode, customerName, orderDate, totalAmount, status,
                  shippingStreet, shippingCity, shippingState, shippingZipCode,
                  billingStreet, billingCity, billingState, billingZipCode) VALUES
(NEWID(), 'ASD-240001-ABC123', @Customer1Id, 'John Doe', DATEADD(day, -7, GETDATE()), 1299.99, 'shipped',
 '123 Main St', 'Phoenix', 'AZ', '85001',
 '123 Main St', 'Phoenix', 'AZ', '85001'),

(NEWID(), 'ASD-240002-DEF456', @Customer2Id, 'Jane Smith', DATEADD(day, -14, GETDATE()), 899.99, 'delivered',
 '456 Oak Ave', 'Scottsdale', 'AZ', '85251',
 '456 Oak Ave', 'Scottsdale', 'AZ', '85251'),

(NEWID(), 'ASD-240003-GHI789', @Customer1Id, 'John Doe', DATEADD(day, -21, GETDATE()), 1599.99, 'delivered',
 '123 Main St', 'Phoenix', 'AZ', '85001',
 '123 Main St', 'Phoenix', 'AZ', '85001');

-- Insert Order Items
DECLARE @Order1Id UNIQUEIDENTIFIER = (SELECT id FROM Orders WHERE orderNumber = 'ASD-240001-ABC123');
DECLARE @Order2Id UNIQUEIDENTIFIER = (SELECT id FROM Orders WHERE orderNumber = 'ASD-240002-DEF456');
DECLARE @Order3Id UNIQUEIDENTIFIER = (SELECT id FROM Orders WHERE orderNumber = 'ASD-240003-GHI789');

INSERT INTO OrderItems (orderId, productId, productName, productSku, quantity, unitPrice, totalPrice) VALUES
(@Order1Id, (SELECT id FROM Products WHERE sku = 'DM-001'), 'Desert Mirage Frameless', 'DM-001', 1, 1299.99, 1299.99),
(@Order2Id, (SELECT id FROM Products WHERE sku = 'CB-60'), 'Classic Bypass 60"', 'CB-60', 1, 899.99, 899.99),
(@Order3Id, (SELECT id FROM Products WHERE sku = 'PE-001'), 'Phoenix Elite', 'PE-001', 1, 1599.99, 1599.99);

-- Insert Sample Contact Submissions
INSERT INTO ContactSubmissions (name, email, phone, subject, message, status, submittedAt) VALUES
('Robert Wilson', 'robert.wilson@email.com', '(480) 555-0123', 'Question about Desert Collection', 'I''m interested in learning more about the Desert Mirage frameless door. Can someone contact me to schedule a consultation?', 'new', DATEADD(hour, -2, GETDATE())),
('Lisa Garcia', 'lisa.garcia@email.com', '(602) 555-0456', 'Installation Timeline', 'I recently ordered a bypass door and wanted to check on the installation timeline. When can I expect the installation team to contact me?', 'in-progress', DATEADD(day, -1, GETDATE())),
('David Chen', 'david.chen@email.com', '', 'Product Warranty Information', 'Could you please send me detailed warranty information for your shower doors? I''m comparing different manufacturers.', 'resolved', DATEADD(day, -3, GETDATE()));

PRINT 'Sample data inserted successfully!';