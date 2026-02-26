# AR Surgical Hub — Frontend Features

Base URL (Dev): `http://localhost:5173`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + Vite 7 |
| Routing | React Router DOM v7 |
| HTTP Client | Axios |
| Icons | Lucide React |
| Styling | Vanilla CSS (custom theme) |
| State | React Context API |
| Tests | Vitest + React Testing Library |

---

## 📄 Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero section, featured categories, products, testimonials |
| `/shop` | Shop | Full product listing with category filter |
| `/product/:id` | Product Detail | Product info, reviews, add to cart/wishlist |
| `/categories` | Categories | Browse all product categories |
| `/cart` | Cart | Cart items, quantities, order summary |
| `/wishlist` | Wishlist | Saved products |
| `/checkout` | Checkout | Shipping address & payment form |
| `/quotes` | Quotes | Request a quote form |
| `/careers` | Careers | Open job vacancies |
| `/login` | Login / Register | Toggle between login and registration |
| `/admin/*` | Admin Panel | Protected — admin only |

---

## 🧩 Shared Components

### `Header`
- Top announcement bar with phone and email contact
- Logo with brand name
- Desktop navigation links (Home, Products, Categories, Careers, Get a Quote)
- Cart icon with live item count badge
- Wishlist heart icon
- Login/Register link (or Welcome + Logout when authenticated)
- Mobile hamburger drawer menu
- Mobile search bar toggle

### `Footer`
- Brand description and social links
- Quick links navigation
- Contact details

### `Layout`
- Wraps all public pages with `<Header>` and `<Footer>`

### `ProductCard`
- Product image (with placeholder fallback)
- Category badge overlay
- Quick View link → `/product/:id`
- Wishlist toggle button (fills heart when active)
- Product name, decorative 5-star rating, price
- "Add to Cart" button

---

## 🗃️ State Management (Context)

### `AuthContext`
| Feature | Details |
|---------|---------|
| `user` | Current logged-in user object (`{ id, role }`) |
| `token` | JWT token stored in `localStorage` |
| `login(email, password)` | POST `/api/users/login`, stores token |
| `register(userData)` | POST `/api/users/register` |
| `logout()` | Clears token and user from state + localStorage |
| Auto-restore | Decodes JWT from localStorage on page load |

### `CartContext`
| Feature | Details |
|---------|---------|
| `cart` | Array of cart items |
| `addToCart(product)` | Adds product; increments quantity if already in cart |
| `removeFromCart(id)` | Removes item entirely |
| `clearCart()` | Empties entire cart |
| `cartTotal` | Computed total price |
| `cartCount` | Total quantity of all items |

### `WishlistContext`
| Feature | Details |
|---------|---------|
| `wishlist` | Array of saved products |
| `toggleWishlist(product)` | Adds if not present, removes if present |
| `isInWishlist(id)` | Returns boolean |

---

## 🛡️ Admin Panel (`/admin/*`)

Access is guarded by `AdminRoute` — redirects non-admins to login.

| Admin Section | Features |
|---------------|---------|
| Dashboard | Stats: total products, users, orders, revenue |
| Products | List, Create, Edit, Delete products |
| Categories | List, Create, Edit, Delete categories |
| Orders | List all orders, Update order status |
| Users | View all registered users |

---

## 🔐 Auth Flow

1. User visits `/login`
2. Toggle between **Login** and **Register** forms
3. On login: JWT stored → user state set → redirect to `/`
4. On register: auto-switch to login form
5. Logout: clears localStorage + resets context
6. JWT decoded client-side to restore session on reload

---

## 🎨 Design System (`theme.css`)

- CSS custom properties for colors, spacing, and glass effects
- `.bg-glass` — frosted glass card style
- `.btn-primary` — primary action button
- `.container` — responsive max-width layout wrapper
- Responsive breakpoints for mobile/desktop

---

## 🧪 Tests

Run all 38 client tests:
```bash
npm test
```

Watch mode:
```bash
npm run test:watch
```

**Coverage:** CartContext, WishlistContext, AuthContext, ProductCard, Header, Cart page, Wishlist page, Login page.
