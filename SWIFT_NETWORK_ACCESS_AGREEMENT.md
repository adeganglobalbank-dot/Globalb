# SWIFT NETWORK ACCESS AGREEMENT

## GLOBAL BANK NIGERIA LIMITED

---

## AGREEMENT INFORMATION

**Agreement Number:** GBN-SWIFT-001  
**Agreement Type:** SWIFT Network Access and Connectivity Agreement  
**Date of Execution:** [Current Date]  
**Effective Date:** [Date of SWIFT Connectivity Activation]  
**Term:** Indefinite, subject to annual review

**Parties:**
**Party A:** SWIFT SCRL (Society for Worldwide Interbank Financial Telecommunication)
**Address:** Avenue Adele 1, B-1310 La Hulpe, Belgium

**Party B:** GLOBAL BANK NIGERIA LIMITED
**Address:** Plot 123, Adeola Odeku Street, Victoria Island, Lagos, Nigeria
**Registration Number:** RC 1234567
**Contact:** Olawale Abdul-Ganiyu, Managing Director/CEO
**Email:** adeganglobal@gmail.com
**Phone:** +2349030277275

---

## TABLE OF CONTENTS

1. Definitions and Interpretation
2. Scope of Services
3. SWIFT Connectivity and Access
4. Service Levels and Performance
5. Security and Compliance
6. Fees and Payment Terms
7. Confidentiality and Data Protection
8. Intellectual Property Rights
9. Warranties and Representations
10. Limitation of Liability
11. Term and Termination
12. Regulatory Compliance
13. Dispute Resolution
14. Miscellaneous Provisions

---

## 1. DEFINITIONS AND INTERPRETATION

### 1.1 Definitions

In this Agreement, unless the context otherwise requires, the following expressions shall have the meanings assigned to them:

**"BIC"** means Bank Identifier Code, a unique identification code assigned to financial institutions by SWIFT.

**"Customer"** means Party B and its authorized users and customers.

**"Customer Security Programme (CSP)"** means the mandatory security framework that all SWIFT users must implement to protect their SWIFT environment.

**"Daily Account Statement (DAKCS)"** means the daily statement of SWIFT messages sent and received.

**"Fin Messages"** means SWIFT FIN messages used for financial messaging and transactions.

**"Interface"** means the technical connection point between Party B's systems and the SWIFT network.

**"KYC Registry"** means the SWIFT KYC Registry, a central repository that maintains a standardized set of information about financial institutions for Know Your Customer purposes.

**"Message"** means any data transmitted via the SWIFT network, including FIN, InterAct, FileAct, and other message types.

**"Secure Store and Forward (SSF)"** means the SWIFT messaging service that securely stores and forwards messages between SWIFT users.

**"Service"** means the SWIFT network connectivity and related services provided by SWIFT to Party B.

**"SWIFTNet"** means the IP-based network infrastructure provided by SWIFT for the exchange of messages.

**"User Security Device (USD)"** means the physical or virtual security device used to authenticate SWIFT users.

### 1.2 Interpretation

- Words importing the singular include the plural and vice versa
- Headings are for convenience only and do not affect interpretation
- References to legislation include amendments and re-enactments
- References to parties include their permitted assigns and successors

---

## 2. SCOPE OF SERVICES

### 2.1 SWIFT Services Provided

SWIFT shall provide the following services to Global Bank Nigeria Limited:

#### 2.1.1 Core Messaging Services
- **FIN Messaging Service:** Secure store and forward messaging for financial transactions
- **InterAct Service:** Real-time interactive messaging and transaction services
- **FileAct Service:** Secure file transfer service for bulk data exchange
- **Browse Service:** Access to SWIFT documentation and reference materials

#### 2.1.2 Value-Added Services
- **KYC Registry:** Access to the SWIFT KYC Registry for KYC information sharing
- **Sanctions Screening:** Integration with SWIFT's sanctions screening service
- **Compliance Services:** Access to SWIFT's compliance and reporting tools
- **Business Intelligence:** Transaction analytics and reporting services

#### 2.1.3 Technical Services
- **SWIFTNet Connectivity:** IP-based network connectivity
- **BIC Assignment:** Assignment of unique Bank Identifier Code
- **Interface Support:** Technical support for interface implementation
- **Disaster Recovery:** Backup and recovery services

### 2.2 Message Types and Standards

Party B shall have access to the following SWIFT message categories:

#### 2.2.1 Payments and Cash Management
- **MT 100:** Customer Transfer
- **MT 101:** Request for Transfer
- **MT 102:** General Financial Institution Transfer
- **MT 103:** Single Customer Credit Transfer
- **MT 200:** Financial Institution Transfer for its Own Account
- **MT 202:** General Financial Institution Transfer
- **MT 210:** Notice to Receive

#### 2.2.2 Trade Services
- **MT 400:** Advice of Payment
- **MT 410:** Acknowledgement
- **MT 700:** Issue of a Documentary Credit
- **MT 710:** Advice of a Third Bank's Documentary Credit
- **MT 720:** Transfer of a Documentary Credit

#### 2.2.3 Treasury Markets
- **MT 300:** Foreign Exchange Confirmation
- **MT 304:** Securities Instruction
- **MT 320:** Fixed/Variable Interest Rate Swaps Confirmation

#### 2.2.4 Securities Markets
- **MT 502:** Securities Settlement
- **MT 508:** Instruction to Transfer Securities
- **MT 518:** Request for Statement of Securities Holdings

#### 2.2.5 ISO 20022 Messages
- **pacs.008:** Customer Credit Transfer
- **pacs.009:** Customer Credit Transfer Status
- **pain.001:** Customer Credit Transfer Initiation
- **camt.053:** Bank Account Statement

---

## 3. SWIFT CONNECTIVITY AND ACCESS

### 3.1 BIC Assignment

**BIC Details:**
- **Bank Name:** GLOBAL BANK NIGERIA LIMITED
- **Location:** Lagos, Nigeria
- **Proposed BIC:** GBNGLA2LXXX
- **Branch BICs:** To be assigned as branches are established

**BIC Usage:**
Party B shall use the assigned BIC for:
- Identifying itself in all SWIFT messages
- Receiving incoming SWIFT messages
- Routing payments and financial messages
- Correspondent banking relationships

### 3.2 Connectivity Options

**Recommended Connectivity:**
Party B shall establish connectivity to SWIFTNet through:

#### 3.2.1 Primary Connectivity
**Type:** IP-VPN or MPLS Network  
**Provider:** [Select from SWIFT Approved Network Vendors]
- Orange Business Services
- BT Global Banking Network
- Verizon Business
- Tata Communications
- AT&T Global Network

**Bandwidth:** Minimum 10 Mbps dedicated connection  
**Backup:** 10 Mbps secondary connection with automatic failover

#### 3.2.2 Interface Options
**Recommended Interface:** SWIFT Interface A (Internet access via Service Bureau)

**Alternative Options:**
- **SWIFT Interface B:** Leased line connection
- **SWIFT Interface C:** VPN connection over public Internet
- **SWIFT Interface D:** Dual connection (A + B)

**Interface Implementation:**
- Hardware: SWIFT recommended interface hardware (e.g., Cisco, Juniper)
- Software: SWIFT Alliance Access/Entry software suite
- Firewall: SWIFT-certified firewall configuration
- Redundancy: High-availability configuration with load balancing

### 3.3 User Security Devices

**USD Allocation:**
- **Primary USD:** Physical RSA SecurID Token (DigiPass)
- **Backup USD:** Virtual USD (software token)
- **Administrator USD:** Hardware token for administrative functions

**USD Management:**
- USDs shall be activated and distributed by SWIFT
- Lost or compromised USDs shall be immediately reported
- USD replacement charges shall apply for lost or damaged devices

---

## 4. SERVICE LEVELS AND PERFORMANCE

### 4.1 Service Availability

**Availability Targets:**
- **FIN Messaging Service:** 99.99% availability (excluding scheduled maintenance)
- **SWIFTNet Network:** 99.95% availability
- **Interface Connectivity:** 99.9% availability

**Scheduled Maintenance:**
- Planned maintenance windows: Up to 4 hours per month
- Advance notice: Minimum 7 days for planned maintenance
- Emergency maintenance: With reasonable notice when required

### 4.2 Message Delivery

**Delivery Performance:**
- **Message Processing Time:** Less than 5 seconds for FIN messages
- **Message Delivery Guarantee:** End-to-end message delivery confirmation
- **Message Storage:** Messages stored for 7 days on SWIFT network

**Message Quality:**
- **Message Format Validation:** Automatic validation against SWIFT standards
- **Error Detection:** Automatic detection of syntax and semantic errors
- **Message Acknowledgment:** Acknowledgment of message receipt and delivery

### 4.3 Support Services

**Support Levels:**

**Level 1 Support:**
- **Hours:** 24/7/365
- **Response Time:** Within 4 hours
- **Scope:** General inquiries, basic troubleshooting

**Level 2 Support:**
- **Hours:** 24/7/365
- **Response Time:** Within 2 hours
- **Scope:** Technical issues, interface problems

**Level 3 Support:**
- **Hours:** Business hours (CET)
- **Response Time:** Within 4 hours
- **Scope:** Complex technical issues, system errors

---

## 5. SECURITY AND COMPLIANCE

### 5.1 Customer Security Programme (CSP)

**Mandatory CSP Requirements:**

**1. Secure Your Environment:**
- Implement physical security measures
- Conduct regular security assessments
- Use secure network configurations
- Implement access controls and authentication

**2. Know and Limit Access:**
- Control access to SWIFT systems and applications
- Implement strong password policies
- Manage user privileges and rights
- Conduct regular access reviews

**3. Prevent Fraudulent Applications:**
- Validate input data and messages
- Implement message validation rules
- Monitor for unusual patterns and behaviors
- Use dual control for critical functions

**4. Plan for Incident Response:**
- Develop incident response procedures
- Conduct regular security drills
- Establish contact points with SWIFT
- Maintain backup and recovery capabilities

**5. Share Information:**
- Report security incidents to SWIFT
- Participate in security information sharing
- Conduct annual security self-assessment
- Maintain CSP compliance documentation

### 5.2 Security Controls

**Technical Controls:**
- **Firewalls:** SWIFT-certified firewall configuration
- **Encryption:** TLS 1.2/1.3 encryption for all network traffic
- **Authentication:** Multi-factor authentication for all users
- **Authorization:** Role-based access control (RBAC)
- **Monitoring:** Real-time security monitoring and logging
- **Vulnerability Management:** Regular vulnerability scanning and patching

**Operational Controls:**
- **Procedural Controls:** Documented security procedures
- **Training:** Regular security awareness training
- **Change Management:** Controlled change management process
- **Business Continuity:** Business continuity and disaster recovery planning
- **Incident Response:** Incident response and reporting procedures

### 5.3 Compliance Requirements

**Regulatory Compliance:**
- **ISO 27001:** Information Security Management System
- **ISO 22301:** Business Continuity Management System
- **PCIDSS:** Payment Card Industry Data Security Standard (if applicable)
- **FATF:** Financial Action Task Force Recommendations
- **Basel III:** Basel Committee on Banking Supervision Standards

**SWIFT Specific Compliance:**
- **SWIFT CSP Self-Assessment:** Annual self-assessment questionnaire
- **SWIFT CSP Control Framework:** Implementation of mandatory controls
- **SWIFT Security Standards:** Compliance with SWIFT security standards
- **SWIFT KYC Registry:** Participation in KYC Registry

---

## 6. FEES AND PAYMENT TERMS

### 6.1 Fee Structure

**One-Time Setup Fees:**
- **BIC Assignment Fee:** €2,000
- **Interface Setup Fee:** €1,500
- **User Security Device Fee:** €50 per device
- **Total One-Time Fees:** Approximately €4,000

**Annual Subscription Fees:**
- **FIN Messaging Service:** €2,500 per year
- **SWIFTNet Connectivity:** €1,500 per year
- **BIC Annual Fee:** €500 per year
- **KYC Registry Access:** €1,000 per year
- **Total Annual Fees:** Approximately €5,500

**Transaction Fees:**
- **FIN Messages:** €0.30 per message (based on monthly volume)
- **FileAct:** €0.10 per KB transferred
- **InterAct:** €0.20 per transaction
- **Volume Discounts:** Available for high-volume users

**Additional Services:**
- **Technical Support:** Included in subscription
- **Training:** €500 per training session
- **Consulting Services:** €200 per hour
- **Customization:** Quoted based on requirements

### 6.2 Payment Terms

**Payment Schedule:**
- Setup fees: Payable upon contract signing
- Annual fees: Payable annually in advance
- Transaction fees: Billed monthly, payable within 30 days
- Additional services: Payable within 30 days of invoice

**Payment Method:**
- Bank transfer to SWIFT's designated bank account
- Payments in Euro (EUR) only
- All bank charges are the responsibility of Party B

---

## 7. CONFIDENTIALITY AND DATA PROTECTION

### 7.1 Confidentiality Obligations

**Definition of Confidential Information:**
Confidential Information includes:
- All information exchanged between parties under this Agreement
- SWIFT network architecture and technical specifications
- Customer data and transaction information
- Security procedures and controls
- Pricing and commercial terms

**Confidentiality Commitments:**
Both parties shall:
- Keep all Confidential Information strictly confidential
- Not disclose Confidential Information to third parties
- Use Confidential Information only for the purposes of this Agreement
- Implement appropriate measures to protect Confidential Information
- Return or destroy Confidential Information upon termination

### 7.2 Data Protection

**SWIFT as Data Controller:**
SWIFT shall process Customer data in accordance with:
- General Data Protection Regulation (GDPR)
- Belgium Data Protection Act
- SWIFT Privacy Principles

**Customer Rights:**
Customers have the right to:
- Access their personal data processed by SWIFT
- Request correction of inaccurate data
- Request deletion of personal data
- Lodge complaints with data protection authorities

**Data Transfers:**
- Cross-border data transfers are subject to appropriate safeguards
- SWIFT maintains Standard Contractual Clauses for data transfers
- Data transfers to third countries are conducted under EU-approved mechanisms

---

## 8. INTELLECTUAL PROPERTY RIGHTS

### 8.1 SWIFT Intellectual Property

**Ownership:**
SWIFT retains all intellectual property rights in:
- SWIFT network infrastructure
- SWIFT software and applications
- SWIFT message standards and formats
- SWIFT documentation and training materials
- SWIFT trademarks and brand names

**License Grant:**
SWIFT grants Party B a non-exclusive, non-transferable license to:
- Use the SWIFT network for its own business purposes
- Use SWIFT software and applications as provided
- Use SWIFT message standards for messaging
- Access SWIFT documentation for reference

### 8.2 Party B Intellectual Property

**Ownership:**
Party B retains all intellectual property rights in:
- Its own data and information
- Its customer data and transaction records
- Its proprietary applications and systems
- Its business processes and methods

**Data Ownership:**
Party B owns all data transmitted through the SWIFT network and retains full rights to use such data for its business purposes.

---

## 9. WARRANTIES AND REPRESENTATIONS

### 9.1 SWIFT Warranties

**SWIFT represents and warrants that:**
- It has the right and authority to enter into this Agreement
- It has all necessary regulatory approvals to provide the Services
- The Services shall be provided in accordance with applicable industry standards
- It has implemented appropriate security measures to protect Customer data
- It shall comply with all applicable laws and regulations

### 9.2 Party B Warranties

**Party B represents and warrants that:**
- It is a validly incorporated company in Nigeria
- It has obtained all necessary regulatory approvals to operate as a bank
- It has the financial resources to pay all fees and charges
- It shall use the Services only for legitimate banking purposes
- It shall comply with all SWIFT rules and regulations
- It shall implement appropriate security measures as required by the CSP

### 9.3 Mutual Warranties

**Both parties represent and warrant that:**
- They shall comply with all applicable laws and regulations
- They shall not use the Services for illegal purposes
- They shall not infringe on the intellectual property rights of third parties
- They shall maintain appropriate insurance coverage
- They shall cooperate in security incident response

---

## 10. LIMITATION OF LIABILITY

### 10.1 SWIFT Liability Limitation

**Liability Cap:**
SWIFT's total liability under this Agreement shall not exceed:
- For any single incident: €1,000,000
- For all incidents in any 12-month period: €2,000,000

**Excluded Liabilities:**
SWIFT shall not be liable for:
- Loss of profits, revenue, or business
- Indirect or consequential losses
- Loss of data or information
- Cybersecurity incidents caused by Party B's failure to implement CSP controls
- Service interruptions caused by third parties or force majeure events

### 10.2 Party B Liability Limitation

**Liability for Fees:**
Party B shall be fully liable for all fees and charges incurred under this Agreement.

**Liability for Misuse:**
Party B shall be liable for any losses or damages resulting from:
- Unauthorized use of the SWIFT network
- Breach of SWIFT rules and regulations
- Non-compliance with security requirements
- Fraud or illegal activities

### 10.3 Force Majeure

Neither party shall be liable for any failure or delay in performance due to:
- Acts of God
- War, terrorism, or civil unrest
- Government actions or regulations
- Network failures or interruptions
- Third-party service provider failures

---

## 11. TERM AND TERMINATION

### 11.1 Agreement Term

**Initial Term:**
This Agreement shall commence on the Effective Date and shall continue for an initial term of 5 years.

**Renewal:**
This Agreement shall automatically renew for successive 5-year terms unless either party provides written notice of non-renewal at least 90 days prior to the end of the then-current term.

### 11.2 Termination Rights

**Termination for Cause:**
Either party may terminate this Agreement if:
- The other party commits a material breach and fails to cure such breach within 30 days of written notice
- The other party becomes insolvent or enters bankruptcy proceedings
- The other party ceases to operate its business
- Regulatory authorities require termination

**Termination for Convenience:**
Either party may terminate this Agreement upon 180 days written notice to the other party.

### 11.3 Termination Process

**Termination Steps:**
- Notice of termination shall be in writing
- Parties shall cooperate to ensure orderly transition
- Outstanding fees and charges shall be paid
- Confidential information shall be returned or destroyed
- BIC shall be surrendered upon final termination

---

## 12. REGULATORY COMPLIANCE

### 12.1 Sanctions Compliance

**Obligations:**
Party B shall:
- Screen all transactions against international sanctions lists
- Implement sanctions screening as part of transaction processing
- Report any sanctioned transactions to SWIFT and relevant authorities
- Comply with OFAC, EU, UN, and UK sanctions

**SWIFT Support:**
SWIFT provides:
- Sanctions screening services
- Sanctions list updates
- Reporting tools for sanctions compliance
- Guidance on sanctions implementation

### 12.2 AML/CFT Compliance

**Obligations:**
Party B shall:
- Implement robust AML/CFT measures
- Screen customers and transactions for suspicious activities
- Report suspicious transactions to relevant authorities
- Comply with FATF recommendations and Nigerian AML/CFT regulations

**SWIFT Support:**
SWIFT provides:
- AML/CFT guidance and best practices
- Transaction monitoring tools
- Reporting capabilities for suspicious transactions
- Training on AML/CFT compliance

### 12.3 Regulatory Reporting

**Reporting Requirements:**
Party B shall:
- Submit required reports to Central Bank of Nigeria
- Submit required reports to Nigeria Financial Intelligence Unit
- Comply with all Nigerian regulatory reporting requirements
- Maintain records as required by Nigerian regulations

---

## 13. DISPUTE RESOLUTION

### 13.1 Negotiation

**First Step:**
Any dispute arising under this Agreement shall first be resolved through good faith negotiations between senior executives of both parties.

### 13.2 Mediation

**Second Step:**
If negotiation fails, the dispute shall be submitted to mediation:
- Mediator shall be jointly appointed by both parties
- Mediation shall be conducted in Brussels, Belgium
- Language of mediation: English
- Costs of mediation shall be shared equally

### 13.3 Arbitration

**Final Step:**
If mediation fails, the dispute shall be resolved through arbitration:
- **Forum:** International Chamber of Commerce (ICC) Arbitration
- **Seat of Arbitration:** Brussels, Belgium
- **Governing Law:** Belgian Law
- **Language:** English
- **Number of Arbitrators:** Three (one appointed by each party, third by ICC)
- **Award:** Final and binding, enforceable under the New York Convention

---

## 14. MISCELLANEOUS PROVISIONS

### 14.1 Governing Law and Jurisdiction

**Governing Law:**
This Agreement shall be governed by and construed in accordance with the laws of Belgium.

**Jurisdiction:**
Any disputes arising under this Agreement shall be subject to the exclusive jurisdiction of the courts of Brussels, Belgium.

### 14.2 Severability

If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be replaced with a valid provision that as closely as possible reflects the original intent.

### 14.3 Entire Agreement

This Agreement constitutes the entire agreement between the parties regarding the subject matter hereof and supersedes all prior agreements, understandings, and negotiations, whether written or oral.

### 14.4 Assignment

Party B may not assign or transfer any rights or obligations under this Agreement without the prior written consent of SWIFT. SWIFT may assign its rights and obligations without restriction.

### 14.5 Notices

All notices shall be in writing and shall be deemed to have been properly served if:
- Delivered personally
- Sent by registered mail
- Sent by email to the addresses specified in this Agreement

### 14.6 Amendment

Any amendment to this Agreement shall be in writing and signed by both parties.

### 14.7 Waiver

No waiver of any provision of this Agreement shall be effective unless in writing and signed by the authorized representative of the waiving party.

---

## SIGNATURE AND EXECUTION

IN WITNESS WHEREOF, the parties have executed this SWIFT Network Access Agreement as of the date first written above.

**FOR SWIFT SCRL:**

**__________________________**  
Name: [Name of SWIFT Representative]  
Title: [Title of SWIFT Representative]  
Date: [Date of Execution]

**FOR GLOBAL BANK NIGERIA LIMITED:**

**__________________________**  
OLAWALE ABDUL-GANIYU  
Managing Director/Chief Executive Officer  
Date: [Date of Execution]

**__________________________**  
[Name of Director/Company Secretary]  
Company Secretary  
Date: [Date of Execution]

---

## DOCUMENT CONTROL

**Document Number:** GBN-SWIFT-001  
**Version:** 1.0  
**Effective Date:** [Current Date]  
**Review Date:** [Current Date + 1 Year]  
**Prepared By:** Legal Department  
**Approved By:** Board of Directors

---

*This SWIFT Network Access Agreement is subject to approval by the Central Bank of Nigeria and compliance with all applicable Nigerian banking regulations.*