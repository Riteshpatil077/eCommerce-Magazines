# 📚 Pressly - Digital Magazine Subscriptions Platform

![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Welcome to **Pressly**, a modern, premium e-commerce platform exclusively designed for digital magazine subscriptions. Built with the latest tech stack including Next.js 15, React server components, and Prisma ORM, Pressly offers a flawless user experience with a sleek, aesthetic UI and interactive high-resolution PDF flipbooks.

## 👨‍💻 Developer Information

- **Developer Name:** Ritesh Patil
- **GitHub:** [@Riteshpatil077](https://github.com/Riteshpatil077)
- **Email:** patilritesh7172@gmail.com

## 🌟 Key Features

*   **� Interactive PDF Flipbook:** A dynamic, high-resolution custom magazine reader built with `react-pageflip` and `react-pdf` for ultra-realistic reading experiences.
*   **�🔒 Secure Authentication:** Robust JWT-based authentication system with secure password hashing using bcrypt, featuring a complete OTP-based password recovery flow via direct email.
*   **👥 Role-Based Access Control:** Strict routing segregation between `ADMIN` and `USER` partitions.
*   **🛒 Seamless E-commerce Flow:** Browse magazines, view metadata, adjust quantities, manage carts, and checkout seamlessly.
*   **🛡️ Robust Transactions:** Purchasing subscriptions utilizes entirely atomic Prisma transactions, guaranteeing rollback safety and preventing desynchronized reads.
*   **📦 Stock Management:** Real-time stock tracking and inventory locks to prevent overselling digital or print copies.
*   **📊 Dynamic Dashboards:** 
    *   **Admin Portal:** Unified interface to fully CRUD magazines, monitor orders, and manage users.
    *   **User Hub:** Personalized shelf for subscribers to track orders and launch interactive readings.
*   **💅 Premium UI/UX:** A stunning, responsive dark-mode architecture built with Tailwind CSS, leveraging extreme glassmorphism, micro-interactions, and meticulously tailored spacing.

## 🛠️ Tech Stack

*   **Framework:** Next.js 15 (App Router / Server Actions)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Database:** PostgreSQL
*   **ORM:** Prisma
*   **Authentication:** Custom JWT Authorization
*   **Email Services:** NodeMailer
*   **Icons:** Lucide React

## 🚀 Getting Started

Follow these steps to run Pressly locally on your machine:

### 1. Clone the repository

```bash
git clone https://github.com/Riteshpatil077/eCommerce-Magazines.git
cd eCommerce-Magazines
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory and configure the following variables appropriately:

```env
# Database connection string
DATABASE_URL="postgresql://user:password@localhost:5432/pressly"

# JWT Secret for authentication
JWT_SECRET="your_super_secret_jwt_key_here"

# SMTP Settings for Nodemailer
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### 4. Setup the Database

Generate the Prisma client and push your schema synchronizations:

```bash
npx prisma generate
npx prisma db push
```

### 5. Run the server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience the application.

## 📖 Architecture & Design

Pressly adheres to modern full-stack best practices:

*   **Server Actions:** Maximizes Next.js Server Actions for heavily secure, Javascript-less capable data mutations.
*   **Security First:** Direct database mutations are gated behind rigid Server Action authorization checks validating encrypted cookies.
*   **Responsive UI:** A beautifully dense interface that aggressively targets all screen sizes from ultra-wide 4K to mobile.

## 🤝 Contributing & License

Contributions, issues, and feature requests are welcome!

Designed and Constructed by **Ritesh Patil**.