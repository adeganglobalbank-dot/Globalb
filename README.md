# Global Bank Nigeria - Admin Interface

**Owner:** Olawale Abdul-Ganiyu  
**Email:** adeganglobal@gmail.com  
**Phone:** +2349030277275  
**Version:** 1.0.0  

## Overview

This is the administrative control panel for Global Bank Nigeria, providing comprehensive management of banking operations, customer accounts, transactions, and cryptocurrency mining operations.

## Features

### 🏦 Core Banking Functions
- Customer Information File (CIF) Management
- Account Management (Savings, Current, Fixed Deposit)
- Double-Entry Ledger System
- Real-time Balance Monitoring
- Transaction Processing and Monitoring

### 💰 Crypto Mining Operations
- Automated cryptocurrency mining
- Real-time balance updates (£10/second)
- Multi-currency wallet support
- Mining control (Start/Stop functionality)
- Mining statistics and reporting

### 🔐 Security Features
- Secure login with authentication
- Session management
- Role-based access control
- Rate limiting
- CORS protection
- Helmet security headers

### 💳 Virtual Card Management
- Virtual Visa card generation
- Virtual Mastercard generation
- Card limit management
- Card usage monitoring
- Block/Unblock functionality

### 🌍 Multi-Currency Support
- Euro (EUR)
- British Pound (GBP)
- Chinese Yuan (CNY)
- Nigerian Naira (NGN)
- Indian Rupee (INR)
- Bitcoin (BTC)
- Ethereum (ETH)
- Tether (USDT)
- Ripple (XRP)
- Litecoin (LTC)

### 📊 Dashboard Analytics
- Real-time statistics
- Account overview
- Transaction monitoring
- Customer analytics
- Revenue tracking

## Installation

### Prerequisites
- Node.js 18.0 or higher
- npm 9.0 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Setup Instructions

1. **Navigate to the admin_interface directory:**
   ```bash
   cd admin_interface
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a `.env` file in the root directory with the following variables:
   ```env
   NODE_ENV=production
   PORT=3000
   SESSION_SECRET=your-secret-key-here
   ALLOWED_ORIGINS=*
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

5. **Access the admin panel:**
   Open your web browser and navigate to:
   ```
   http://localhost:3000/login.html
   ```

## Default Login Credentials

**Username:** admin  
**Password:** admin123

⚠️ **IMPORTANT:** Change these credentials immediately after first login in a production environment.

## File Structure

```
admin_interface/
├── login.html              # Admin login page
├── dashboard.html          # Main admin dashboard
├── styles.css             # Global styles
├── app.js                 # Client-side JavaScript
├── server.js              # Node.js server
├── package.json           # Project dependencies
├── README.md              # This file
└── LICENSE.md             # License information
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Accounts
- `GET /api/accounts` - Get all accounts
- `GET /api/accounts/:id` - Get specific account
- `POST /api/accounts` - Create new account
- `PUT /api/accounts/:id/balance` - Update account balance

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get specific transaction
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id/status` - Update transaction status

### Wallets
- `GET /api/wallets` - Get all wallets
- `GET /api/wallets/:currency` - Get specific wallet
- `POST /api/wallets` - Create new wallet
- `PUT /api/wallets/:currency/balance` - Update wallet balance

### Crypto Mining
- `POST /api/mining/start` - Start mining
- `POST /api/mining/stop` - Stop mining
- `GET /api/mining/status` - Get mining status

### Admin Controls
- `POST /api/admin/generate-wallets` - Generate all wallets
- `POST /api/admin/bulk-transfer` - Create bulk transfers

### Statistics
- `GET /api/stats` - Get system statistics

## Development

### Running in Development Mode

```bash
npm run dev
```

This uses nodemon for automatic server restart on file changes.

### Building for Production

```bash
npm run build
```

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

## Admin Features

### 1. Balance Editing
Administrators can edit account balances directly from the dashboard. This feature requires administrator privileges and is logged for audit purposes.

### 2. Crypto Miner Control
- Start/Stop mining operations
- Real-time balance monitoring
- Mining statistics tracking
- Mining time calculation

### 3. Wallet Generator
Generate cryptocurrency wallets for all supported currencies with unique addresses.

### 4. Virtual Card Management
- Create virtual Visa and Mastercard
- Set card limits
- Monitor card usage
- Block/unblock cards

### 5. Bulk Transfer System
Execute bulk transactions to multiple accounts with a single operation.

### 6. System Logs
View detailed system operation logs including:
- Authentication logs
- Transaction logs
- System errors
- Security events
- Audit trails

## Security Considerations

### Authentication
- Session-based authentication
- 30-minute session timeout
- Secure cookie configuration
- Password hashing (bcrypt)

### Rate Limiting
- 100 requests per 15 minutes per IP
- Configurable rate limits
- Automatic blocking of abusive requests

### Security Headers
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

### Data Protection
- HTTPS in production
- Encrypted sessions
- Secure password storage
- Input validation and sanitization

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Optimization

- Compression middleware
- Static file caching
- Database indexing (in production)
- Optimized queries
- Lazy loading for large datasets

## Troubleshooting

### Server won't start
- Check if port 3000 is available
- Verify Node.js version (18.0+)
- Ensure all dependencies are installed

### Login issues
- Verify credentials (admin/admin123)
- Check browser console for errors
- Clear browser cache and cookies

### Mining not working
- Ensure user is logged in as administrator
- Check browser console for JavaScript errors
- Verify mining status in API response

### Balance updates not reflecting
- Check API response
- Verify administrator privileges
- Check browser console for errors

## Support

For technical support or questions, contact:

**Name:** Olawale Abdul-Ganiyu  
**Email:** adeganglobal@gmail.com  
**Phone:** +2349030277275  

## License

UNLICENSED - All rights reserved. This software is the property of Global Bank Nigeria Limited.

## Copyright

© 2024 Global Bank Nigeria Limited. All rights reserved.

## Version History

### Version 1.0.0 (2024)
- Initial release
- Core banking functionality
- Crypto mining operations
- Multi-currency support
- Virtual card management
- Admin control panel
- Security features

## Disclaimer

This administrative interface is for use only by authorized personnel of Global Bank Nigeria Limited. Unauthorized access is strictly prohibited and will be prosecuted to the fullest extent of the law.

---

**Global Bank Nigeria Limited**  
*A Tradition of Excellence in Banking*

📍 Plot 123, Adeola Odeku Street, Victoria Island, Lagos, Nigeria  
📞 +2349030277275  
📧 adeganglobal@gmail.com  
🌐 www.globalbanknigeria.com