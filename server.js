/**
 * Global Bank Nigeria - Node.js Server
 * Administrative Control Panel Backend
 * 
 * Owner: Olawale Abdul-Ganiyu
 * Email: adeganglobal@gmail.com
 * Phone: +2349030277275
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// MIDDLEWARE CONFIGURATION
// ==========================================

// Security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS || '*',
    credentials: true
}));

// Compression
app.use(compression());

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use(express.static(path.join(__dirname)));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'global-bank-nigeria-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 30 * 60 * 1000, // 30 minutes
        sameSite: 'strict'
    }
}));

// ==========================================
// DATABASE SIMULATION
// ==========================================

const db = {
    users: [
        {
            id: 'admin-001',
            username: 'admin',
            password: '$2a$10$rOqjQZ9dY9qXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXq', // admin123 (hashed)
            name: 'Olawale Abdul-Ganiyu',
            email: 'adeganglobal@gmail.com',
            phone: '+2349030277275',
            role: 'administrator',
            createdAt: new Date().toISOString()
        }
    ],
    accounts: [
        {
            id: 'acc-001',
            accountNumber: '100200300',
            customerId: 'cust-001',
            accountType: 'savings',
            balance: 500000,
            currency: 'NGN',
            status: 'active',
            createdAt: new Date().toISOString()
        },
        {
            id: 'acc-002',
            accountNumber: '200300400',
            customerId: 'cust-002',
            accountType: 'current',
            balance: 1200000,
            currency: 'NGN',
            status: 'active',
            createdAt: new Date().toISOString()
        }
    ],
    transactions: [
        {
            id: 'txn-001',
            accountNumber: '100200300',
            type: 'transfer',
            amount: 50000,
            currency: 'NGN',
            status: 'success',
            createdAt: new Date().toISOString()
        },
        {
            id: 'txn-002',
            accountNumber: '200300400',
            type: 'deposit',
            amount: 100000,
            currency: 'NGN',
            status: 'success',
            createdAt: new Date().toISOString()
        }
    ],
    wallets: {
        'EUR': {
            id: 'wallet-eur',
            currency: 'EUR',
            address: '0x1234567890123456789012345678901234567890',
            balance: 45230,
            createdAt: new Date().toISOString()
        },
        'GBP': {
            id: 'wallet-gbp',
            currency: 'GBP',
            address: '0x0987654321098765432109876543210987654321',
            balance: 12450,
            createdAt: new Date().toISOString()
        },
        'CNY': {
            id: 'wallet-cny',
            currency: 'CNY',
            address: '0x1357924680135792468013579246801357924680',
            balance: 234500,
            createdAt: new Date().toISOString()
        },
        'NGN': {
            id: 'wallet-ngn',
            currency: 'NGN',
            address: '0x24680135792468013579246801357924680135792',
            balance: 12345000,
            createdAt: new Date().toISOString()
        },
        'INR': {
            id: 'wallet-inr',
            currency: 'INR',
            address: '0x35792468013579246801357924680135792468013',
            balance: 234500,
            createdAt: new Date().toISOString()
        },
        'BTC': {
            id: 'wallet-btc',
            currency: 'BTC',
            address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
            balance: 0.0452,
            createdAt: new Date().toISOString()
        },
        'ETH': {
            id: 'wallet-eth',
            currency: 'ETH',
            address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
            balance: 2.345,
            createdAt: new Date().toISOString()
        }
    },
    mining: {
        active: false,
        balance: 12450,
        totalMined: 1234500,
        rate: 10, // £10 per second
        startTime: null
    },
    stats: {
        totalAccounts: 24531,
        totalBalance: 48500000000,
        dailyTransactions: 8432,
        activeCustomers: 18234
    }
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function generateId() {
    return crypto.randomUUID();
}

function formatCurrency(amount, currency = 'NGN') {
    const symbols = {
        'NGN': '₦',
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'CNY': '¥',
        'INR': '₹',
        'BTC': '₿',
        'ETH': 'Ξ'
    };
    const symbol = symbols[currency] || currency + ' ';
    return symbol + parseFloat(amount).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function authenticateUser(username, password) {
    const user = db.users.find(u => u.username === username);
    // In production, use bcrypt.compare() for password verification
    if (user && username === 'admin' && password === 'admin123') {
        return user;
    }
    return null;
}

// ==========================================
// ROUTES
// ==========================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'Global Bank Nigeria API',
        version: '1.0.0',
        description: 'Administrative Control Panel Backend',
        owner: 'Olawale Abdul-Ganiyu',
        contact: 'adeganglobal@gmail.com',
        phone: '+2349030277275'
    });
});

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    console.log(`Login attempt: ${username} at ${new Date().toISOString()}`);
    
    const user = authenticateUser(username, password);
    
    if (user) {
        req.session.user = {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role
        };
        
        console.log(`Login successful: ${username}`);
        
        res.json({
            success: true,
            message: 'Login successful',
            user: req.session.user
        });
    } else {
        console.log(`Login failed: ${username}`);
        res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
});

app.post('/api/auth/logout', (req, res) => {
    if (req.session.user) {
        console.log(`Logout: ${req.session.user.username} at ${new Date().toISOString()}`);
    }
    
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            res.status(500).json({ success: false, message: 'Logout failed' });
        } else {
            res.json({ success: true, message: 'Logout successful' });
        }
    });
});

app.get('/api/auth/me', (req, res) => {
    if (req.session.user) {
        res.json({ success: true, user: req.session.user });
    } else {
        res.status(401).json({ success: false, message: 'Not authenticated' });
    }
});

// ==========================================
// ACCOUNT ROUTES
// ==========================================

app.get('/api/accounts', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    res.json({ success: true, accounts: db.accounts });
});

app.get('/api/accounts/:id', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const account = db.accounts.find(acc => acc.id === req.params.id);
    
    if (account) {
        res.json({ success: true, account });
    } else {
        res.status(404).json({ success: false, message: 'Account not found' });
    }
});

app.post('/api/accounts', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'administrator') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    
    const account = {
        id: generateId(),
        accountNumber: Math.floor(100000000 + Math.random() * 900000000).toString(),
        ...req.body,
        balance: 0,
        status: 'active',
        createdAt: new Date().toISOString()
    };
    
    db.accounts.push(account);
    
    console.log(`Account created: ${account.accountNumber} by ${req.session.user.username}`);
    
    res.json({ success: true, account });
});

app.put('/api/accounts/:id/balance', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'administrator') {
        return res.status(403).json({ success: false, message: 'Forbidden - Administrator access required' });
    }
    
    const { amount } = req.body;
    const account = db.accounts.find(acc => acc.id === req.params.id);
    
    if (account) {
        const oldBalance = account.balance;
        account.balance = parseFloat(amount);
        
        console.log(`Balance updated: ${account.accountNumber} from ${oldBalance} to ${account.balance} by ${req.session.user.username}`);
        
        res.json({ success: true, account });
    } else {
        res.status(404).json({ success: false, message: 'Account not found' });
    }
});

// ==========================================
// TRANSACTION ROUTES
// ==========================================

app.get('/api/transactions', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const limit = parseInt(req.query.limit) || 10;
    res.json({ success: true, transactions: db.transactions.slice(0, limit) });
});

app.get('/api/transactions/:id', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const transaction = db.transactions.find(txn => txn.id === req.params.id);
    
    if (transaction) {
        res.json({ success: true, transaction });
    } else {
        res.status(404).json({ success: false, message: 'Transaction not found' });
    }
});

app.post('/api/transactions', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const transaction = {
        id: generateId(),
        ...req.body,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    db.transactions.unshift(transaction);
    
    console.log(`Transaction created: ${transaction.id} by ${req.session.user.username}`);
    
    res.json({ success: true, transaction });
});

app.put('/api/transactions/:id/status', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'administrator') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    
    const { status } = req.body;
    const transaction = db.transactions.find(txn => txn.id === req.params.id);
    
    if (transaction) {
        const oldStatus = transaction.status;
        transaction.status = status;
        
        console.log(`Transaction status updated: ${transaction.id} from ${oldStatus} to ${status} by ${req.session.user.username}`);
        
        res.json({ success: true, transaction });
    } else {
        res.status(404).json({ success: false, message: 'Transaction not found' });
    }
});

// ==========================================
// WALLET ROUTES
// ==========================================

app.get('/api/wallets', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    res.json({ success: true, wallets: db.wallets });
});

app.get('/api/wallets/:currency', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const wallet = db.wallets[req.params.currency.toUpperCase()];
    
    if (wallet) {
        res.json({ success: true, wallet });
    } else {
        res.status(404).json({ success: false, message: 'Wallet not found' });
    }
});

app.post('/api/wallets', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'administrator') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    
    const { currency } = req.body;
    
    const wallet = {
        id: generateId(),
        currency: currency.toUpperCase(),
        address: crypto.randomBytes(20).toString('hex'),
        balance: 0,
        createdAt: new Date().toISOString()
    };
    
    db.wallets[currency.toUpperCase()] = wallet;
    
    console.log(`Wallet created: ${wallet.currency} by ${req.session.user.username}`);
    
    res.json({ success: true, wallet });
});

app.put('/api/wallets/:currency/balance', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'administrator') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    
    const { amount } = req.body;
    const currency = req.params.currency.toUpperCase();
    const wallet = db.wallets[currency];
    
    if (wallet) {
        const oldBalance = wallet.balance;
        wallet.balance = parseFloat(amount);
        
        console.log(`Wallet balance updated: ${currency} from ${oldBalance} to ${wallet.balance} by ${req.session.user.username}`);
        
        res.json({ success: true, wallet });
    } else {
        res.status(404).json({ success: false, message: 'Wallet not found' });
    }
});

// ==========================================
// CRYPTO MINING ROUTES
// ==========================================

app.post('/api/mining/start', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'administrator') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    
    if (!db.mining.active) {
        db.mining.active = true;
        db.mining.startTime = new Date().toISOString();
        
        // Start mining interval
        const miningInterval = setInterval(() => {
            if (db.mining.active) {
                db.mining.balance += db.mining.rate;
                db.mining.totalMined += db.mining.rate;
            } else {
                clearInterval(miningInterval);
            }
        }, 1000);
        
        console.log(`Mining started by ${req.session.user.username}`);
        
        res.json({
            success: true,
            message: 'Mining started',
            rate: db.mining.rate
        });
    } else {
        res.json({ success: false, message: 'Mining is already active' });
    }
});

app.post('/api/mining/stop', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'administrator') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    
    if (db.mining.active) {
        db.mining.active = false;
        db.mining.startTime = null;
        
        console.log(`Mining stopped by ${req.session.user.username}`);
        
        res.json({
            success: true,
            message: 'Mining stopped',
            totalMined: db.mining.totalMined
        });
    } else {
        res.json({ success: false, message: 'Mining is not active' });
    }
});

app.get('/api/mining/status', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    res.json({
        success: true,
        status: {
            active: db.mining.active,
            balance: db.mining.balance,
            totalMined: db.mining.totalMined,
            rate: db.mining.rate,
            startTime: db.mining.startTime
        }
    });
});

// ==========================================
// STATISTICS ROUTES
// ==========================================

app.get('/api/stats', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    res.json({ success: true, stats: db.stats });
});

// ==========================================
// ADMIN CONTROL ROUTES
// ==========================================

app.post('/api/admin/generate-wallets', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'administrator') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    
    const currencies = ['EUR', 'GBP', 'CNY', 'NGN', 'INR', 'BTC', 'ETH', 'USDT', 'XRP', 'LTC'];
    
    currencies.forEach(currency => {
        if (!db.wallets[currency]) {
            db.wallets[currency] = {
                id: generateId(),
                currency: currency,
                address: crypto.randomBytes(20).toString('hex'),
                balance: 0,
                createdAt: new Date().toISOString()
            };
        }
    });
    
    console.log(`All wallets generated by ${req.session.user.username}`);
    
    res.json({
        success: true,
        message: 'All wallets generated',
        wallets: db.wallets
    });
});

app.post('/api/admin/bulk-transfer', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'administrator') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    
    const { transfers } = req.body;
    
    if (!Array.isArray(transfers) || transfers.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid transfers data' });
    }
    
    const results = transfers.map(transfer => ({
        id: generateId(),
        ...transfer,
        status: 'pending',
        createdAt: new Date().toISOString()
    }));
    
    db.transactions.unshift(...results);
    
    console.log(`Bulk transfer created: ${results.length} transactions by ${req.session.user.username}`);
    
    res.json({
        success: true,
        message: `${results.length} transactions created`,
        transactions: results
    });
});

// ==========================================
// ERROR HANDLING
// ==========================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// ==========================================
// SERVER STARTUP
// ==========================================

app.listen(PORT, () => {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║         GLOBAL BANK NIGERIA - API SERVER                  ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log(`║  Server running on: http://localhost:${PORT}                   ║`);
    console.log(`║  Environment: ${process.env.NODE_ENV || 'development'}                         ║`);
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log('║  Owner Information:                                        ║');
    console.log('║  Name: Olawale Abdul-Ganiyu                                ║');
    console.log('║  Email: adeganglobal@gmail.com                             ║');
    console.log('║  Phone: +2349030277275                                     ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
});

module.exports = app;