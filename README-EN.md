# 🏭 Return Management System

A comprehensive return and inventory management platform for Turkish sellers using a Bulgaria-based return address.

## 🌟 Features

- **Multi-seller System**: Each seller manages their own products
- **Return Tracking**: Complete return workflow management
- **Inventory Management**: Track products by location and condition
- **Shipment Planning**: Create and track shipments back to sellers
- **Dashboard & Analytics**: Real-time statistics and insights
- **Role-Based Access**: Admin and Seller roles with different permissions

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- PostgreSQL
- JWT Authentication
- bcrypt for password hashing

### Frontend
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Axios for API calls

## 📋 Prerequisites

- Node.js v18 or higher
- PostgreSQL v14 or higher
- npm or yarn

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/return-management-system.git
cd return-management-system
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run db:setup
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

**Default Admin Login:**
- Email: `admin@iadeyonetim.com`
- Password: `Admin123!`

⚠️ **Change the admin password immediately after first login!**

## 📁 Project Structure

```
├── backend/           # Node.js API
│   ├── config/        # Database configuration
│   ├── controllers/   # Business logic
│   ├── middleware/    # Auth middleware
│   ├── routes/        # API routes
│   └── scripts/       # Database setup scripts
│
├── frontend/          # Next.js application
│   └── src/
│       ├── app/       # Pages (App Router)
│       ├── lib/       # API services
│       └── styles/    # CSS files
│
└── docs/              # Documentation
```

## 🔐 Security

- JWT-based authentication
- Bcrypt password hashing
- Role-based access control
- SQL injection protection
- CORS configuration

## 📖 Documentation

- [Quick Start Guide](./HIZLI-BASLANGIC.md) (Turkish)
- [Project Structure](./PROJE-YAPISI.md) (Turkish)
- [Installation Checklist](./KONTROL-LISTESI.md) (Turkish)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - feel free to use this project for any purpose.

## 🐛 Bug Reports

Please use the [Issues](https://github.com/YOUR-USERNAME/return-management-system/issues) page to report bugs.

## 🌐 Language

- Interface: Turkish
- Code & Comments: English
- Documentation: Both Turkish and English

---

**Note:** This is a local development setup. For production deployment:
- Change all secrets and passwords
- Enable HTTPS
- Add rate limiting
- Implement proper logging
- Set up database backups
