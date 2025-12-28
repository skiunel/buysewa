#  BUYSEWA Class Diagrams

This directory contains comprehensive UML class diagrams for the BUYSEWA e-commerce platform, organized by domain.

##  Files

### Main Entry Point
- **`index.html`** - Navigation hub with cards for all diagrams

### Domain Diagrams
1. **`01-user-domain-class-diagram.html`** - User domain with 7 main entities
2. **`02-admin-domain-class-diagram.html`** - Admin domain with 8 main entities
3. **`03-seller-domain-class-diagram.html`** - Seller domain with 9 main entities

##  User Domain

**Location:** `01-user-domain-class-diagram.html`

Manages all user-related functionality including authentication, profiles, orders, and reviews.

### Entities:
- **User** - Core user account with authentication
- **UserProfile** - Extended user information
- **Wallet** - Digital wallet for payments
- **Order** - Purchase orders with items and shipping
- **Review** - Product reviews with blockchain verification
- **SDC** - Secure Digital Code for order verification
- **Cart** - Shopping cart management

### Relationships:
```
User (1) → (many) Order
User (1) → (many) Review
User (1) → (many) SDC
User (1) → (1) UserProfile
User (1) → (1) Wallet
User (1) → (1) Cart
Order (1) → (many) SDC
SDC (1) → (1) Review
```

##  Admin Domain

**Location:** `02-admin-domain-class-diagram.html`

Handles system administration, analytics, reporting, and content moderation.

### Entities:
- **Admin** - Administrator accounts with role-based permissions
- **AdminDashboard** - Personalized admin interface
- **Analytics** - Event tracking and metrics
- **Report** - Generated business reports
- **Notification** - System alerts and notifications
- **AuditLog** - Complete action audit trail
- **SystemSettings** - Configuration management
- **UserManagement** - User account control
- **ContentModeration** - Review and content flagging

### Relationships:
```
Admin (1) → (1) AdminDashboard
Admin (1) → (many) Analytics
Admin (1) → (many) Report
Admin (1) → (many) Notification
Admin (1) → (many) AuditLog
Admin (1) → (1) SystemSettings
Admin (1) → (1) UserManagement
Admin (1) → (many) ContentModeration
```

##  Seller Domain

**Location:** `03-seller-domain-class-diagram.html`

Manages seller accounts, product catalogs, inventory, sales, and payments.

### Entities:
- **Seller** - Seller account with shop ownership
- **Shop** - Online shop with branding
- **Product** - Individual products
- **Inventory** - Stock management
- **Sale** - Sales transactions
- **Payout** - Payment processing
- **SellerDashboard** - Analytics dashboard
- **SellerReview** - Customer reviews of sellers
- **Performance** - Seller metrics and ratings

### Relationships:
```
Seller (1) → (1) Shop
Seller (1) → (many) Product
Seller (1) → (many) Inventory
Seller (1) → (many) Sale
Seller (1) → (many) Payout
Seller (1) → (1) SellerDashboard
Seller (1) → (many) SellerReview
Seller (1) → (1) Performance
Shop (1) → (many) Product
Product (1) → (1) Inventory
Sale (1) → (1) Product
```

##  How to View

### Option 1: Open in Browser
Simply open `index.html` in your web browser to see the navigation hub with all diagrams.

### Option 2: Direct Links
Open any diagram directly:
- User Domain: `01-user-domain-class-diagram.html`
- Admin Domain: `02-admin-domain-class-diagram.html`
- Seller Domain: `03-seller-domain-class-diagram.html`

### Option 3: Local Server
If running a local server, navigate to the diagrams directory:
```bash
cd docs/diagrams
python -m http.server 8000
# Then visit http://localhost:8000
```

##  How to Read

### UML Class Notation

```

      ClassName          

 - privateAttribute        ← Attributes (-)
 + publicMethod()          ← Methods (+)

```

### Relationship Arrows

- `→` (solid line) - Association
- `--→` (dashed line) - Dependency
- `--` (diamond) - Composition
- `-|` (open diamond) - Aggregation

### Cardinality Notation

- `1` - One
- `*` - Many (zero or more)
- `1..*` - One or more
- `0..1` - Zero or one

##  Features

 **Responsive Design** - Works on desktop, tablet, and mobile
 **Interactive Legends** - Each diagram includes explanations
 **Color-Coded Domains** - Different colors for each domain
 **Mermaid JS** - Clean, maintainable diagram syntax
 **Print-Friendly** - Can be printed or exported as PDF
 **Dark/Light Support** - Adapts to system preferences

##  Database Schema Alignment

These diagrams directly reflect the MongoDB schema used in:
- `/review-backend/models/` - Database models
- `/src/services/` - Frontend services

### Sample Mapping:
```
Class: User
↓
File: review-backend/models/User.js
↓
Collection: users (MongoDB)
```

##  Cross-Domain References

While each domain is separate, they interact as follows:

### User ↔ Seller
- Users browse seller shops
- Users purchase seller products
- Users review seller items
- Sellers track user purchases

### User ↔ Admin
- Admins manage user accounts
- Admins verify user reviews
- Admins handle user disputes
- Users report to admins

### Seller ↔ Admin
- Admins monitor seller performance
- Admins verify seller accounts
- Admins handle seller violations
- Sellers appeal admin decisions

### All Domains ↔ Blockchain
- All domains use blockchain for review verification
- SDC codes registered on blockchain
- Reviews stored on IPFS
- Transactions tracked on-chain

##  Notes

- All diagrams use **UML 2.0** standard notation
- Diagrams are **technology-agnostic** (not MongoDB-specific)
- Cardinality follows **relational database** conventions
- Methods shown are **representative** not exhaustive

##  Security Entities

These classes are related to security:

### User Domain
- User (password hashing, authentication)
- SDC (secure code generation)
- Wallet (payment security)

### Admin Domain
- Admin (role-based access control)
- AuditLog (security tracking)
- ContentModeration (content safety)

### Seller Domain
- Performance (fraud detection)
- Payout (financial security)

##  Future Enhancements

- [ ] Add sequence diagrams
- [ ] Add state machine diagrams
- [ ] Add use case diagrams
- [ ] Add ER (Entity-Relationship) diagrams
- [ ] Add deployment diagrams
- [ ] Add component diagrams

##  Related Documentation

- **Architecture Diagram** - `docs/design/01-Architecture-Diagram.md`
- **Database Schema** - `docs/design/02-Database-Schema.md`
- **API Design** - `docs/design/03-API-Design.md`

##  Maintenance

To update diagrams:

1. Edit the Mermaid syntax in the respective HTML file
2. Ensure cardinality matches the actual implementation
3. Add/remove entities as the system evolves
4. Update the legend descriptions

##  Support

For questions about the diagrams:
1. Check the legend on each diagram
2. Review the related markdown documentation
3. Check the database models in `/review-backend/models/`
4. Review the API routes in `/review-backend/routes/`

---

**Last Updated:** December 26, 2025
**Version:** 1.0
**Status:** Production Ready
