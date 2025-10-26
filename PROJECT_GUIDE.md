# BeautyHub E-Commerce Website - College Project Guide

## Project Overview

A complete e-commerce beauty website built with **Next.js 15**, **React**, **TypeScript**, and **Shadcn/UI** components. This project includes authentication, product management, shopping cart, checkout with mock payment, and a full admin panel.

## Project Structure

```
src/
├── app/                          # Next.js 15 App Router pages
│   ├── page.tsx                 # Homepage
│   ├── about/page.tsx           # About Us page
│   ├── services/page.tsx        # Services page
│   ├── contact/page.tsx         # Contact Us page
│   ├── products/
│   │   ├── page.tsx            # Products listing
│   │   └── [id]/page.tsx       # Product detail page
│   ├── cart/page.tsx           # Shopping cart
│   ├── checkout/page.tsx       # Checkout with payment
│   ├── auth/
│   │   ├── login/page.tsx      # Login page
│   │   └── signup/page.tsx     # Signup page
│   └── admin/page.tsx          # Admin dashboard
├── components/
│   ├── Navigation.tsx          # Header navigation
│   ├── Footer.tsx              # Footer component
│   ├── ProductCard.tsx         # Product card component
│   ├── Providers.tsx           # Context providers wrapper
│   └── ui/                     # Shadcn/UI components
├── contexts/
│   ├── AuthContext.tsx         # Authentication context
│   └── CartContext.tsx         # Shopping cart context
└── data/
    └── products.ts             # Mock product data
```

##  Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

##  Login Credentials

### Admin Account
- **Email:** admin@beauty.com
- **Password:** admin123

### Regular User
- Create a new account via the signup page
- Or use any test account you create

##  Test Payment Information

The checkout uses **mock payment** (no real transactions):

- **Card Number:** 4242 4242 4242 4242
- **Expiry Date:** Any future date (e.g., 12/25)
- **CVV:** Any 3 digits (e.g., 123)
- **Name:** Any name

##  Key Features

### 1. **Authentication System** 
- User registration and login
- Mock authentication using localStorage
- Protected admin routes
- Session persistence

### 2. **Homepage** 
- Hero section with call-to-action
- Featured products showcase
- Service highlights
- Responsive design

### 3. **Product Management** 
- Browse all products
- Filter by category (Skincare, Makeup, etc.)
- Sort by price, name, or featured
- Detailed product pages
- Add to cart functionality

### 4. **Shopping Cart** 
- Add/remove products
- Update quantities
- Real-time price calculations
- Free shipping over $50
- Persistent cart using localStorage

### 5. **Checkout & Payment** 
- Shipping information form
- Mock payment integration
- Order summary
- Order confirmation
- Test mode with demo card numbers

### 6. **Admin Panel** 
- Dashboard with statistics
- Add new products with image URLs
- Edit existing products
- Delete products
- View all orders
- Product stock management
- Featured product toggle

### 7. **Additional Pages** 
- About Us - Company story and team
- Services - Available services
- Contact Us - Contact form and information

##  Design Features

- **Responsive Design** - Works on mobile, tablet, and desktop
- **Dark Mode Support** - Automatic theme switching
- **Modern UI** - Using Shadcn/UI components
- **Smooth Animations** - Hover effects and transitions
- **Clean Layout** - Professional and polished

##  Data Persistence

The application uses **localStorage** to persist:
- User accounts
- Authentication session
- Shopping cart items
- Products list
- Customer orders

**Note:** Data is stored in the browser and will be cleared if you clear browser data.

##  How to Use Admin Panel

1. **Login as Admin**
   - Go to `/auth/login`
   - Use admin credentials (admin@beauty.com / admin123)

2. **Add Products**
   - Click "Add Product" button
   - Fill in product details
   - Use Unsplash URLs for images (e.g., `https://images.unsplash.com/photo-xxx`)
   - Toggle "In Stock" and "Featured" options
   - Submit the form

3. **Edit Products**
   - Click the edit icon on any product
   - Update details
   - Save changes

4. **Delete Products**
   - Click the delete icon
   - Confirm deletion

5. **View Orders**
   - Switch to "Orders" tab
   - See all customer orders with details

##  Getting Product Images

Use **Unsplash** for free, high-quality images:
1. Go to [unsplash.com](https://unsplash.com)
2. Search for beauty products
3. Right-click on an image → "Copy image address"
4. Paste URL in the admin form

Example Unsplash URLs:
- `https://images.unsplash.com/photo-1620916566398-39f1143ab7be`
- `https://images.unsplash.com/photo-1586495777744-4413f21062fa`

##  Technologies Used

- **Next.js 15** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/UI** - Component library
- **Lucide Icons** - Icon library
- **localStorage** - Data persistence

##  Project Highlights for Presentation

1. **Full-Stack Simulation** - Frontend with mock backend using localStorage
2. **Modern Tech Stack** - Latest Next.js and React features
3. **Complete E-Commerce Flow** - Browse → Cart → Checkout → Order
4. **Admin Dashboard** - Full CRUD operations for products
5. **Authentication** - User login/signup system
6. **Responsive Design** - Mobile-first approach
7. **Professional UI** - Clean, modern design
8. **Multiple Pages** - 10+ different pages and routes

##  Key Learning Outcomes

- React Context API for state management
- Next.js App Router and file-based routing
- Component composition and reusability
- Form handling and validation
- Conditional rendering
- Client vs Server components
- TypeScript interfaces and types
- LocalStorage for data persistence
- Responsive design with Tailwind CSS

##  Folder Organization Benefits

- **Separation of Concerns** - Each component has its own file
- **Reusable Components** - Components can be imported anywhere
- **Context Providers** - Centralized state management
- **Type Safety** - TypeScript interfaces for data structures
- **Clean Code** - Well-organized and maintainable

##  Deployment (Optional)

Deploy to **Vercel** for free:
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy with one click

##  Important Notes

- This is a **mock e-commerce site** - no real payments
- Data is stored in **browser localStorage** only
- Use **test payment details** provided above
- Admin credentials are **hardcoded** for demo purposes
- All images should use **Unsplash URLs**

##  For Your College Presentation

### Demo Flow:
1. Show the homepage and explain features
2. Browse products and filter/sort
3. Add items to cart
4. Complete checkout process
5. Login as admin
6. Demonstrate adding/editing products
7. Show order management

### Technical Points to Highlight:
- Next.js 15 App Router architecture
- React Context for global state
- Component-based design
- TypeScript for type safety
- Responsive design principles
- Mock authentication implementation
- LocalStorage data persistence

##  Support

For any questions about this project:
- Review the code comments
- Check component structure
- Test all features thoroughly
- Practice the demo flow before presentation

---

**Built with for college project submission**

Good luck with your presentation! 
