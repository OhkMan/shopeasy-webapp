# Simple Azure Setup Guide for ShopEasy

## Step 1: Sign Up for Azure Student Account
1. Go to [Azure for Students](https://azure.microsoft.com/free/students/)
2. Click "Activate now"
3. Sign in with your student email
4. Verify your student status
5. You'll get $100 in credits and free services

## Step 2: Create Your Web App with Database
1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource" (the + button)
3. Search for "Web App + Database"
4. Click "Create"
5. Fill in these details:
   ```
   Resource Group: shopeasy-rg
   Web App Name: shopeasy-webapp
   Runtime Stack: Node.js
   Operating System: Windows
   Region: (Choose closest to you)
   App Service Plan: Free F1
   Database: Create new
     - Name: shopeasy-db
     - Server: Create new
       - Name: shopeasy-server
       - Admin: shopeasyadmin
       - Password: (Create a strong password)
   ```
6. Click "Review + create" then "Create"

## Step 3: Set Up Database Tables
1. Go to your SQL Database
2. Click "Query editor"
3. Copy and paste this SQL:
```sql
-- Products Table
CREATE TABLE Products (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description NVARCHAR(500),
    category NVARCHAR(50),
    image_url NVARCHAR(200)
);

-- Users Table
CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(100) UNIQUE NOT NULL,
    password_hash NVARCHAR(200) NOT NULL,
    name NVARCHAR(100)
);

-- Orders Table
CREATE TABLE Orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT FOREIGN KEY REFERENCES Users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status NVARCHAR(20) DEFAULT 'pending'
);
```
4. Click "Run"

## Step 4: Configure Your Web App
1. Go to your Web App
2. Click "Configuration" in the left menu
3. Add these settings:
```
DB_HOST=shopeasy-server.database.windows.net
DB_NAME=shopeasy-db
DB_USER=shopeasyadmin
DB_PASSWORD=(your database password)
```

## Step 5: Deploy Your Code
1. Install Azure CLI:
```bash
winget install -e --id Microsoft.AzureCLI
```

2. Open terminal and run:
```bash
az login
cd your-project-folder
az webapp up --name shopeasy-webapp --resource-group shopeasy-rg
```

## Step 6: Test Your Setup
1. Go to your web app URL (shopeasy-webapp.azurewebsites.net)
2. Test these features:
   - User registration
   - Product listing
   - Shopping cart
   - Order placement

## Important Tips

1. **Save Your Credentials**:
   - Database password
   - Server name
   - Database name
   - Web app URL

2. **Monitor Your Usage**:
   - Check Azure Portal's "Cost Management"
   - Set up alerts at 80% of your credits

3. **Security**:
   - Never share your database password
   - Keep your connection strings secure
   - Use HTTPS for your website

4. **Troubleshooting**:
   - Check "Application Insights" for errors
   - Use "Log stream" in Web App
   - Check database connection in "Query editor"

## Free Services You Get
- Web App (F1): 1GB RAM, 1 CPU core
- SQL Database: 2GB storage
- Application Insights
- SSL Certificate

## Next Steps
1. Add your products to the database
2. Set up user authentication
3. Configure your domain
4. Set up monitoring
5. Test all features

## Support
- [Azure Student Support](https://azure.microsoft.com/student-hub/)
- [Azure Documentation](https://docs.microsoft.com/azure/)
- [Azure Community](https://azure.microsoft.com/community/) 