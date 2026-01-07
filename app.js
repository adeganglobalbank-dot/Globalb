// Global Bank Nigeria - Admin Application JavaScript
// Copyright © 2024 Global Bank Nigeria Limited

// ===========================================
// CONFIGURATION
// ===========================================
const CONFIG = {
    API_BASE_URL: 'https://api.globalbanknigeria.com/v1',
    MINING_RATE: 10, // £10 per second
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    AUTO_SAVE_INTERVAL: 60000, // 1 minute
    CURRENCIES: ['EUR', 'GBP', 'CNY', 'NGN', 'INR', 'BTC', 'ETH', 'USDT', 'XRP', 'LTC']
};

// ===========================================
// STATE MANAGEMENT
// ===========================================
const AppState = {
    currentUser: null,
    isAuthenticated: false,
    cryptoBalance: 0,
    totalMined: 0,
    miningActive: false,
    miningInterval: null,
    miningStartTime: null,
    wallets: {},
    transactions: [],
    accounts: []
};

// ===========================================
// UTILITY FUNCTIONS
// ===========================================
const Utils = {
    // Generate unique ID
    generateId: () => {
        return 'GBN' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 7).toUpperCase();
    },

    // Format currency
    formatCurrency: (amount, currency = 'NGN') => {
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
    },

    // Generate wallet address
    generateWalletAddress: (currency) => {
        const prefixes = {
            'EUR': '0x',
            'GBP': '0x',
            'CNY': '0x',
            'NGN': '0x',
            'INR': '0x',
            'BTC': 'bc1q',
            'ETH': '0x',
            'USDT': '0x',
            'XRP': 'r',
            'LTC': 'ltc1'
        };
        
        const characters = '0123456789abcdef';
        let address = prefixes[currency];
        const length = currency === 'BTC' ? 39 : 40;
        
        for (let i = 0; i < length; i++) {
            address += characters[Math.floor(Math.random() * characters.length)];
        }
        
        return address;
    },

    // Format date
    formatDate: (date) => {
        return new Date(date).toLocaleString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Generate random account number
    generateAccountNumber: () => {
        return Math.floor(100000000 + Math.random() * 900000000).toString();
    },

    // Calculate mining time
    calculateMiningTime: (startTime) => {
        if (!startTime) return '00:00:00';
        const now = new Date();
        const diff = Math.floor((now - startTime) / 1000);
        
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },

    // Show notification
    showNotification: (message, type = 'success') => {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '9999';
        notification.style.animation = 'fadeIn 0.3s ease';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    // Save to localStorage
    saveToStorage: (key, data) => {
        try {
            localStorage.setItem(`gbn_${key}`, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    // Load from localStorage
    loadFromStorage: (key) => {
        try {
            const data = localStorage.getItem(`gbn_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    },

    // Validate email
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validate phone number
    validatePhone: (phone) => {
        const re = /^\+?[\d\s-()]+$/;
        return re.test(phone);
    }
};

// ===========================================
// AUTHENTICATION
// ===========================================
const Auth = {
    // Login
    login: async (username, password) => {
        try {
            // In production, this would call your API
            if (username === 'admin' && password === 'admin123') {
                AppState.currentUser = {
                    id: 'admin-001',
                    username: 'admin',
                    name: 'Olawale Abdul-Ganiyu',
                    role: 'Administrator',
                    email: 'adeganglobal@gmail.com',
                    phone: '+2349030277275'
                };
                AppState.isAuthenticated = true;
                Utils.saveToStorage('user', AppState.currentUser);
                Utils.saveToStorage('auth', { authenticated: true });
                return { success: true, message: 'Login successful' };
            } else {
                return { success: false, message: 'Invalid credentials' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Login failed. Please try again.' };
        }
    },

    // Logout
    logout: () => {
        AppState.currentUser = null;
        AppState.isAuthenticated = false;
        localStorage.removeItem('gbn_user');
        localStorage.removeItem('gbn_auth');
        window.location.href = 'login.html';
    },

    // Check authentication
    checkAuth: () => {
        const auth = Utils.loadFromStorage('auth');
        const user = Utils.loadFromStorage('user');
        
        if (auth && auth.authenticated && user) {
            AppState.isAuthenticated = true;
            AppState.currentUser = user;
            return true;
        }
        return false;
    },

    // Require authentication
    requireAuth: () => {
        if (!Auth.checkAuth()) {
            window.location.href = 'login.html';
        }
    }
};

// ===========================================
// CRYPTO MINING
// ===========================================
const CryptoMining = {
    // Start mining
    startMining: () => {
        if (AppState.miningActive) {
            Utils.showNotification('Mining is already active', 'warning');
            return;
        }

        AppState.miningActive = true;
        AppState.miningStartTime = new Date();
        
        AppState.miningInterval = setInterval(() => {
            AppState.cryptoBalance += CONFIG.MINING_RATE;
            AppState.totalMined += CONFIG.MINING_RATE;
            
            // Update UI
            CryptoMining.updateUI();
            
            // Save state
            Utils.saveToStorage('cryptoBalance', AppState.cryptoBalance);
            Utils.saveToStorage('totalMined', AppState.totalMined);
        }, 1000);

        Utils.showNotification('Crypto mining started!', 'success');
    },

    // Stop mining
    stopMining: () => {
        if (!AppState.miningActive) {
            Utils.showNotification('Mining is not active', 'warning');
            return;
        }

        clearInterval(AppState.miningInterval);
        AppState.miningInterval = null;
        AppState.miningActive = false;
        AppState.miningStartTime = null;

        Utils.showNotification('Crypto mining stopped!', 'info');
        CryptoMining.updateUI();
    },

    // Update UI
    updateUI: () => {
        // Update balance display
        const balanceDisplay = document.getElementById('crypto-balance-display');
        if (balanceDisplay) {
            balanceDisplay.textContent = AppState.cryptoBalance.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        // Update total mined
        const totalMinedDisplay = document.getElementById('total-mined');
        if (totalMinedDisplay) {
            totalMinedDisplay.textContent = AppState.totalMined.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        // Update mining time
        const miningTimeDisplay = document.getElementById('mining-time');
        if (miningTimeDisplay) {
            miningTimeDisplay.textContent = Utils.calculateMiningTime(AppState.miningStartTime);
        }

        // Update status
        const minerStatus = document.getElementById('miner-status');
        if (minerStatus) {
            minerStatus.textContent = AppState.miningActive ? 'ACTIVE' : 'STOPPED';
            minerStatus.style.color = AppState.miningActive ? '#28a745' : '#dc3545';
        }
    },

    // Initialize
    init: () => {
        // Load saved state
        const savedBalance = Utils.loadFromStorage('cryptoBalance');
        const savedTotal = Utils.loadFromStorage('totalMined');
        
        if (savedBalance !== null) {
            AppState.cryptoBalance = savedBalance;
        }
        if (savedTotal !== null) {
            AppState.totalMined = savedTotal;
        }

        CryptoMining.updateUI();
    }
};

// ===========================================
// WALLET MANAGEMENT
// ===========================================
const WalletManager = {
    // Generate wallet
    generateWallet: (currency) => {
        const walletId = Utils.generateId();
        const wallet = {
            id: walletId,
            currency: currency,
            address: Utils.generateWalletAddress(currency),
            balance: 0,
            createdAt: new Date().toISOString(),
            status: 'active'
        };

        AppState.wallets[currency] = wallet;
        Utils.saveToStorage('wallets', AppState.wallets);

        return wallet;
    },

    // Generate all wallets
    generateAllWallets: () => {
        CONFIG.CURRENCIES.forEach(currency => {
            if (!AppState.wallets[currency]) {
                WalletManager.generateWallet(currency);
            }
        });
    },

    // Get wallet
    getWallet: (currency) => {
        return AppState.wallets[currency] || null;
    },

    // Update wallet balance
    updateBalance: (currency, amount) => {
        if (AppState.wallets[currency]) {
            AppState.wallets[currency].balance = amount;
            Utils.saveToStorage('wallets', AppState.wallets);
        }
    },

    // Initialize
    init: () => {
        const savedWallets = Utils.loadFromStorage('wallets');
        if (savedWallets) {
            AppState.wallets = savedWallets;
        } else {
            WalletManager.generateAllWallets();
        }
    }
};

// ===========================================
// ACCOUNT MANAGEMENT
// ===========================================
const AccountManager = {
    // Create account
    createAccount: (accountData) => {
        const account = {
            id: Utils.generateId(),
            accountNumber: Utils.generateAccountNumber(),
            ...accountData,
            balance: 0,
            status: 'active',
            createdAt: new Date().toISOString()
        };

        AppState.accounts.push(account);
        Utils.saveToStorage('accounts', AppState.accounts);

        return account;
    },

    // Get account by ID
    getAccount: (accountId) => {
        return AppState.accounts.find(acc => acc.id === accountId);
    },

    // Get account by number
    getAccountByNumber: (accountNumber) => {
        return AppState.accounts.find(acc => acc.accountNumber === accountNumber);
    },

    // Update account balance
    updateBalance: (accountId, amount) => {
        const account = AccountManager.getAccount(accountId);
        if (account) {
            account.balance = amount;
            Utils.saveToStorage('accounts', AppState.accounts);
        }
    },

    // Initialize
    init: () => {
        const savedAccounts = Utils.loadFromStorage('accounts');
        if (savedAccounts) {
            AppState.accounts = savedAccounts;
        }
    }
};

// ===========================================
// TRANSACTION MANAGEMENT
// ===========================================
const TransactionManager = {
    // Create transaction
    createTransaction: (transactionData) => {
        const transaction = {
            id: Utils.generateId(),
            ...transactionData,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        AppState.transactions.unshift(transaction);
        Utils.saveToStorage('transactions', AppState.transactions);

        return transaction;
    },

    // Get transaction by ID
    getTransaction: (transactionId) => {
        return AppState.transactions.find(txn => txn.id === transactionId);
    },

    // Update transaction status
    updateStatus: (transactionId, status) => {
        const transaction = TransactionManager.getTransaction(transactionId);
        if (transaction) {
            transaction.status = status;
            Utils.saveToStorage('transactions', AppState.transactions);
        }
    },

    // Get recent transactions
    getRecentTransactions: (limit = 10) => {
        return AppState.transactions.slice(0, limit);
    },

    // Initialize
    init: () => {
        const savedTransactions = Utils.loadFromStorage('transactions');
        if (savedTransactions) {
            AppState.transactions = savedTransactions;
        } else {
            // Generate sample transactions
            const sampleTransactions = [
                { id: 'TXN001', account: '100200300', type: 'Transfer', amount: 50000, currency: 'NGN', status: 'success', createdAt: new Date().toISOString() },
                { id: 'TXN002', account: '200300400', type: 'Deposit', amount: 100000, currency: 'NGN', status: 'success', createdAt: new Date().toISOString() },
                { id: 'TXN003', account: '300400500', type: 'Withdrawal', amount: 25000, currency: 'NGN', status: 'pending', createdAt: new Date().toISOString() },
                { id: 'TXN004', account: '400500600', type: 'Transfer', amount: 75000, currency: 'NGN', status: 'failed', createdAt: new Date().toISOString() },
                { id: 'TXN005', account: '500600700', type: 'Deposit', amount: 200000, currency: 'NGN', status: 'success', createdAt: new Date().toISOString() }
            ];
            AppState.transactions = sampleTransactions;
            Utils.saveToStorage('transactions', sampleTransactions);
        }
    }
};

// ===========================================
// DASHBOARD
// ===========================================
const Dashboard = {
    // Initialize dashboard
    init: () => {
        Auth.requireAuth();
        Dashboard.loadStats();
        Dashboard.loadTransactions();
        Dashboard.loadWallets();
        Dashboard.startAutoRefresh();
    },

    // Load statistics
    loadStats: () => {
        const stats = {
            totalAccounts: AppState.accounts.length || 24531,
            totalBalance: 48500000000,
            dailyTransactions: AppState.transactions.length || 8432,
            activeCustomers: 18234
        };

        // Update stat cards
        Object.keys(stats).forEach(key => {
            const element = document.querySelector(`[data-stat="${key}"]`);
            if (element) {
                if (key === 'totalBalance') {
                    element.textContent = '₦' + (stats[key] / 1000000000).toFixed(1) + 'B';
                } else {
                    element.textContent = stats[key].toLocaleString();
                }
            }
        });
    },

    // Load transactions
    loadTransactions: () => {
        const tableBody = document.getElementById('transactions-table');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        const transactions = TransactionManager.getRecentTransactions(10);

        transactions.forEach(txn => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${txn.id}</td>
                <td>${txn.account}</td>
                <td>${txn.type}</td>
                <td>${Utils.formatCurrency(txn.amount, txn.currency)}</td>
                <td><span class="status ${txn.status}">${txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}</span></td>
                <td>
                    <button class="action-btn view" onclick="Dashboard.viewTransaction('${txn.id}')">View</button>
                    <button class="action-btn edit" onclick="Dashboard.editTransaction('${txn.id}')">Edit</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    },

    // Load wallets
    loadWallets: () => {
        const walletList = document.querySelector('.wallet-list');
        if (!walletList) return;

        walletList.innerHTML = '<h4 style="margin-bottom: 15px; font-size: 14px;">Multi-Currency Wallets</h4>';

        CONFIG.CURRENCIES.slice(0, 7).forEach(currency => {
            const wallet = WalletManager.getWallet(currency) || WalletManager.generateWallet(currency);
            
            const walletItem = document.createElement('div');
            walletItem.className = 'wallet-item';
            walletItem.innerHTML = `
                <div class="wallet-info">
                    <div class="wallet-currency">${currency} (${CurrencyNames[currency]})</div>
                    <div class="wallet-address">${wallet.address}</div>
                </div>
                <div class="wallet-balance">${Utils.formatCurrency(wallet.balance, currency)}</div>
            `;
            walletList.appendChild(walletItem);
        });
    },

    // View transaction
    viewTransaction: (transactionId) => {
        const transaction = TransactionManager.getTransaction(transactionId);
        if (transaction) {
            alert(`Transaction Details:\n\nID: ${transaction.id}\nAccount: ${transaction.account}\nType: ${transaction.type}\nAmount: ${Utils.formatCurrency(transaction.amount, transaction.currency)}\nStatus: ${transaction.status}\nDate: ${Utils.formatDate(transaction.createdAt)}`);
        }
    },

    // Edit transaction
    editTransaction: (transactionId) => {
        alert(`Editing transaction: ${transactionId}\n\nNote: This feature allows modifying transaction details including amounts, beneficiaries, and status.`);
    },

    // Start auto refresh
    startAutoRefresh: () => {
        setInterval(() => {
            CryptoMining.updateUI();
        }, 1000);
    }
};

// ===========================================
// ADMIN CONTROLS
// ===========================================
const AdminControls = {
    // Edit balances
    editBalances: () => {
        alert('Opening Balance Editor...\n\nThis allows editing customer account balances.\n\n⚠️ WARNING: This action requires administrator privileges and will be logged.');
    },

    // Manage crypto miner
    manageCryptoMiner: () => {
        alert('Opening Crypto Miner Control Panel...\n\nManage mining operations and settings.\n\nCurrent Settings:\n- Mining Rate: £10/second\n- Active Status: ' + (AppState.miningActive ? 'ON' : 'OFF'));
    },

    // Generate wallets
    generateWallets: () => {
        WalletManager.generateAllWallets();
        Dashboard.loadWallets();
        Utils.showNotification('All wallets generated successfully!', 'success');
    },

    // Virtual card manager
    virtualCardManager: () => {
        alert('Opening Virtual Card Manager...\n\nManage virtual Visa and Mastercard issuance.\n\nFeatures:\n- Generate new virtual cards\n- Set card limits\n- Monitor card usage\n- Block/Unblock cards');
    },

    // Bulk transactions
    bulkTransactions: () => {
        alert('Opening Bulk Transfer System...\n\nExecute bulk transactions to multiple accounts.\n\nSupported Operations:\n- Bulk transfers\n- Bulk payments\n- Bulk withdrawals\n- Scheduled transfers');
    },

    // System logs
    systemLogs: () => {
        alert('Opening System Logs...\n\nView detailed system operation logs.\n\nLog Categories:\n- Authentication logs\n- Transaction logs\n- System errors\n- Security events\n- Audit trails');
    }
};

// ===========================================
// NODE.JS SERVER
// ===========================================
// This section contains Node.js server code for the backend
const ServerCode = `
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
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
        maxAge: 30 * 60 * 1000 // 30 minutes
    }
}));

// Database simulation
const db = {
    users: [],
    accounts: [],
    transactions: [],
    wallets: {},
    settings: {}
};

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Global Bank Nigeria API', version: '1.0.0' });
});

// Authentication routes
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    // Validate credentials
    if (username === 'admin' && password === 'admin123') {
        req.session.user = {
            id: 'admin-001',
            username: 'admin',
            name: 'Olawale Abdul-Ganiyu',
            role: 'administrator'
        };
        res.json({ success: true, user: req.session.user });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.post('/api/auth/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

app.get('/api/auth/me', (req, res) => {
    if (req.session.user) {
        res.json({ success: true, user: req.session.user });
    } else {
        res.status(401).json({ success: false });
    }
});

// Account routes
app.get('/api/accounts', (req, res) => {
    res.json({ success: true, accounts: db.accounts });
});

app.post('/api/accounts', (req, res) => {
    const account = {
        id: crypto.randomUUID(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    db.accounts.push(account);
    res.json({ success: true, account });
});

// Transaction routes
app.get('/api/transactions', (req, res) => {
    res.json({ success: true, transactions: db.transactions });
});

app.post('/api/transactions', (req, res) => {
    const transaction = {
        id: crypto.randomUUID(),
        ...req.body,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    db.transactions.unshift(transaction);
    res.json({ success: true, transaction });
});

// Wallet routes
app.get('/api/wallets', (req, res) => {
    res.json({ success: true, wallets: db.wallets });
});

app.post('/api/wallets', (req, res) => {
    const wallet = {
        id: crypto.randomUUID(),
        address: crypto.randomBytes(20).toString('hex'),
        ...req.body,
        balance: 0,
        createdAt: new Date().toISOString()
    };
    db.wallets[wallet.currency] = wallet;
    res.json({ success: true, wallet });
});

// Crypto mining routes
app.post('/api/mining/start', (req, res) => {
    res.json({ success: true, message: 'Mining started' });
});

app.post('/api/mining/stop', (req, res) => {
    res.json({ success: true, message: 'Mining stopped' });
});

app.get('/api/mining/status', (req, res) => {
    res.json({ success: true, status: { active: false, balance: 0 } });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(\`Global Bank Nigeria API Server running on port \${PORT}\`);
    console.log(\`Owner: Olawale Abdul-Ganiyu\`);
    console.log(\`Contact: adeganglobal@gmail.com\`);
    console.log(\`Phone: +2349030277275\`);
});

module.exports = app;
`;

// Currency names mapping
const CurrencyNames = {
    'EUR': 'Euro',
    'GBP': 'British Pound',
    'CNY': 'Chinese Yuan',
    'NGN': 'Nigerian Naira',
    'INR': 'Indian Rupee',
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'USDT': 'Tether',
    'XRP': 'Ripple',
    'LTC': 'Litecoin'
};

// ===========================================
// INITIALIZATION
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    WalletManager.init();
    AccountManager.init();
    TransactionManager.init();
    CryptoMining.init();

    // Check if on dashboard page
    if (window.location.pathname.includes('dashboard.html')) {
        Dashboard.init();
    }
});

// Export functions for global access
window.Auth = Auth;
window.CryptoMining = CryptoMining;
window.WalletManager = WalletManager;
window.AccountManager = AccountManager;
window.TransactionManager = TransactionManager;
window.Dashboard = Dashboard;
window.AdminControls = AdminControls;
window.Utils = Utils;