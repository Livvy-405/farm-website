# 🌿 Green Hollow Farm — Backend API

Node.js · Express · MongoDB · Nodemailer

---

## Quick Start

### 1. Install dependencies
```bash
cd green-hollow-backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Open `.env` and fill in your values (MongoDB URI, email credentials, etc).

### 3. Start MongoDB
- **Local:** make sure `mongod` is running (`brew services start mongodb-community` on Mac)
- **Atlas:** paste your connection string into `MONGODB_URI` in `.env`

### 4. Seed the database
```bash
npm run seed
```
This loads all 8 products and 2 sample orders from your original frontend data.

### 5. Start the server
```bash
npm run dev   # development (auto-restarts with nodemon)
npm start     # production
```

Server runs on **http://localhost:5000**

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | — | Login with admin password → returns JWT |
| GET | `/api/auth/verify` | Bearer | Check if token is valid |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | — | List all products (supports `?category=`, `?inStock=true`, `?search=`) |
| GET | `/api/products/categories` | — | List unique category names |
| GET | `/api/products/:id` | — | Get single product |
| POST | `/api/products` | ✅ Admin | Create product |
| PUT | `/api/products/:id` | ✅ Admin | Update product |
| PATCH | `/api/products/:id/stock` | ✅ Admin | Toggle stock status |
| DELETE | `/api/products/:id` | ✅ Admin | Delete product |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | — | Place order (triggers confirmation emails) |
| GET | `/api/orders` | ✅ Admin | List orders (`?status=Pending`, `?page=1`, `?limit=50`) |
| GET | `/api/orders/stats` | ✅ Admin | Dashboard stats (totals, revenue) |
| GET | `/api/orders/:id` | ✅ Admin | Get single order |
| PATCH | `/api/orders/:id/status` | ✅ Admin | Mark Pending → Fulfilled (triggers fulfilment email) |
| DELETE | `/api/orders/:id` | ✅ Admin | Delete order |

---

## Email Notifications

Three emails are sent automatically:

| Trigger | Recipient | Email |
|---------|-----------|-------|
| New order placed | Customer | Order confirmation with itemised receipt |
| New order placed | Admin | New order alert with customer details |
| Order marked Fulfilled | Customer | Fulfilment / dispatch notification |

### Gmail setup
1. Enable 2-factor authentication on your Google account
2. Go to **Google Account → Security → App Passwords**
3. Create an app password for "Mail"
4. Paste it into `EMAIL_PASS` in your `.env`

Other providers (SendGrid, Mailgun, AWS SES) work the same — just change `EMAIL_HOST`, `EMAIL_PORT`, and credentials.

---

## Connecting the Frontend

### 1. Add the API URL to your React project
In your Vite project root create `.env.local`:
```
VITE_API_URL=http://localhost:5000/api
```

### 2. Copy the API service
Copy `frontend-api.ts` from this folder into `src/lib/api.ts` in your React project.

### 3. Update `useStore.ts`

**Products** — replace local array mutations with API calls:
```ts
// Instead of: addProduct: (product) => set(...)
addProduct: async (product) => {
  const saved = await productsAPI.create(product);
  set((state) => ({ products: [...state.products, { ...saved, id: saved._id }] }));
},
```

**Checkout** — call the API when placing an order:
```ts
// In Checkout.tsx handleSubmit:
const order = await ordersAPI.create({
  customerName: form.name,
  email: form.email,
  phone: form.phone,
  address: form.address,
  items: cart.map((i) => ({
    product: { id: i.product.id, name: i.product.name, price: i.product.price,
               image: i.product.image, category: i.product.category },
    quantity: i.quantity,
  })),
  total,
});
```

**Dashboard login** — swap the hardcoded password check:
```ts
// In DashboardLogin.tsx handleSubmit:
const { token } = await authAPI.login(password);
setToken(token);
onLogin();
```

---

## Deployment

### Backend (Render / Railway / Fly.io)
1. Push this folder to a GitHub repo
2. Connect to Render → New Web Service
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all `.env` variables in the dashboard

### Database (MongoDB Atlas — free tier)
1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Add a database user and whitelist `0.0.0.0/0`
3. Copy the connection string into `MONGODB_URI`

### Update CORS
Change `CLIENT_URL` in your production `.env` to your deployed frontend URL.
