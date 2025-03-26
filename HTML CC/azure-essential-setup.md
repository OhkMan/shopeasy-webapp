# Essential Azure Setup Guide for ShopEasy

## Step 1: Sign Up for Azure Student Account
1. Go to [Azure for Students](https://azure.microsoft.com/free/students/)
2. Click "Activate now"
3. Sign in with your student email
4. Verify your student status
5. You'll get $100 in credits and free services

## Step 2: Create Azure AD B2C (for Authentication)
1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Azure AD B2C"
4. Click "Create"
5. Fill in these details:
   ```
   Organization name: ShopEasy
   Initial domain name: shopeasy.onmicrosoft.com
   Country/Region: (Choose your region)
   ```
6. Click "Review + create" then "Create"

## Step 3: Create Storage Account (for Images and Files)
1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Storage account"
4. Click "Create"
5. Fill in these details:
   ```
   Resource group: shopeasy-rg
   Storage account name: shopeasystorage
   Region: (Choose closest to you)
   Performance: Standard
   Redundancy: LRS
   ```
6. Click "Review + create" then "Create"

## Step 4: Create Containers in Storage
1. Go to your Storage Account
2. Click "Containers" in the left menu
3. Create these containers:
   ```
   product-images
   user-avatars
   static-files
   ```

## Step 5: Configure Your Web App
1. Go to your Web App
2. Click "Configuration" in the left menu
3. Add these settings:
```
AZURE_B2C_TENANT=your_tenant_name
AZURE_B2C_CLIENT_ID=your_client_id
AZURE_STORAGE_ACCOUNT=shopeasystorage
AZURE_STORAGE_CONTAINER=product-images
```

## Step 6: Update Your Code
1. Update the Azure configuration in `app.js`:
```javascript
const Azure = {
    storage: {
        accountName: 'shopeasystorage',
        containerName: 'product-images'
    }
};
```

## Step 7: Deploy Your Code
1. Install Azure CLI:
```bash
winget install -e --id Microsoft.AzureCLI
```

2. Deploy your code:
```bash
az login
cd your-project-folder
az webapp up --name shopeasy-webapp --resource-group shopeasy-rg
```

## Important Tips

1. **Save Your Credentials**:
   - B2C Tenant name
   - B2C Client ID
   - Storage account name
   - Storage account key

2. **Security**:
   - Never commit credentials to source control
   - Use environment variables
   - Enable HTTPS
   - Use managed identities where possible

3. **Cost Management**:
   - Monitor your usage in Azure Portal
   - Set up alerts at 80% of your credits
   - Clean up unused resources

## Free Services You Get
- Azure AD B2C (free tier)
- Storage Account (5GB)
- Web App (F1)
- SSL Certificate

## Next Steps
1. Test user authentication
2. Upload some product images
3. Test file storage
4. Monitor your application

## Support
- [Azure Student Support](https://azure.microsoft.com/student-hub/)
- [Azure AD B2C Documentation](https://docs.microsoft.com/azure/active-directory-b2c/)
- [Azure Storage Documentation](https://docs.microsoft.com/azure/storage/) 