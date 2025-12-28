# Architecture Diagrams
## BUYSEWA E-commerce Platform

**Version:** 1.0
**Date:** 2024

---

## System Architecture Overview

```

                         CLIENT LAYER                             
    
                React Frontend (Port 5173)                     
              
     Homepage    Products     Cart       Checkout     
              
              
      Login      Dashboard    Review      Payment     
              
    
                          ↓ HTTP/HTTPS                            

                              ↓

                      APPLICATION LAYER                          
    
           Express.js Backend API (Port 5000)                  
            
     Auth Routes     Product Routes   Order Routes     
            
            
     Review Routes    SDC Routes    Payment Routes    
            
        
             Middleware (Auth, Validation)               
        
    
                          ↓ API Calls                             

                              ↓

                        DATA LAYER                                
    
                MongoDB Database                               
              
      Users      Products     Orders     Reviews     
              
                                                   
       SDCs                                                  
                                                   
    

                              ↓

                    BLOCKCHAIN LAYER                             
    
           Hardhat + Ethereum Network                          
       
             ReviewAuth Smart Contract                       
      • registerSDC()                                        
      • verifySDC()                                           
      • submitReview()                                       
      • getReview()                                          
       
       
                  IPFS Network                                
      • Store review content (rating, comment, images)       
      • Return IPFS hash                                     
       
    

                              ↓

                    EXTERNAL SERVICES                             
    
                eSewa Payment Gateway                          
    • Payment initiation                                       
    • Payment callback                                         
    • HMAC signature verification                              
    

```

---

## Component Architecture

```

                    FRONTEND COMPONENTS                       

                                                              
            
     App.tsx      Homepage    ProductListing
            
                                                           
                                                           
                                                           
            
  AuthContext        CartContext        OrderContext 
            
                                                           
                                                           
                   
                                                              
                                                              
                                              
                        api.ts                              
                        (API Client)                        
                                              
                                                              

                                HTTP Requests
                               

                    BACKEND COMPONENTS                       

                                                              
            
    server.js    authRoutes    auth.js       
             (middleware)  
                                           
                                                          
                                           
                        productRoutes                    
                                           
                                                          
                                           
                        orderRoutes                      
                                           
                                                          
                                           
                        reviewRoutes                     
                                           
                                                          
                                           
                         sdcRoutes                       
                                           
                                                          
                                           
                        esewaRoutes                      
                                           
                                                          
         
                                                              
                                                              
            
   User Model        Product Model       Order Model  
            
                             
   Review Model        SDC Model                         
                             
                                                              
                                                              
                                              
                         MongoDB                            
                                              

```

---

## Data Flow Architecture

### Authentication Flow
```
User → LoginPage → authAPI.login() → Backend API
                                              ↓
                                    Verify Credentials
                                              ↓
                                    Generate JWT Token
                                              ↓
                                    Return Token + User Data
                                              ↓
User ← Store Token (localStorage) ← AuthContext ← API Response
```

### Product Browsing Flow
```
User → ProductListing → productAPI.getAll() → Backend API
                                                    ↓
                                          Query MongoDB
                                                    ↓
                                          Return Products
                                                    ↓
User ← Display Products ← ProductListing ← API Response
```

### Order Creation Flow
```
User → CheckoutPage → orderAPI.create() → Backend API
                                              ↓
                                    Validate Cart Items
                                              ↓
                                    Create Order in MongoDB
                                              ↓
                                    Generate Order Number
                                              ↓
                                    Return Order Data
                                              ↓
User ← Redirect to Payment ← CheckoutPage ← Order Created
```

### Payment Flow
```
User → PaymentGateway → esewaAPI.initiate() → Backend API
                                                    ↓
                                          Generate Payment Form
                                          (with HMAC signature)
                                                    ↓
                                          Return Payment URL
                                                    ↓
User → Redirect to eSewa → eSewa Payment Page
                                              ↓
                                    User Completes Payment
                                              ↓
                                    eSewa Redirects Back
                                              ↓
Backend ← Payment Callback ← Verify HMAC Signature
    ↓
Update Order Payment Status
    ↓
Return Success/Failure
    ↓
User ← Payment Success/Failure Page
```

### SDC Generation Flow
```
Admin → Update Order Status → orderAPI.updateStatus() → Backend API
                                                              ↓
                                                    Status = "delivered"
                                                              ↓
                                                    Generate SDC Codes
                                                              ↓
                                                    Hash SDC (SHA-256)
                                                              ↓
                                                    Store in MongoDB
                                                              ↓
                                                    Register on Blockchain
                                                              ↓
                                                    Store Transaction Hash
                                                              ↓
Admin ← Order Updated ← SDC Generated ← Blockchain Registered
```

### Review Submission Flow
```
Buyer → ReviewSubmission → Enter SDC Code
                              ↓
                    sdcAPI.verify() → Backend API
                              ↓
                    Verify SDC on Blockchain
                              ↓
                    Check if SDC is Used
                              ↓
                    Return SDC Validity
                              ↓
Buyer → Enter Review Details → Connect MetaMask Wallet
                              ↓
                    reviewAPI.submit() → Backend API
                              ↓
                    Store Review on IPFS
                              ↓
                    Submit to Blockchain Smart Contract
                              ↓
                    Store Transaction Hash
                              ↓
                    Mark SDC as Used
                              ↓
Buyer ← Review Submitted ← Display on Product Page
```

---

## Deployment Architecture

```

                    PRODUCTION ENVIRONMENT                     

                                                              
    
                Load Balancer (Nginx)                       
    
                                                           
                                                           
                  
    Frontend Server       Frontend Server              
    (React Build)         (React Build)                
                  
                                                           
                                             
                                                            
    
                API Gateway (Express)                       
    
                                                           
                                                           
                  
    Backend Server        Backend Server              
    (Node.js)             (Node.js)                   
                  
                                                           
                                             
                                                            
    
           MongoDB Replica Set (Primary + Secondary)       
    
                                                              
    
           Ethereum Network (Mainnet/Testnet)              
           • ReviewAuth Smart Contract                      
           • IPFS Network                                   
    
                                                              
    
           External Services                               
           • eSewa Payment Gateway                         
    

```

---

## Security Architecture

```

                    SECURITY LAYERS                            

                                                              
  Layer 1: Frontend Security                                  
  • Input validation                                          
  • XSS prevention                                            
  • CSRF tokens                                               
  • Secure token storage (localStorage)                       
                                                              
  Layer 2: API Security                                       
  • JWT authentication                                        
  • CORS configuration                                        
  • Rate limiting                                             
  • Input sanitization                                        
  • HMAC signature verification (payments)                   
                                                              
  Layer 3: Data Security                                      
  • Password hashing (bcrypt)                                 
  • SDC hashing (SHA-256)                                     
  • Database encryption                                        
  • Secure database connections                               
                                                              
  Layer 4: Blockchain Security                                
  • Smart contract access control                             
  • SDC verification on-chain                                 
  • Immutable review storage                                  
  • IPFS content addressing                                   
                                                              

```

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 18.x |
| **Frontend** | TypeScript | 5.x |
| **Frontend** | Vite | 5.x |
| **Frontend** | Tailwind CSS | 3.x |
| **Frontend** | React Router | 6.x |
| **Backend** | Node.js | 18+ |
| **Backend** | Express.js | 4.x |
| **Backend** | MongoDB | 6+ |
| **Backend** | Mongoose | 8.x |
| **Authentication** | JWT | 9.x |
| **Authentication** | bcrypt | 5.x |
| **Blockchain** | Hardhat | 2.x |
| **Blockchain** | Solidity | 0.8.19 |
| **Blockchain** | Ethers.js | 6.x |
| **Payment** | eSewa API | Latest |

---

**Document Status:** Approved
**Version History:**
- v1.0 (2024) - Initial Architecture Diagrams

