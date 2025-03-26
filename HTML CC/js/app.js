// AWS SDK Configuration
const AWS = {
    region: 'YOUR_AWS_REGION',
    cognito: {
        userPoolId: 'YOUR_COGNITO_USER_POOL_ID',
        clientId: 'YOUR_COGNITO_CLIENT_ID'
    },
    s3: {
        bucketName: 'YOUR_S3_BUCKET_NAME'
    },
    apiGateway: {
        endpoint: 'YOUR_API_GATEWAY_ENDPOINT'
    }
};

// Azure Configuration
const Azure = {
    b2c: {
        tenant: 'YOUR_B2C_TENANT',
        clientId: 'YOUR_B2C_CLIENT_ID',
        policies: {
            signIn: 'YOUR_SIGNIN_POLICY',
            signUp: 'YOUR_SIGNUP_POLICY'
        }
    },
    storage: {
        accountName: 'YOUR_STORAGE_ACCOUNT',
        containerName: 'YOUR_CONTAINER_NAME'
    }
};

// State Management
const AppState = {
    user: null,
    cart: [],
    products: [],
    orders: []
};

// Authentication Service
class AuthService {
    static async login(email, password) {
        try {
            // Simple email/password authentication
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email, 
                    password: this.hashPassword(password) 
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }
            
            const data = await response.json();
            this.setUserSession(data);
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    static async register(userData) {
        try {
            // Validate password strength
            if (!this.isPasswordStrong(userData.password)) {
                throw new Error('Password must be at least 8 characters long and contain letters, numbers, and special characters');
            }

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...userData,
                    password: this.hashPassword(userData.password),
                    createdAt: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Registration failed');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    static logout() {
        AppState.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    }

    static isLoggedIn() {
        return !!localStorage.getItem('token');
    }

    static getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    // Helper methods
    static setUserSession(data) {
        AppState.user = data.user;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
    }

    static hashPassword(password) {
        // Simple hash function (in production, this should be done server-side)
        return btoa(password);
    }

    static isPasswordStrong(password) {
        const minLength = 8;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return password.length >= minLength && hasLetter && hasNumber && hasSpecialChar;
    }
}

// Cart Service
class CartService {
    static async addToCart(product) {
        try {
            AppState.cart.push(product);
            await this.updateCartInCloud();
            this.updateCartUI();
        } catch (error) {
            console.error('Add to cart error:', error);
            throw error;
        }
    }

    static async removeFromCart(productId) {
        try {
            AppState.cart = AppState.cart.filter(item => item.id !== productId);
            await this.updateCartInCloud();
            this.updateCartUI();
        } catch (error) {
            console.error('Remove from cart error:', error);
            throw error;
        }
    }

    static updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = AppState.cart.length;
        }
    }

    static async updateCartInCloud() {
        // Implement synchronization with cloud storage (AWS S3 or Azure Blob Storage)
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await fetch('/api/cart/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(AppState.cart)
            });
        } catch (error) {
            console.error('Cart sync error:', error);
        }
    }
}

// Product Service
class ProductService {
    static async getProducts() {
        try {
            const response = await fetch('/api/products');
            AppState.products = await response.json();
            return AppState.products;
        } catch (error) {
            console.error('Get products error:', error);
            throw error;
        }
    }

    static async getProductDetails(productId) {
        try {
            const response = await fetch(`/api/products/${productId}`);
            return await response.json();
        } catch (error) {
            console.error('Get product details error:', error);
            throw error;
        }
    }
}

// Order Service
class OrderService {
    static async placeOrder(orderData) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });
            
            if (!response.ok) throw new Error('Order placement failed');
            
            // Clear cart after successful order
            AppState.cart = [];
            CartService.updateCartUI();
            
            return await response.json();
        } catch (error) {
            console.error('Place order error:', error);
            throw error;
        }
    }

    static async getOrderHistory() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            AppState.orders = await response.json();
            return AppState.orders;
        } catch (error) {
            console.error('Get order history error:', error);
            throw error;
        }
    }
}

// Analytics Service
class AnalyticsService {
    static async trackEvent(eventName, eventData) {
        try {
            // Implement AWS CloudWatch or Azure Application Insights tracking
            await fetch('/api/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventName, eventData })
            });
        } catch (error) {
            console.error('Analytics tracking error:', error);
        }
    }
}

// Performance Monitoring
class PerformanceService {
    static initialize() {
        // Initialize performance monitoring
        this.trackPageLoad();
        this.trackUserInteractions();
    }

    static trackPageLoad() {
        window.addEventListener('load', () => {
            const pageLoadTime = performance.now();
            AnalyticsService.trackEvent('pageLoad', { time: pageLoadTime });
        });
    }

    static trackUserInteractions() {
        document.addEventListener('click', (event) => {
            if (event.target.matches('button, a')) {
                AnalyticsService.trackEvent('userInteraction', {
                    element: event.target.tagName,
                    text: event.target.textContent
                });
            }
        });
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Initialize services
    PerformanceService.initialize();
    
    // Check authentication status
    const token = localStorage.getItem('token');
    if (token) {
        // Validate token and load user data
    }
    
    // Load cart data
    CartService.updateCartUI();
    
    // Add event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                await AuthService.login(email, password);
                window.location.href = '/account.html';
            } catch (error) {
                alert('Login failed. Please try again.');
            }
        });
    }

    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const userData = {
                    name: document.getElementById('register-name').value,
                    email: document.getElementById('register-email').value,
                    password: document.getElementById('register-password').value
                };
                await AuthService.register(userData);
                alert('Registration successful! Please login.');
                window.location.href = '/login.html';
            } catch (error) {
                alert('Registration failed. Please try again.');
            }
        });
    }

    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const productId = button.dataset.productId;
                const product = await ProductService.getProductDetails(productId);
                await CartService.addToCart(product);
                alert('Product added to cart!');
            } catch (error) {
                alert('Failed to add product to cart.');
            }
        });
    });

    // Checkout button
    const checkoutButton = document.querySelector('.checkout-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', async () => {
            try {
                if (!AppState.user) {
                    window.location.href = '/login.html';
                    return;
                }
                
                const orderData = {
                    items: AppState.cart,
                    total: calculateTotal(AppState.cart)
                };
                
                await OrderService.placeOrder(orderData);
                alert('Order placed successfully!');
                window.location.href = '/account.html';
            } catch (error) {
                alert('Failed to place order. Please try again.');
            }
        });
    }
}

function calculateTotal(cartItems) {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Export services for use in other files
export {
    AuthService,
    CartService,
    ProductService,
    OrderService,
    AnalyticsService,
    PerformanceService
}; 