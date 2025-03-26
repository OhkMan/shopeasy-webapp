const msalConfig = {
    auth: {
        clientId: "YOUR_CLIENT_ID", // Will be provided by Azure AD B2C
        authority: "https://YOUR_TENANT.b2clogin.com/YOUR_TENANT.onmicrosoft.com/B2C_1_signupsignin1",
        knownAuthorities: ["YOUR_TENANT.b2clogin.com"],
        redirectUri: "https://shopeasy-webapp.azurewebsites.net",
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};

const loginRequest = {
    scopes: ["openid", "profile"],
};

const tokenRequest = {
    scopes: ["https://YOUR_TENANT.onmicrosoft.com/api/read"],
};

// Export the configurations
window.authConfig = {
    msalConfig,
    loginRequest,
    tokenRequest
}; 