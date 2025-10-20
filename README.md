# Arizona Shower Door Customer Portal

A comprehensive customer portal built for Arizona Shower Door, featuring secure authentication, news management, price book, virtual showroom, and order history tracking.

## 🏗️ Architecture

- **Frontend**: React with TypeScript, hosted on Azure Static Web Apps
- **Backend**: Azure Functions (Node.js) providing REST API
- **Database**: Azure SQL Database with comprehensive schema
- **Authentication**: Azure AD B2C for secure user management
- **Storage**: Azure Blob Storage for images and documents
- **Infrastructure**: Deployed using Bicep templates

## 🚀 Features

### Customer Features
- **Secure Login**: Email/password authentication via Azure AD B2C
- **News Feed**: View company news and announcements
- **Price Book**: Browse products by category (Desert Collection, Bypass Enclosures, Swing Enclosures)
- **Virtual Showroom**: Detailed product photos and descriptions
- **Order History**: View last 30 days of orders based on customer account
- **Contact Form**: Direct communication with the company

### Admin Features
- **News Management**: Create, edit, and manage news articles with expiration dates
- **User Management**: Manage customer accounts and permissions
- **Content Administration**: Control product catalogs and showroom content

## 📁 Project Structure

```
├── frontend/          # React TypeScript application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Application pages
│   │   ├── services/     # API and authentication services
│   │   ├── contexts/     # React contexts (Auth)
│   │   └── types/        # TypeScript definitions
│   └── public/           # Static assets
├── api/               # Azure Functions backend
│   └── src/
│       ├── functions/    # API endpoints
│       └── shared/       # Shared utilities and types
├── database/          # SQL schema and sample data
├── infra/            # Bicep infrastructure templates
└── .github/workflows/ # GitHub Actions CI/CD
```

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- Azure CLI
- Azure Functions Core Tools
- SQL Server or Azure SQL Database

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd customer-portal
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install API dependencies
   cd ../api
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example settings
   cd api
   cp local.settings.json.example local.settings.json
   ```

   Edit `local.settings.json` with your database connection string and other settings.

4. **Set up the database**
   - Create an Azure SQL Database or use SQL Server locally
   - Run the schema script: `database/schema.sql`
   - Optionally load sample data: `database/sample-data.sql`

5. **Start the development servers**
   ```bash
   # Start the API (from api directory)
   npm start

   # Start the frontend (from frontend directory, in a new terminal)
   npm start
   ```

## 🌐 Deployment to Azure

### Automated Deployment (Recommended)

1. **Deploy Infrastructure**
   ```bash
   # Login to Azure
   az login

   # Create resource group
   az group create --name customer-portal-rg --location eastus

   # Deploy infrastructure
   az deployment group create \
     --resource-group customer-portal-rg \
     --template-file infra/main.bicep \
     --parameters @infra/main.parameters.json
   ```

2. **Configure GitHub Actions**
   - Fork this repository
   - In your repository settings, add the secret `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Get the token from the Azure Static Web App resource in the Azure portal
   - Push to the `main` branch to trigger deployment

### Manual Deployment

1. **Create Azure Resources**
   - Azure Static Web App (Standard SKU)
   - Azure SQL Database
   - Azure Storage Account
   - Azure AD B2C tenant

2. **Configure Static Web App**
   - Link to your GitHub repository
   - Set build configuration:
     - App location: `./frontend`
     - API location: `./api`
     - Output location: `build`

3. **Configure Database**
   - Run the SQL scripts from the `database/` folder
   - Update connection strings in the Function App settings

## 🔧 Configuration

### Environment Variables (Azure Function App)

- `DB_CONNECTION_STRING`: Azure SQL Database connection string
- `STORAGE_CONNECTION_STRING`: Azure Storage connection string
- `JWT_SECRET`: Secret for JWT token generation
- `AZURE_AD_B2C_TENANT_ID`: Azure AD B2C tenant ID
- `AZURE_AD_B2C_CLIENT_ID`: Azure AD B2C application ID

### Static Web App Configuration

The `staticwebapp.config.json` file configures:
- Authentication and authorization rules
- Route handling and redirects
- API proxy settings
- Custom headers and MIME types

## 📊 Database Schema

The application uses a comprehensive SQL Server database with the following main tables:

- **Users**: Customer accounts and authentication
- **Categories**: Product categorization
- **Products**: Product catalog with pricing
- **Orders**: Customer orders and order items
- **News**: Company news and announcements
- **ContactSubmissions**: Contact form submissions

## 🔐 Security Features

- Azure AD B2C authentication
- Role-based access control (Customer/Admin)
- API route protection
- SQL injection prevention
- HTTPS-only communication
- CORS configuration

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices

Built with Tailwind CSS for consistent, mobile-first design.

## 🧪 Sample Data

The database includes comprehensive sample data:
- 3 product categories
- 9 products with detailed descriptions
- 3 user accounts (admin and customers)
- Sample orders and news articles
- Realistic Arizona Shower Door company data

## 📞 Support

For support or questions about this application, please contact the development team or refer to the Azure documentation for specific service configurations.

## 📝 License

This project is proprietary software developed for Arizona Shower Door Company.