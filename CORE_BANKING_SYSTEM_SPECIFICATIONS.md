# CORE BANKING SYSTEM TECHNICAL SPECIFICATIONS

## GLOBAL BANK NIGERIA LIMITED

**TECHNOLOGY DEPARTMENT**

---

## DOCUMENT CONTROL

**Document Number:** GBN-CBS-001  
**Version:** 1.0  
**Effective Date:** [Current Date]  
**Review Date:** [Current Date + 6 Months]  
**Prepared By:** Technology Department  
**Approved By:** Chief Technology Officer

---

## TABLE OF CONTENTS

1. System Overview and Architecture
2. Customer Management (CIF)
3. Account Management System
4. Ledger System (Double-Entry)
5. Payments Engine
6. Transaction Switch
7. Compliance and Risk Management
8. API Integration Platform
9. Security Infrastructure
10. Database Architecture
11. Scalability and Performance
12. Disaster Recovery and Business Continuity

---

## 1. SYSTEM OVERVIEW AND ARCHITECTURE

### 1.1 Core Banking Platform Architecture

**Architecture Type:** Microservices-based, Cloud-Native Architecture  
**Primary Technology Stack:**
- **Backend:** Java 17, Spring Boot 3.x
- **Database:** PostgreSQL 15, Redis 7.x (Caching)
- **Message Broker:** Apache Kafka 3.x
- **API Gateway:** Spring Cloud Gateway
- **Service Discovery:** Eureka Server
- **Containerization:** Docker, Kubernetes
- **CI/CD:** Jenkins, GitLab CI
- **Monitoring:** Prometheus, Grafana, ELK Stack
- **Security:** Spring Security, OAuth 2.0, JWT

**System Modules:**
```
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY LAYER                        │
├─────────────────────────────────────────────────────────────┤
│  REST API  │  GraphQL API  │  WebSocket  │  Webhook API    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  MICROSERVICES LAYER                        │
├─────────────┬─────────────┬─────────────┬──────────────────┤
│  Customer   │   Account   │   Ledger    │    Payments      │
│  Service    │   Service   │   Service   │     Service      │
├─────────────┼─────────────┼─────────────┼──────────────────┤
│ Compliance  │  Security   │  Reporting  │    Notification  │
│   Service   │   Service   │   Service   │     Service      │
├─────────────┼─────────────┼─────────────┼──────────────────┤
│  Crypto     │    Cards    │   Wallet    │    Integration   │
│   Service   │   Service   │   Service   │     Service      │
└─────────────┴─────────────┴─────────────┴──────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  DATA ACCESS LAYER                          │
├─────────────┬─────────────┬─────────────┬──────────────────┤
│  Primary    │   Cache     │   Message   │    Object        │
│  Database   │   Layer     │    Queue    │    Storage       │
│  (PostgreSQL)│  (Redis)   │   (Kafka)   │   (S3 Compatible)│
└─────────────┴─────────────┴─────────────┴──────────────────┘
```

### 1.2 Non-Functional Requirements

**Performance Requirements:**
- Transaction Processing: 10,000 TPS (Transactions Per Second)
- API Response Time: < 200ms (95th percentile)
- Database Query Time: < 50ms (average)
- System Availability: 99.99% (less than 52.56 minutes downtime per year)
- Concurrent Users: 1,000,000+ concurrent users

**Scalability Requirements:**
- Horizontal scaling for all microservices
- Auto-scaling based on load (min 3 instances, max 100 instances)
- Database sharding capability (up to 100 shards)
- Multi-region deployment capability

**Security Requirements:**
- End-to-end encryption (TLS 1.3)
- Multi-factor authentication
- Role-based access control (RBAC)
- Real-time fraud detection
- Compliance with ISO 27001, PCIDSS, GDPR

---

## 2. CUSTOMER MANAGEMENT (CIF)

### 2.1 Customer Information File (CIF) Module

**Data Model:**

```sql
CREATE TABLE customers (
    customer_id VARCHAR(36) PRIMARY KEY,
    customer_type ENUM('INDIVIDUAL', 'CORPORATE', 'SME', 'GOVERNMENT'),
    bvn VARCHAR(11) UNIQUE NOT NULL,
    nin VARCHAR(11),
    tax_id VARCHAR(15),
    customer_risk_level ENUM('LOW', 'MEDIUM', 'HIGH'),
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'CLOSED'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    INDEX idx_bvn (bvn),
    INDEX idx_nin (nin),
    INDEX idx_customer_type (customer_type),
    INDEX idx_status (status)
);

CREATE TABLE individual_customers (
    customer_id VARCHAR(36) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('MALE', 'FEMALE'),
    marital_status ENUM('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'),
    nationality VARCHAR(50) DEFAULT 'Nigeria',
    occupation VARCHAR(100),
    employer_name VARCHAR(200),
    income_range VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    phone_number VARCHAR(20),
    residential_address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    postal_code VARCHAR(10),
    country VARCHAR(50) DEFAULT 'Nigeria',
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE corporate_customers (
    customer_id VARCHAR(36) PRIMARY KEY,
    company_name VARCHAR(200) NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    date_of_incorporation DATE,
    business_type VARCHAR(100),
    industry_sector VARCHAR(100),
    business_address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    postal_code VARCHAR(10),
    country VARCHAR(50) DEFAULT 'Nigeria',
    email VARCHAR(100) UNIQUE,
    phone_number VARCHAR(20),
    website VARCHAR(200),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE customer_documents (
    document_id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    document_type ENUM('NATIONAL_ID', 'PASSPORT', 'DRIVER_LICENSE', 'VOTER_CARD', 'CAC_CERTIFICATE', 'TAX_CLEARANCE', 'UTILITY_BILL', 'PASSPORT_PHOTO', 'OTHER'),
    document_number VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    document_url VARCHAR(500),
    verification_status ENUM('PENDING', 'VERIFIED', 'REJECTED'),
    verified_by VARCHAR(36),
    verification_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_document_type (document_type),
    INDEX idx_verification_status (verification_status)
);
```

**API Endpoints:**

```java
// Customer Management API
@RestController
@RequestMapping("/api/v1/customers")
public class CustomerController {
    
    @PostMapping
    public ResponseEntity<Customer> createCustomer(@Valid @RequestBody CustomerRequest request);
    
    @GetMapping("/{customerId}")
    public ResponseEntity<Customer> getCustomer(@PathVariable String customerId);
    
    @GetMapping("/bvn/{bvn}")
    public ResponseEntity<Customer> getCustomerByBVN(@PathVariable String bvn);
    
    @PutMapping("/{customerId}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable String customerId, @Valid @RequestBody CustomerUpdateRequest request);
    
    @PostMapping("/{customerId}/documents")
    public ResponseEntity<CustomerDocument> uploadDocument(@PathVariable String customerId, @Valid @RequestBody DocumentUploadRequest request);
    
    @GetMapping("/{customerId}/documents")
    public ResponseEntity<List<CustomerDocument>> getCustomerDocuments(@PathVariable String customerId);
    
    @PostMapping("/{customerId}/verify")
    public ResponseEntity<Customer> verifyCustomer(@PathVariable String customerId, @Valid @RequestBody VerificationRequest request);
    
    @GetMapping("/search")
    public ResponseEntity<Page<Customer>> searchCustomers(@RequestParam String query, Pageable pageable);
    
    @PostMapping("/{customerId}/risk-assessment")
    public ResponseEntity<RiskAssessment> performRiskAssessment(@PathVariable String customerId);
}
```

### 2.2 KYC/AML Module

**KYC Verification Workflow:**

```java
@Service
public class KYCService {
    
    // BVN Verification
    public BVNVerificationResponse verifyBVN(String bvn) {
        // Integration with NIBSS BVN API
        BVNVerificationRequest request = BVNVerificationRequest.builder()
            .bvn(bvn)
            .apiKey(nibssApiKey)
            .build();
        
        BVNVerificationResponse response = nibssClient.verifyBVN(request);
        
        // Validate response
        if (!response.isValid()) {
            throw new KYCVerificationException("Invalid BVN");
        }
        
        return response;
    }
    
    // Identity Verification
    public IdentityVerificationResult verifyIdentity(IdentityVerificationRequest request) {
        // Multi-source verification
        IdentityVerificationResult result = IdentityVerificationResult.builder().build();
        
        // NIN Verification
        if (request.getNin() != null) {
            NINVerificationResponse ninResponse = verifyNIN(request.getNin());
            result.setNinVerified(ninResponse.isValid());
        }
        
        // Biometric Verification
        if (request.getBiometricData() != null) {
            BiometricVerificationResponse bioResponse = verifyBiometric(request.getBiometricData());
            result.setBiometricVerified(bioResponse.isMatch());
        }
        
        // Document Verification
        if (request.getDocumentImage() != null) {
            DocumentVerificationResponse docResponse = verifyDocument(request.getDocumentImage());
            result.setDocumentVerified(docResponse.isValid());
        }
        
        return result;
    }
    
    // PEP Screening
    public PEPCheckResult checkPEP(String customerName) {
        // Screen against international PEP databases
        PEPCheckRequest request = PEPCheckRequest.builder()
            .name(customerName)
            .dateOfBirth(request.getDateOfBirth())
            .nationality(request.getNationality())
            .build();
        
        PEPCheckResponse response = pepScreeningService.check(request);
        
        return PEPCheckResult.builder()
            .isPEP(response.isPEP())
            .pepType(response.getPEPType())
            .riskLevel(calculatePEPRiskLevel(response))
            .build();
    }
    
    // Sanctions Screening
    public SanctionsCheckResult checkSanctions(String customerName, String customerId) {
        // Screen against international sanctions lists
        SanctionsCheckResponse response = sanctionsScreeningService.check(customerName);
        
        return SanctionsCheckResult.builder()
            .isSanctioned(response.isSanctioned())
            .sanctionsList(response.getSanctionsList())
            .riskLevel(calculateSanctionsRiskLevel(response))
            .build();
    }
}
```

---

## 3. ACCOUNT MANAGEMENT SYSTEM

### 3.1 Account Management Module

**Data Model:**

```sql
CREATE TABLE accounts (
    account_id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    account_number VARCHAR(15) UNIQUE NOT NULL,
    account_type ENUM('SAVINGS', 'CURRENT', 'FIXED_DEPOSIT', 'CALL_DEPOSIT', 'DOMICILIARY', 'CRYPTO_WALLET'),
    account_currency VARCHAR(3) DEFAULT 'NGN',
    account_name VARCHAR(200) NOT NULL,
    account_balance DECIMAL(18, 8) DEFAULT 0.00 NOT NULL,
    available_balance DECIMAL(18, 8) DEFAULT 0.00 NOT NULL,
    hold_amount DECIMAL(18, 8) DEFAULT 0.00 NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE', 'FROZEN', 'CLOSED', 'DORMANT'),
    account_tier ENUM('TIER_1', 'TIER_2', 'TIER_3'),
    opening_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_transaction_date TIMESTAMP,
    virtual_iban VARCHAR(34) UNIQUE,
    linked_card_id VARCHAR(36),
    interest_rate DECIMAL(5, 2),
    overdraft_limit DECIMAL(18, 8) DEFAULT 0.00,
    daily_transaction_limit DECIMAL(18, 8) DEFAULT 1000000.00,
    monthly_transaction_limit DECIMAL(18, 8) DEFAULT 30000000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_account_number (account_number),
    INDEX idx_virtual_iban (virtual_iban),
    INDEX idx_status (status),
    CONSTRAINT chk_balance_non_negative CHECK (account_balance >= 0)
);

CREATE TABLE account_limits (
    account_id VARCHAR(36) PRIMARY KEY,
    daily_withdrawal_limit DECIMAL(18, 8),
    daily_transfer_limit DECIMAL(18, 8),
    daily_pos_limit DECIMAL(18, 8),
    daily_atm_limit DECIMAL(18, 8),
    monthly_withdrawal_limit DECIMAL(18, 8),
    monthly_transfer_limit DECIMAL(18, 8),
    single_transfer_limit DECIMAL(18, 8),
    international_transfer_limit DECIMAL(18, 8),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

CREATE TABLE virtual_ibans (
    virtual_iban VARCHAR(34) PRIMARY KEY,
    account_id VARCHAR(36) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    bank_name VARCHAR(100),
    bic_code VARCHAR(11),
    status ENUM('ACTIVE', 'INACTIVE'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id),
    INDEX idx_account_id (account_id),
    INDEX idx_currency (currency)
);

CREATE TABLE multi_currency_wallets (
    wallet_id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    wallet_address VARCHAR(100),
    balance DECIMAL(18, 8) DEFAULT 0.00,
    status ENUM('ACTIVE', 'INACTIVE', 'FROZEN'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    UNIQUE KEY uk_customer_currency (customer_id, currency),
    INDEX idx_customer_id (customer_id),
    INDEX idx_currency (currency)
);
```

**API Endpoints:**

```java
@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {
    
    @PostMapping
    public ResponseEntity<Account> createAccount(@Valid @RequestBody AccountRequest request);
    
    @GetMapping("/{accountId}")
    public ResponseEntity<Account> getAccount(@PathVariable String accountId);
    
    @GetMapping("/number/{accountNumber}")
    public ResponseEntity<Account> getAccountByNumber(@PathVariable String accountNumber);
    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Account>> getCustomerAccounts(@PathVariable String customerId);
    
    @PostMapping("/{accountId}/virtual-iban")
    public ResponseEntity<VirtualIBAN> generateVirtualIBAN(@PathVariable String accountId, @Valid @RequestBody VirtualIBANRequest request);
    
    @PostMapping("/multi-currency")
    public ResponseEntity<MultiCurrencyWallet> createMultiCurrencyWallet(@Valid @RequestBody MultiCurrencyWalletRequest request);
    
    @GetMapping("/{accountId}/balance")
    public ResponseEntity<AccountBalance> getAccountBalance(@PathVariable String accountId);
    
    @PostMapping("/{accountId}/freeze")
    public ResponseEntity<Account> freezeAccount(@PathVariable String accountId, @Valid @RequestBody FreezeAccountRequest request);
    
    @PostMapping("/{accountId}/unfreeze")
    public ResponseEntity<Account> unfreezeAccount(@PathVariable String accountId);
    
    @PostMapping("/{accountId}/close")
    public ResponseEntity<Account> closeAccount(@PathVariable String accountId, @Valid @RequestBody CloseAccountRequest request);
}
```

---

## 4. LEDGER SYSTEM (DOUBLE-ENTRY)

### 4.1 Double-Entry Ledger Module

**Data Model:**

```sql
CREATE TABLE ledger_entries (
    entry_id VARCHAR(36) PRIMARY KEY,
    transaction_id VARCHAR(36) NOT NULL,
    entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    entry_type ENUM('DEBIT', 'CREDIT') NOT NULL,
    account_id VARCHAR(36) NOT NULL,
    account_number VARCHAR(15) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    amount DECIMAL(18, 8) NOT NULL,
    description TEXT,
    reference_number VARCHAR(50),
    balance_after DECIMAL(18, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_account_id (account_id),
    INDEX idx_entry_date (entry_date),
    INDEX idx_entry_type (entry_type),
    FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

CREATE TABLE transactions (
    transaction_id VARCHAR(36) PRIMARY KEY,
    transaction_type ENUM('DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'PAYMENT', 'FEE', 'INTEREST', 'CURRENCY_EXCHANGE', 'CRYPTO_PURCHASE', 'CRYPTO_SALE'),
    transaction_status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REVERSED'),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    value_date TIMESTAMP,
    debit_account_id VARCHAR(36),
    credit_account_id VARCHAR(36),
    debit_account_number VARCHAR(15),
    credit_account_number VARCHAR(15),
    amount DECIMAL(18, 8) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    exchange_rate DECIMAL(10, 6),
    beneficiary_name VARCHAR(200),
    beneficiary_account VARCHAR(50),
    beneficiary_bank VARCHAR(100),
    beneficiary_bank_code VARCHAR(10),
    swift_code VARCHAR(11),
    reference_number VARCHAR(50),
    narration TEXT,
    initiated_by VARCHAR(36),
    approved_by VARCHAR(36),
    network_reference VARCHAR(100),
    fee_amount DECIMAL(18, 8) DEFAULT 0.00,
    tax_amount DECIMAL(18, 8) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_transaction_date (transaction_date),
    INDEX idx_debit_account (debit_account_id),
    INDEX idx_credit_account (credit_account_id),
    INDEX idx_transaction_status (transaction_status),
    INDEX idx_reference_number (reference_number)
);

CREATE TABLE transaction_logs (
    log_id VARCHAR(36) PRIMARY KEY,
    transaction_id VARCHAR(36) NOT NULL,
    log_level ENUM('INFO', 'WARNING', 'ERROR', 'CRITICAL'),
    log_message TEXT,
    log_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_log_timestamp (log_timestamp),
    FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id)
);
```

**Double-Entry Implementation:**

```java
@Service
@Transactional
public class LedgerService {
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private LedgerEntryRepository ledgerEntryRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    // Double-Entry Transaction Processing
    public TransactionResult processTransaction(TransactionRequest request) {
        // Validate transaction
        validateTransaction(request);
        
        // Check account balances
        Account debitAccount = accountRepository.findById(request.getDebitAccountId())
            .orElseThrow(() -> new AccountNotFoundException("Debit account not found"));
        
        Account creditAccount = accountRepository.findById(request.getCreditAccountId())
            .orElseThrow(() -> new AccountNotFoundException("Credit account not found"));
        
        // Check sufficient funds
        if (debitAccount.getAvailableBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientFundsException("Insufficient funds in debit account");
        }
        
        // Create transaction record
        Transaction transaction = Transaction.builder()
            .transactionId(UUID.randomUUID().toString())
            .transactionType(request.getTransactionType())
            .transactionStatus(TransactionStatus.PENDING)
            .transactionDate(LocalDateTime.now())
            .debitAccountId(request.getDebitAccountId())
            .debitAccountNumber(debitAccount.getAccountNumber())
            .creditAccountId(request.getCreditAccountId())
            .creditAccountNumber(creditAccount.getAccountNumber())
            .amount(request.getAmount())
            .currency(request.getCurrency())
            .narration(request.getNarration())
            .referenceNumber(generateReferenceNumber())
            .build();
        
        transaction = transactionRepository.save(transaction);
        
        try {
            // Create debit ledger entry
            LedgerEntry debitEntry = createLedgerEntry(
                transaction.getTransactionId(),
                debitAccount.getAccountId(),
                debitAccount.getAccountNumber(),
                request.getAmount(),
                request.getCurrency(),
                EntryType.DEBIT,
                request.getNarration()
            );
            
            // Create credit ledger entry
            LedgerEntry creditEntry = createLedgerEntry(
                transaction.getTransactionId(),
                creditAccount.getAccountId(),
                creditAccount.getAccountNumber(),
                request.getAmount(),
                request.getCurrency(),
                EntryType.CREDIT,
                request.getNarration()
            );
            
            // Update account balances
            updateAccountBalance(debitAccount.getAccountId(), -request.getAmount());
            updateAccountBalance(creditAccount.getAccountId(), request.getAmount());
            
            // Update transaction status
            transaction.setTransactionStatus(TransactionStatus.COMPLETED);
            transaction.setCompletedAt(LocalDateTime.now());
            transactionRepository.save(transaction);
            
            return TransactionResult.builder()
                .success(true)
                .transactionId(transaction.getTransactionId())
                .referenceNumber(transaction.getReferenceNumber())
                .message("Transaction completed successfully")
                .build();
                
        } catch (Exception e) {
            // Rollback transaction
            transaction.setTransactionStatus(TransactionStatus.FAILED);
            transaction.setFailureReason(e.getMessage());
            transactionRepository.save(transaction);
            
            throw new TransactionProcessingException("Transaction processing failed: " + e.getMessage(), e);
        }
    }
    
    private LedgerEntry createLedgerEntry(String transactionId, String accountId, 
                                          String accountNumber, BigDecimal amount, 
                                          String currency, EntryType entryType, 
                                          String description) {
        Account account = accountRepository.findById(accountId)
            .orElseThrow(() -> new AccountNotFoundException("Account not found"));
        
        BigDecimal balanceAfter = entryType == EntryType.DEBIT 
            ? account.getAccountBalance().subtract(amount)
            : account.getAccountBalance().add(amount);
        
        LedgerEntry entry = LedgerEntry.builder()
            .entryId(UUID.randomUUID().toString())
            .transactionId(transactionId)
            .entryDate(LocalDateTime.now())
            .entryType(entryType)
            .accountId(accountId)
            .accountNumber(accountNumber)
            .currency(currency)
            .amount(amount)
            .description(description)
            .balanceAfter(balanceAfter)
            .build();
        
        return ledgerEntryRepository.save(entry);
    }
    
    private void updateAccountBalance(String accountId, BigDecimal amount) {
        accountRepository.updateBalance(accountId, amount);
    }
    
    @Scheduled(fixedDelay = 1000)
    public void reconcileLedger() {
        // Perform automated ledger reconciliation
        List<Account> accounts = accountRepository.findAll();
        
        for (Account account : accounts) {
            // Calculate balance from ledger entries
            BigDecimal calculatedBalance = ledgerEntryRepository
                .calculateBalanceByAccountId(account.getAccountId());
            
            // Compare with account balance
            if (calculatedBalance.compareTo(account.getAccountBalance()) != 0) {
                // Log discrepancy
                logDiscrepancy(account.getAccountId(), account.getAccountBalance(), calculatedBalance);
                
                // Send alert
                alertService.sendAlert("Ledger discrepancy detected for account: " + account.getAccountNumber());
            }
        }
    }
}
```

---

## 5. PAYMENTS ENGINE

### 5.1 Payments Processing Module

**Data Model:**

```sql
CREATE TABLE payment_requests (
    request_id VARCHAR(36) PRIMARY KEY,
    transaction_id VARCHAR(36),
    payment_type ENUM('INTERNAL_TRANSFER', 'INTERBANK_TRANSFER', 'INTERNATIONAL_TRANSFER', 'CARD_PAYMENT', 'CRYPTO_PAYMENT'),
    payment_status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REVERSED'),
    initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    from_account_id VARCHAR(36),
    to_account_id VARCHAR(36),
    from_account_number VARCHAR(15),
    to_account_number VARCHAR(15),
    amount DECIMAL(18, 8) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    exchange_rate DECIMAL(10, 6),
    beneficiary_name VARCHAR(200),
    beneficiary_account VARCHAR(50),
    beneficiary_bank VARCHAR(100),
    beneficiary_bank_code VARCHAR(10),
    swift_code VARCHAR(11),
    routing_number VARCHAR(20),
    iban VARCHAR(34),
    reference VARCHAR(100),
    narration TEXT,
    fee_amount DECIMAL(18, 8) DEFAULT 0.00,
    total_amount DECIMAL(18, 8),
    payment_network ENUM('NIBSS', 'SWIFT', 'SEPA', 'ACH', 'VISA', 'MASTERCARD', 'CRYPTO'),
    network_reference VARCHAR(100),
    network_response TEXT,
    initiated_by VARCHAR(36),
    approved_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_from_account (from_account_id),
    INDEX idx_to_account (to_account_id),
    INDEX idx_payment_status (payment_status),
    INDEX idx_payment_network (payment_network),
    INDEX idx_initiated_at (initiated_at)
);

CREATE TABLE exchange_rates (
    rate_id VARCHAR(36) PRIMARY KEY,
    from_currency VARCHAR(3) NOT NULL,
    to_currency VARCHAR(3) NOT NULL,
    rate DECIMAL(10, 6) NOT NULL,
    inverse_rate DECIMAL(10, 6) NOT NULL,
    rate_source ENUM('CBN', 'MARKET', 'INTERNAL'),
    rate_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_timestamp TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_currency_pair (from_currency, to_currency),
    INDEX idx_from_currency (from_currency),
    INDEX idx_to_currency (to_currency),
    INDEX idx_rate_timestamp (rate_timestamp)
);
```

**Payments Engine Implementation:**

```java
@Service
public class PaymentsEngine {
    
    @Autowired
    private NIBSSClient nibssClient;
    
    @Autowired
    private SWIFTClient swiftClient;
    
    @Autowired
    private CryptoService cryptoService;
    
    @Autowired
    private FXEngine fxEngine;
    
    // Internal Transfer
    public PaymentResult processInternalTransfer(InternalTransferRequest request) {
        // Validate request
        validateInternalTransfer(request);
        
        // Process transfer through ledger
        TransactionResult ledgerResult = ledgerService.processTransaction(
            TransactionRequest.builder()
                .transactionType(TransactionType.TRANSFER)
                .debitAccountId(request.getFromAccountId())
                .creditAccountId(request.getToAccountId())
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .narration(request.getNarration())
                .build()
        );
        
        return PaymentResult.builder()
            .success(true)
            .referenceNumber(ledgerResult.getReferenceNumber())
            .message("Internal transfer completed successfully")
            .build();
    }
    
    // Interbank Transfer (NIBSS NIP)
    public PaymentResult processInterbankTransfer(InterbankTransferRequest request) {
        // Validate request
        validateInterbankTransfer(request);
        
        // FX Conversion if needed
        if (!request.getCurrency().equals("NGN")) {
            FXConversionResult fxResult = fxEngine.convertCurrency(
                request.getAmount(),
                request.getCurrency(),
                "NGN"
            );
            request.setAmount(fxResult.getConvertedAmount());
            request.setCurrency("NGN");
        }
        
        // Create payment request
        PaymentRequest paymentRequest = PaymentRequest.builder()
            .requestId(UUID.randomUUID().toString())
            .paymentType(PaymentType.INTERBANK_TRANSFER)
            .paymentStatus(PaymentStatus.PENDING)
            .fromAccountId(request.getFromAccountId())
            .toAccountNumber(request.getToAccountNumber())
            .amount(request.getAmount())
            .currency(request.getCurrency())
            .beneficiaryName(request.getBeneficiaryName())
            .beneficiaryBankCode(request.getBeneficiaryBankCode())
            .reference(request.getReference())
            .narration(request.getNarration())
            .paymentNetwork(PaymentNetwork.NIBSS)
            .initiatedBy(request.getInitiatedBy())
            .build();
        
        paymentRequest = paymentRequestRepository.save(paymentRequest);
        
        try {
            // Debit account
            TransactionResult debitResult = ledgerService.processTransaction(
                TransactionRequest.builder()
                    .transactionType(TransactionType.TRANSFER)
                    .debitAccountId(request.getFromAccountId())
                    .creditAccountId(getSettlementAccountId())
                    .amount(request.getAmount())
                    .currency(request.getCurrency())
                    .narration("Interbank transfer to " + request.getBeneficiaryName())
                    .build()
            );
            
            // Send to NIBSS
            NIBSSTransferRequest nibssRequest = NIBSSTransferRequest.builder()
                .sourceAccount(request.getFromAccountNumber())
                .destinationBankCode(request.getBeneficiaryBankCode())
                .destinationAccount(request.getToAccountNumber())
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .reference(request.getReference())
                .narration(request.getNarration())
                .build();
            
            NIBSSTransferResponse nibssResponse = nibssClient.processTransfer(nibssRequest);
            
            if (nibssResponse.isSuccessful()) {
                paymentRequest.setPaymentStatus(PaymentStatus.COMPLETED);
                paymentRequest.setNetworkReference(nibssResponse.getReference());
                paymentRequest.setCompletedAt(LocalDateTime.now());
                paymentRequestRepository.save(paymentRequest);
                
                return PaymentResult.builder()
                    .success(true)
                    .referenceNumber(paymentRequest.getReference())
                    .networkReference(nibssResponse.getReference())
                    .message("Interbank transfer completed successfully")
                    .build();
            } else {
                paymentRequest.setPaymentStatus(PaymentStatus.FAILED);
                paymentRequest.setNetworkResponse(nibssResponse.getMessage());
                paymentRequestRepository.save(paymentRequest);
                
                // Reverse debit
                reverseTransaction(debitResult.getTransactionId());
                
                throw new PaymentProcessingException("NIBSS transfer failed: " + nibssResponse.getMessage());
            }
            
        } catch (Exception e) {
            paymentRequest.setPaymentStatus(PaymentStatus.FAILED);
            paymentRequest.setNetworkResponse(e.getMessage());
            paymentRequestRepository.save(paymentRequest);
            
            throw new PaymentProcessingException("Interbank transfer processing failed", e);
        }
    }
    
    // International Transfer (SWIFT)
    public PaymentResult processInternationalTransfer(InternationalTransferRequest request) {
        // Validate request
        validateInternationalTransfer(request);
        
        // FX Conversion
        FXConversionResult fxResult = fxEngine.convertCurrency(
            request.getAmount(),
            request.getCurrency(),
            request.getTargetCurrency()
        );
        
        // Calculate fees
        BigDecimal fee = calculateInternationalTransferFee(fxResult.getConvertedAmount());
        BigDecimal totalAmount = fxResult.getConvertedAmount().add(fee);
        
        // Create payment request
        PaymentRequest paymentRequest = PaymentRequest.builder()
            .requestId(UUID.randomUUID().toString())
            .paymentType(PaymentType.INTERNATIONAL_TRANSFER)
            .paymentStatus(PaymentStatus.PENDING)
            .fromAccountId(request.getFromAccountId())
            .amount(request.getAmount())
            .currency(request.getCurrency())
            .targetCurrency(request.getTargetCurrency())
            .exchangeRate(fxResult.getExchangeRate())
            .convertedAmount(fxResult.getConvertedAmount())
            .feeAmount(fee)
            .totalAmount(totalAmount)
            .beneficiaryName(request.getBeneficiaryName())
            .beneficiaryAccount(request.getBeneficiaryAccount())
            .beneficiaryBank(request.getBeneficiaryBank())
            .swiftCode(request.getSwiftCode())
            .reference(request.getReference())
            .narration(request.getNarration())
            .paymentNetwork(PaymentNetwork.SWIFT)
            .initiatedBy(request.getInitiatedBy())
            .build();
        
        paymentRequest = paymentRequestRepository.save(paymentRequest);
        
        try {
            // Debit account (including fee)
            TransactionResult debitResult = ledgerService.processTransaction(
                TransactionRequest.builder()
                    .transactionType(TransactionType.TRANSFER)
                    .debitAccountId(request.getFromAccountId())
                    .creditAccountId(getSettlementAccountId())
                    .amount(totalAmount)
                    .currency(request.getCurrency())
                    .narration("International transfer to " + request.getBeneficiaryName())
                    .build()
            );
            
            // Send to SWIFT
            SWIFTTransferRequest swiftRequest = SWIFTTransferRequest.builder()
                .senderAccount(request.getFromAccountNumber())
                .beneficiaryAccount(request.getBeneficiaryAccount())
                .beneficiaryBank(request.getBeneficiaryBank())
                .swiftCode(request.getSwiftCode())
                .amount(fxResult.getConvertedAmount())
                .currency(request.getTargetCurrency())
                .reference(request.getReference())
                .narration(request.getNarration())
                .build();
            
            SWIFTTransferResponse swiftResponse = swiftClient.processTransfer(swiftRequest);
            
            if (swiftResponse.isSuccessful()) {
                paymentRequest.setPaymentStatus(PaymentStatus.COMPLETED);
                paymentRequest.setNetworkReference(swiftResponse.getReference());
                paymentRequest.setCompletedAt(LocalDateTime.now());
                paymentRequestRepository.save(paymentRequest);
                
                return PaymentResult.builder()
                    .success(true)
                    .referenceNumber(paymentRequest.getReference())
                    .networkReference(swiftResponse.getReference())
                    .convertedAmount(fxResult.getConvertedAmount())
                    .feeAmount(fee)
                    .message("International transfer initiated successfully")
                    .build();
            } else {
                paymentRequest.setPaymentStatus(PaymentStatus.FAILED);
                paymentRequest.setNetworkResponse(swiftResponse.getMessage());
                paymentRequestRepository.save(paymentRequest);
                
                // Reverse debit
                reverseTransaction(debitResult.getTransactionId());
                
                throw new PaymentProcessingException("SWIFT transfer failed: " + swiftResponse.getMessage());
            }
            
        } catch (Exception e) {
            paymentRequest.setPaymentStatus(PaymentStatus.FAILED);
            paymentRequest.setNetworkResponse(e.getMessage());
            paymentRequestRepository.save(paymentRequest);
            
            throw new PaymentProcessingException("International transfer processing failed", e);
        }
    }
}
```

---

## 6. COMPLIANCE AND RISK MANAGEMENT

### 6.1 Transaction Monitoring Service

```java
@Service
public class TransactionMonitoringService {
    
    @Autowired
    private AlertService alertService;
    
    @Autowired
    private RegulatoryReportingService regulatoryReportingService;
    
    // Real-time Transaction Monitoring
    @EventListener
    public void monitorTransaction(TransactionCompletedEvent event) {
        Transaction transaction = event.getTransaction();
        List<RuleViolation> violations = new ArrayList<>();
        
        // Check transaction limits
        if (exceedsTransactionLimit(transaction)) {
            violations.add(RuleViolation.builder()
                .ruleType(RuleType.TRANSACTION_LIMIT)
                .severity(Severity.HIGH)
                .description("Transaction exceeds limit")
                .build());
        }
        
        // Check for suspicious patterns
        if (isSuspiciousTransaction(transaction)) {
            violations.add(RuleViolation.builder()
                .ruleType(RuleType.SUSPICIOUS_PATTERN)
                .severity(Severity.HIGH)
                .description("Suspicious transaction pattern detected")
                .build());
        }
        
        // Check for money laundering indicators
        if (hasMoneyLaunderingIndicators(transaction)) {
            violations.add(RuleViolation.builder()
                .ruleType(RuleType.MONEY_LAUNDERING)
                .severity(Severity.CRITICAL)
                .description("Money laundering indicators detected")
                .build());
        }
        
        // Check sanctions
        if (isSanctionedEntity(transaction)) {
            violations.add(RuleViolation.builder()
                .ruleType(RuleType.SANCTIONS)
                .severity(Severity.CRITICAL)
                .description("Transaction with sanctioned entity")
                .build());
        }
        
        // Process violations
        if (!violations.isEmpty()) {
            processViolations(transaction, violations);
        }
    }
    
    private boolean exceedsTransactionLimit(Transaction transaction) {
        Account account = accountRepository.findById(transaction.getDebitAccountId())
            .orElseThrow(() -> new AccountNotFoundException("Account not found"));
        
        // Check daily limit
        BigDecimal dailyTotal = transactionRepository
            .getDailyTotalByAccount(transaction.getDebitAccountId());
        
        if (dailyTotal.add(transaction.getAmount()).compareTo(account.getDailyTransactionLimit()) > 0) {
            return true;
        }
        
        // Check monthly limit
        BigDecimal monthlyTotal = transactionRepository
            .getMonthlyTotalByAccount(transaction.getDebitAccountId());
        
        if (monthlyTotal.add(transaction.getAmount()).compareTo(account.getMonthlyTransactionLimit()) > 0) {
            return true;
        }
        
        return false;
    }
    
    private boolean isSuspiciousTransaction(Transaction transaction) {
        // Check for structuring (smurfing)
        List<Transaction> recentTransactions = transactionRepository
            .findRecentTransactions(transaction.getDebitAccountId(), 24);
        
        if (recentTransactions.size() > 10) {
            BigDecimal averageAmount = recentTransactions.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(recentTransactions.size()), RoundingMode.HALF_UP);
            
            if (transaction.getAmount().compareTo(averageAmount.multiply(BigDecimal.valueOf(0.95))) < 0 &&
                transaction.getAmount().compareTo(averageAmount.multiply(BigDecimal.valueOf(1.05))) > 0) {
                return true; // Structuring detected
            }
        }
        
        // Check for rapid transfers
        if (isRapidTransfer(transaction)) {
            return true;
        }
        
        // Check for round numbers
        if (transaction.getAmount().scale() == 0) {
            return true;
        }
        
        return false;
    }
    
    private boolean hasMoneyLaunderingIndicators(Transaction transaction) {
        // Check for high-value transactions
        if (transaction.getAmount().compareTo(new BigDecimal("10000000")) > 0) {
            return true;
        }
        
        // Check for international transfers to high-risk jurisdictions
        if (transaction.getTransactionType() == TransactionType.TRANSFER &&
            isHighRiskJurisdiction(transaction)) {
            return true;
        }
        
        // Check for rapid movement of funds
        if (isRapidFundMovement(transaction)) {
            return true;
        }
        
        return false;
    }
    
    private boolean isSanctionedEntity(Transaction transaction) {
        // Check beneficiary against sanctions lists
        if (transaction.getBeneficiaryName() != null) {
            SanctionsCheckResult result = sanctionsScreeningService.check(
                transaction.getBeneficiaryName()
            );
            
            if (result.isSanctioned()) {
                return true;
            }
        }
        
        // Check beneficiary bank
        if (transaction.getSwiftCode() != null) {
            SanctionsCheckResult result = sanctionsScreeningService.checkBank(
                transaction.getSwiftCode()
            );
            
            if (result.isSanctioned()) {
                return true;
            }
        }
        
        return false;
    }
    
    private void processViolations(Transaction transaction, List<RuleViolation> violations) {
        // Generate alert
        alertService.sendAlert(Alert.builder()
            .alertId(UUID.randomUUID().toString())
            .alertType(AlertType.TRANSACTION_VIOLATION)
            .severity(violations.get(0).getSeverity())
            .transactionId(transaction.getTransactionId())
            .accountNumber(transaction.getDebitAccountNumber())
            .amount(transaction.getAmount())
            .currency(transaction.getCurrency())
            .violations(violations)
            .createdAt(LocalDateTime.now())
            .build());
        
        // Block transaction if critical severity
        if (violations.stream().anyMatch(v -> v.getSeverity() == Severity.CRITICAL)) {
            blockTransaction(transaction);
        }
        
        // File STR if required
        if (violations.stream().anyMatch(v -> v.getRuleType() == RuleType.MONEY_LAUNDERING ||
                                               v.getRuleType() == RuleType.SUSPICIOUS_PATTERN)) {
            fileSuspiciousTransactionReport(transaction, violations);
        }
        
        // Freeze account if required
        if (violations.stream().anyMatch(v -> v.getSeverity() == Severity.CRITICAL)) {
            freezeAccount(transaction.getDebitAccountId());
        }
    }
    
    private void fileSuspiciousTransactionReport(Transaction transaction, List<RuleViolation> violations) {
        STRRequest request = STRRequest.builder()
            .strId(UUID.randomUUID().toString())
            .transactionId(transaction.getTransactionId())
            .reportingDate(LocalDate.now())
            .suspiciousActivityReason(violations.stream()
                .map(RuleViolation::getDescription)
                .collect(Collectors.joining("; ")))
            .suspiciousActivityDate(transaction.getTransactionDate().toLocalDate())
            .transactionAmount(transaction.getAmount())
            .transactionCurrency(transaction.getCurrency())
            .transactionType(transaction.getTransactionType().name())
            .reportingInstitution("GLOBAL BANK NIGERIA LIMITED")
            .accountNumber(transaction.getDebitAccountNumber())
            .accountHolderName(getAccountHolderName(transaction.getDebitAccountId()))
            .beneficiaryAccount(transaction.getCreditAccountNumber())
            .beneficiaryName(transaction.getBeneficiaryName())
            .beneficiaryBank(transaction.getBeneficiaryBank())
            .swiftCode(transaction.getSwiftCode())
            .referenceNumber(transaction.getReferenceNumber())
            .narration(transaction.getNarration())
            .build();
        
        regulatoryReportingService.fileSTR(request);
    }
}
```

---

## DOCUMENT CONTROL

**Document Number:** GBN-CBS-001  
**Version:** 1.0  
**Effective Date:** [Current Date]  
**Review Date:** [Current Date + 6 Months]  
**Prepared By:** Technology Department  
**Approved By:** Chief Technology Officer

---

*This Core Banking System Technical Specification document provides the detailed technical architecture and implementation guidelines for Global Bank Nigeria Limited's core banking platform. All components shall be implemented in accordance with CBN regulations and international banking standards.*