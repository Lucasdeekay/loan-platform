# LoanPlatform - Next.js Loan Request Platform

A comprehensive loan request platform built with Next.js, TypeScript, Prisma, and Paystack integration. Users can apply for loans through a multi-step verification process and manage repayments through their dashboard.

## 🚀 Features

### Core Features

- **Multi-Step Loan Application**: 5-step wizard with progress tracking
  - Step 1: Personal Information
  - Step 2: Identity Verification (BVN, NIN, Camera/Photo Upload)
  - Step 3: Guarantor Information
  - Step 4: Bank Details
  - Step 5: Review & Submit

- **User Dashboard**: View loan status, repayment details, and wallet balance
- **Paystack Integration**:
  - Dedicated Virtual Accounts for each user
  - Secure payment processing
  - Webhook handling for real-time updates
- **Admin Dashboard**: Approve/reject loans and manage applications
- **Resumable Applications**: Save progress and continue later
- **Authentication**: Secure JWT-based authentication with HTTP-only cookies

### Technical Features

- **Next.js 14 App Router**: Server and client components
- **TypeScript**: Full type safety
- **Prisma ORM**: Type-safe database operations
- **Tailwind CSS**: Modern, responsive design
- **React Hook Form + Zod**: Form validation
- **SQLite (Dev) / PostgreSQL (Prod)**: Flexible database options

## 📋 Prerequisites

- Node.js 18+ and npm
- Paystack Account ([Sign up here](https://paystack.com))

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd loan-platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your values:

```bash
DATABASE_URL="file:./dev.db"
PAYSTACK_SECRET_KEY="sk_test_your_secret_key"
PAYSTACK_PUBLIC_KEY="pk_test_your_public_key"
JWT_SECRET="your-secure-random-string"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 4. Initialize the database

```bash
npx prisma generate
npx prisma db push
```

### 5. Run the development server

```bash
npm run dev

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structureloan-platform/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── loan/          # Loan application endpoints
│   │   │   ├── paystack/      # Paystack integration
│   │   │   ├── admin/         # Admin endpoints
│   │   │   └── user/          # User management
│   │   ├── admin/             # Admin dashboard
│   │   ├── apply/             # Loan application page
│   │   ├── dashboard/         # User dashboard
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── landing/           # Landing page components
│   │   ├── forms/             # Multi-step form components
│   │   └── dashboard/         # Dashboard components
│   └── lib/
│       ├── db.ts              # Prisma client
│       ├── auth.ts            # Authentication utilities
│       └── paystack.ts        # Paystack integration
├── .env.example               # Environment variables template
├── package.json
└── README.md
```

## 🔐 Authentication

The platform uses JWT tokens stored in HTTP-only cookies for secure authentication.

### User Roles

- **USER**: Can apply for loans and manage repayments
- **ADMIN**: Can approve/reject loans and view all applications

### Creating an Admin User

After registration, manually update the user role in the database:

```bash
npx prisma studio
```

Navigate to the `User` table and change the `role` field to `"ADMIN"`.

## 💳 Paystack Integration

### Setup Paystack

1. Create a [Paystack account](https://dashboard.paystack.com/signup)
2. Get your API keys from Settings > API Keys & Webhooks
3. Add keys to `.env` file

### Webhook Configuration

For local development, use a tool like [ngrok](https://ngrok.com/):

```bash
ngrok http 3000
```

Add the webhook URL in your Paystack dashboard:<https://your-ngrok-url.ngrok.io/api/paystack/webhook>

### Virtual Accounts

Users automatically get a Paystack Dedicated Virtual Account upon registration. Funds transferred to this account are tracked in real-time via webhooks.

## 📊 Database Schema

### Main Models

- **User**: User accounts and personal information
- **Loan**: Loan applications with status tracking
- **IdentityVerification**: BVN, NIN, and photo verification
- **Guarantor**: Guarantor information
- **BankDetails**: User bank account details
- **Wallet**: Paystack virtual account and balance
- **Transaction**: Payment transactions
- **Repayment**: Loan repayment records

## 🚢 Deployment

### Database Migration (Production)

1. Update `DATABASE_URL` in `.env` to PostgreSQL connection string
2. Run migrations:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Environment Variables

Ensure all production environment variables are set:

- Use production Paystack keys
- Generate a secure `JWT_SECRET`
- Update `NEXT_PUBLIC_BASE_URL` to your domain
- Configure webhook URL in Paystack dashboard

### Build and Deploy

```bash
npm run build
npm start
```

### Recommended Platforms

- **Vercel**: Automatic deployments from Git
- **Railway**: Easy PostgreSQL setup
- **Render**: Full-stack deployment

## 🧪 Testing

### Test User Flow

1. Register a new account
2. Complete the 5-step loan application
3. Admin approves the loan
4. User receives virtual account details
5. User makes repayment via Paystack

### Test Paystack Integration

Use Paystack test cards for testing payments:

- **Successful payment**: 4084084084084081
- **Declined payment**: 5061020000000000

## 📝 API Documentation

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Loan Application

- `POST /api/loan/personal-info` - Save personal info (Step 1)
- `POST /api/loan/identity-verification` - Save identity (Step 2)
- `POST /api/loan/guarantor-info` - Save guarantor (Step 3)
- `POST /api/loan/bank-details` - Save bank details (Step 4)
- `GET /api/loan/review` - Get application data for review

### Paystack

- `POST /api/paystack/create-wallet` - Create virtual account
- `POST /api/paystack/repay` - Initialize repayment
- `POST /api/paystack/webhook` - Handle Paystack webhooks

### Admin

- `POST /api/admin/loans` - Approve/reject loans
- `GET /api/admin/loans` - Get loan details

## 🎨 Customization

### Styling

All styles use Tailwind CSS. Customize colors in `tailwind.config.ts`:

```typescript
colors: {
primary: { /* your colors / },
secondary: { / your colors */ },
}
```

### Interest Rate

Update the interest rate in `/src/app/api/loan/personal-info/route.ts`:

```typescript
const interestRate = 5.0 // Change to your rate
```

### Repayment Period

Update the due date calculation in `/src/app/api/admin/loans/route.ts`:

```typescript
dueDate.setDate(dueDate.getDate() + 30) // Change days
```

## 🐛 Troubleshooting

### Prisma Issues

```bash
# Regenerate Prisma client
npx prisma generate
# Reset database (⚠️ deletes all data)
npx prisma db push --force-reset
```

### Paystack Webhook Not Working

- Verify webhook URL is correct
- Check webhook signature validation
- Use ngrok for local testing
- Check Paystack dashboard logs

### Authentication Issues

- Clear browser cookies
- Verify JWT_SECRET is set
- Check token expiration (default: 7 days)

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ using Next.js, TypeScript, Prisma, and Paystack**
