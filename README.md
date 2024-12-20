# Maa Kali Griha Udyog E-commerce Website

This is the repository for Maa Kali Griha Udyog's e-commerce website, built using **Next.js** as the frontend framework, with **PostgreSQL** as the database, **Tailwind CSS** for styling, and **Framer Motion** for animations. The website supports online payments through **PhonePe** and media uploads via **Cloudinary**.

![image](https://github.com/user-attachments/assets/3570874a-744a-4c09-9e08-730c388e2f60)


## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **File Storage**: [Cloudinary](https://cloudinary.com/)
- **Payments**: [PhonePe](https://Phonepe.com/)

## Getting Started

To get a local copy of this project running on your machine, follow the installation steps below.

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/en/) (version 14.x or later)
- [PostgreSQL](https://www.postgresql.org/) (version 12.x or later)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/maa-kali-griha-udyog.git
   cd maa-kali-griha-udyog
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up the database:**

   Ensure PostgreSQL is installed and running. Create a new database for the project and update the `.env` file with your database credentials.

4. **Set up environment variables:**

   Create a `.env.local` file in the root of the project, by copying the .env.example file and fill all the details


### Running Migrations

If there are any database migrations, you can apply them by running:

```bash
npx prisma migrate dev
```

### Running the Project

To start the development server:

```bash
npm run dev
```

The application will be running at `http://localhost:3000`.


### Deployment

For production deployment, the recommended platforms include:

- [Vercel](https://vercel.com/) (for the frontend and Next.js server)
- [Neon Tech](https://neon.tech/) (for PostgreSQL database)

Update the production environment variables according to your deployment setup.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m "Add new feature"`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.
