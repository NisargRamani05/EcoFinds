# EcoFinds - Sustainable Second-Hand Marketplace 

A secure, community-driven, and interactive web application for buying and selling **second-hand products**.  
EcoFinds promotes **sustainable consumption** by extending the lifecycle of products, reducing waste, and encouraging a **circular economy**.  

Built with **Next.js, TailwindCSS, TypeScript, MongoDB, and NextAuth.js**, EcoFinds delivers a scalable and engaging experience for users on both desktop and mobile.


## Overview
EcoFinds empowers users to:
- **Register/Login securely** with authentication.
- **Create & manage product listings** with title, description, category, price, and image placeholder.
- **Browse products** with search & category filters.
- **Manage listings (CRUD)** – edit, delete, or view details.
- **Add items to cart & checkout history** (previous purchases).
- **Chatbot assistant** to guide users with product discovery and FAQs.
- **Responsive experience** on desktop and mobile.

## Features

- **User Roles**: Guest (browse listings), User (create/manage listings, cart, purchases), Admin (moderate content)
- **Authentication**: Secure login/register with JWT sessions via NextAuth.js
- **Profile Management**: Edit profile information from a personal dashboard
- **Product Listings (CRUD)**:
  - Create new listings with title, description, category, price, and image placeholder
  - Edit or delete your listings
  - View all listings in a feed
- **Product Browsing**:
  - Explore all items with list/grid view
  - Category-based filtering
  - Keyword search on titles
  - Product detail view with description, category, and price
- **Cart System**: Add/remove items to cart before purchase
- **Previous Purchases**: Track purchased items
- **AI Chatbot Assistant**: Integrated chatbot for user guidance, FAQs, and product discovery
- **Responsive Design**: Mobile-first, optimized for desktop and tablet
- **Modern UI**: Styled with TailwindCSS


##  Installation
### Clone the Repository
   ```
   git clone https://github.com/VandanKambodi/EcoFinds.git
   cd EcoFinds
   ```
### Install Dependencies
   ```
   npm install
   ```
### Set up Environment Variables
Create a file named `.env.local` in the root directory:
   ```
MONGODB_URI=your_mongodb_atlas_connection_string
NEXTAUTH_SECRET=your_auth_secret
GEMINI_API_KEY=your_chat_api
RESEND_API_KEY=generate_resend_api_key
   ```
### Run the Development Server
   ```
   npm run dev
   ```
#### Open http://localhost:3000 to view the application.


## Tech Stack
- **Frontend:** Next.js, React, TailwindCSS
- **Backend:** Next.js API routes, Node.js (v18+)
- **Database:** MongoDB Atlas
- **Auth:** NextAuth.js (JWT)
- **AI/Chatbot:** Integrated assistant API
- **Styling:** TailwindCSS


## Project Structure
```bash
EcoFinds/
├── public/                         # Public assets (favicon, images, logos)
├── src/
│   ├── app/                        # Next.js App Router (pages & APIs)
│   │   ├── api/                    # API endpoints
│   │   │   ├── auth/               # Authentication APIs
│   │   │   │   └── [...nextauth]/  # NextAuth.js dynamic routes
│   │   │   ├── products/           # CRUD for products
│   │   │   ├── users/              # User-related APIs
│   │   │   └── chatbot/            # Chatbot integration API
│   │   │
│   │   ├── cart/                   # Cart page
│   │   ├── dashboard/              # User dashboard page
│   │   ├── listings/               # All product listings
│   │   ├── login/                  # Login page
│   │   ├── profile/                # Profile page
│   │   ├── purchases/              # Previous purchases
│   │   ├── signup/                 # Signup page
│   │   │
│   │   ├── globals.css             # Global styles
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Landing / home page
│   │
│   ├── components/                 # Reusable components
│   │   ├── Header.tsx              # Navigation header
│   │   ├── ProductCard.tsx         # Card for product listings
│   │   ├── Chatbot.tsx             # Chatbot UI component
│   │   ├── UserMenu.tsx            # User profile dropdown menu
│   │   └── (other UI components)   # Any additional components
│   │
│   ├── lib/                        # Utility functions & configs
│   │   ├── db.ts                   # MongoDB connection config
│   │   └── auth.ts                 # Authentication helpers
│   │
│   ├── models/                     # Mongoose schemas
│   │   ├── User.ts                 # User schema/model
│   │   └── Product.ts              # Product schema/model
│   │
│   └── types/                      # TypeScript type definitions
│       └── next-auth.d.ts          # NextAuth type overrides
│   
│
├── .env.local                      # Environment variables (ignored by Git)
├── package.json                    # Dependencies & scripts
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.js              # TailwindCSS configuration
├── postcss.config.js               # PostCSS configuration
└── README.md                       # Project documentation
```

## Development Roadmap

- [x] Basic project setup with Next.js + TypeScript
- [x] MongoDB Atlas integration with Mongoose models
- [x] Authentication with NextAuth.js
- [x] User dashboard and profile editing
- [x] Product listing creation and management (CRUD)
- [x] Product browsing with search & filtering
- [x] Cart system
- [x] Previous purchases tracking
- [x] Chatbot integration for FAQs and guidance
- [x] Responsive UI with TailwindCSS
- [x] Image upload support for products
- [x] Notifications for cart updates and purchases


## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current user session

### Products
- `GET /api/products` - Get all products (with filters & search)
- `POST /api/products` - Create new product listing (authenticated)
- `GET /api/products/[id]` - Get product details
- `GET /api/products/[id]` - Update product (author only)
- `DELETE /api/products/[id]` - Delete product (author only)

### Users
- `GET /api/users/[id]` - Get user profile and listings
- `PUT /api/users/[id]` - Update user profile

### Cart
- `GET /api/cart` - Get current user cart
- `POST /api/cart` - Add product to cart
- `DELETE /api/cart/[id]` - Remove product from cart
  
### Purchases
- `GET /api/purchases` - Get previous purchases
- `POST /api/purchases` - Checkout cart items

### Chatbot
- `POST /api/chatbot` - Chatbot query and response


## Data Handling

- User & product data stored in MongoDB Atlas.

- Listings managed via secure CRUD APIs.

- Chatbot uses AI APIs for guidance and product discovery.


##  Contributing
- Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to your branch (`git push origin feature-name`)
5. Open a Pull Request
