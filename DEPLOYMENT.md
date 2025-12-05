# 🚀 Deployment Guide

This guide covers multiple deployment options for the Campus Event & Find Hub application.

---

## Option 1: Deploy to Render (Recommended - Free)

### Steps:

1. **Prepare Your Code**
   - Ensure your code is pushed to GitHub
   - Make sure `.gitignore` excludes `node_modules`, `db.sqlite`, and `.env`

2. **Sign Up on Render**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

3. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: campus-event-hub
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

4. **Add Environment Variables**
   In Render dashboard, add these:
   ```
   JWT_SECRET=your_super_secret_jwt_key_change_this
   ADMIN_EMAIL=kshitiz.mandola.cseds.2024@miet.ac.in
   ADMIN_PASSWORD=12345678
   PORT=4000
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Your app will be live at: `https://campus-event-hub.onrender.com`

6. **Update Frontend API URL**
   - After deployment, update `public/app.js`:
   ```javascript
   const API_URL = 'https://campus-event-hub.onrender.com/api';
   ```
   - Push changes to GitHub
   - Render will auto-deploy

---

## Option 2: Deploy to Railway (Recommended - Easy)

### Steps:

1. **Sign Up on Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add Environment Variables**
   - Go to Variables tab
   - Add the same env vars as above

4. **Generate Domain**
   - Go to Settings → Generate Domain
   - Copy the URL (e.g., `campus-hub.up.railway.app`)

5. **Update Frontend**
   - Update API_URL in `public/app.js`
   - Push to GitHub

---

## Option 3: Deploy to Vercel (Serverless)

### Steps:

1. **Install Vercel CLI**
   ```powershell
   npm install -g vercel
   ```

2. **Create `vercel.json`**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "server.js"
       }
     ]
   }
   ```

3. **Deploy**
   ```powershell
   vercel
   ```

4. **Add Environment Variables**
   ```powershell
   vercel env add JWT_SECRET
   vercel env add ADMIN_EMAIL
   vercel env add ADMIN_PASSWORD
   ```

5. **Deploy to Production**
   ```powershell
   vercel --prod
   ```

**Note:** Vercel's free tier has limitations with SQLite. Consider using a cloud database.

---

## Option 4: Deploy to Heroku

### Steps:

1. **Install Heroku CLI**
   - Download from [heroku.com/cli](https://devcenter.heroku.com/articles/heroku-cli)

2. **Login to Heroku**
   ```powershell
   heroku login
   ```

3. **Create App**
   ```powershell
   heroku create campus-event-hub
   ```

4. **Add Buildpack**
   ```powershell
   heroku buildpacks:set heroku/nodejs
   ```

5. **Set Environment Variables**
   ```powershell
   heroku config:set JWT_SECRET="your_secret_key"
   heroku config:set ADMIN_EMAIL="kshitiz.mandola.cseds.2024@miet.ac.in"
   heroku config:set ADMIN_PASSWORD="12345678"
   ```

6. **Deploy**
   ```powershell
   git push heroku main
   ```

7. **Open App**
   ```powershell
   heroku open
   ```

---

## Option 5: Deploy to VPS (DigitalOcean, AWS, etc.)

### Steps:

1. **Set Up VPS**
   - Create a Ubuntu droplet/instance
   - SSH into your server

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   ```

4. **Clone Your Repository**
   ```bash
   git clone https://github.com/yourusername/campus-hub.git
   cd campus-hub
   npm install
   ```

5. **Create `.env` File**
   ```bash
   nano .env
   # Add your environment variables
   ```

6. **Start with PM2**
   ```bash
   pm2 start server.js --name campus-hub
   pm2 startup
   pm2 save
   ```

7. **Set Up Nginx (Optional)**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/campus-hub
   ```

   Add:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:4000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/campus-hub /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Set Up SSL (Optional)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

---

## Important Notes

### 🗄️ Database Considerations

SQLite is file-based and has limitations on some platforms:
- **Works well on**: Render, Railway, VPS
- **Limited on**: Vercel, Netlify (serverless)

For production, consider migrating to:
- PostgreSQL (recommended for Heroku, Railway)
- MongoDB (cloud-based)
- MySQL

### 📁 File Uploads

The `uploads/` folder stores user-uploaded images:
- **VPS/Railway/Render**: Works fine
- **Vercel/Netlify**: Use cloud storage (AWS S3, Cloudinary)

### 🔒 Security Checklist

Before deploying:
- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Change default admin password
- [ ] Enable HTTPS
- [ ] Set up proper CORS origins
- [ ] Add rate limiting
- [ ] Use environment variables (never commit `.env`)

### 📧 Email Configuration

For production OTP emails, configure SMTP in `.env`:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

For Gmail, enable "Less secure app access" or use App Passwords.

---

## Quick Deploy Commands

### For Render/Railway (GitHub-based):
```powershell
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Connect repository on platform
# 3. Deploy automatically
```

### For Vercel:
```powershell
npm install -g vercel
vercel
```

### For Heroku:
```powershell
heroku create
git push heroku main
```

---

## Testing Your Deployment

After deployment, test:
1. ✅ Homepage loads
2. ✅ Admin login works
3. ✅ Student registration works
4. ✅ Event upload works (with images)
5. ✅ Lost/found item submission works
6. ✅ Database persists data

---

## Troubleshooting

### Port Issues
Make sure your server uses `process.env.PORT`:
```javascript
const PORT = Number(process.env.PORT || 4000);
```

### Database Not Persisting (Render/Railway)
Add a volume/disk in platform settings for SQLite persistence.

### CORS Errors
Update CORS in `server.js`:
```javascript
app.use(cors({
  origin: ['https://yourdomain.com'],
  credentials: true
}));
```

### File Upload Errors
Ensure uploads directory is writable or use cloud storage.

---

## Recommended: Render Deployment (Step-by-Step)

1. **Push to GitHub**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/campus-hub.git
   git push -u origin main
   ```

2. **Deploy on Render**
   - Visit [render.com](https://render.com)
   - New → Web Service
   - Connect GitHub repo
   - Set environment variables
   - Deploy!

3. **Your app is live!** 🎉

---

Need help? Check platform-specific documentation or reach out for support!
