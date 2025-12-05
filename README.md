# 🎓 Campus Event & Find Hub

A modern, full-stack web application for managing campus events and lost & found items. Built with Node.js, Express, SQLite, and vanilla JavaScript with a beautiful dark-themed UI.

## ✨ Features

### 👨‍💼 Admin Features
- Secure admin authentication
- Approve/reject student registrations
- Upload and manage campus events
- View all events and items

### 👨‍🎓 Student Features
- Student registration with admin approval
- View campus events
- Report lost items
- Report found items
- Browse lost & found items
- Secure authentication

### 🔐 Security Features
- JWT-based authentication
- Password hashing with bcrypt
- OTP-based password reset
- Role-based access control

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
The `.env` file is already set up with default values:
- Admin Email: `kshitiz.mandola.cseds.2024@miet.ac.in`
- Admin Password: `12345678`
- Port: `4000`

You can modify these in the `.env` file if needed.

### Step 3: Start the Server
```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

The application will be available at: **http://localhost:4000**

## 📁 Project Structure

```
anshi-project-2/
├── public/              # Frontend files
│   ├── index.html       # Main HTML file
│   └── app.js           # Frontend JavaScript
├── uploads/             # Uploaded images (auto-created)
├── server.js            # Backend server
├── db.sqlite            # SQLite database (auto-created)
├── .env                 # Environment variables
├── .gitignore           # Git ignore file
├── package.json         # Project dependencies
└── README.md            # This file
```

## 🎯 Usage

### Admin Login
1. Navigate to http://localhost:4000
2. Click on "Admin Login" tab
3. Use credentials:
   - Email: `kshitiz.mandola.cseds.2024@miet.ac.in`
   - Password: `12345678`

### Student Registration
1. Click "Register" button
2. Enter email and password
3. Wait for admin approval
4. Login after approval

### Upload Event (Admin Only)
1. Login as admin
2. Go to "Upload Event" tab
3. Fill in event details
4. Upload event photo (optional)
5. Submit

### Report Lost/Found Item (Students)
1. Login as student
2. Go to "Report Item" tab
3. Select item type (Lost/Found)
4. Fill in details
5. Upload photo (optional)
6. Submit

## 🔧 API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/student/login` - Student login
- `POST /api/student/register` - Student registration

### Admin
- `GET /api/admin/pending` - Get pending student approvals
- `POST /api/admin/approve` - Approve student

### Events
- `GET /api/events/all` - Get all events
- `POST /api/event/upload` - Upload event (admin only)

### Lost & Found
- `GET /api/items/all` - Get all items
- `POST /api/upload/lost` - Report lost item
- `POST /api/upload/found` - Report found item

### Password Reset
- `POST /api/forgot-password/send-otp` - Send OTP
- `POST /api/forgot-password/reset` - Reset password

## 🎨 Tech Stack

### Backend
- Node.js
- Express.js
- SQLite3
- JWT (jsonwebtoken)
- bcrypt
- multer (file uploads)
- nodemailer

### Frontend
- Vanilla JavaScript
- HTML5
- CSS3 (Modern Dark Theme)
- Font Awesome Icons
- Google Fonts (Inter)

## 🔒 Security Notes

1. Change the `JWT_SECRET` in `.env` for production
2. The OTP is currently logged to console (implement email sending for production)
3. Default admin credentials should be changed after first login
4. Use HTTPS in production

## 📝 Database Schema

### Users Table
- id (Primary Key)
- email (Unique)
- password (Hashed)
- role (admin/student)
- approved (0/1)
- created_at (Timestamp)

### Events Table
- id (Primary Key)
- title
- description
- photo (URL)
- posted_by (Email)
- created_at (Timestamp)

### Items Table
- id (Primary Key)
- type (lost/found)
- name
- description
- photo (URL)
- posted_by (Email)
- created_at (Timestamp)

### OTPs Table
- id (Primary Key)
- email
- otp
- expires_at (Timestamp)

## 🐛 Troubleshooting

### Port Already in Use
If port 4000 is already in use, change it in `.env`:
```
PORT=5000
```

### Database Issues
Delete `db.sqlite` file and restart the server to recreate the database.

### File Upload Issues
Ensure the `uploads` folder has write permissions.

## 📄 License

ISC License - Free to use and modify.

## 👨‍💻 Developer

Created for campus management needs.

---

**Need Help?** Check the console logs for detailed error messages and debugging information.
