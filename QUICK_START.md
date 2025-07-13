# 🚀 Quick Start Guide - Solar Shine Web Admin

This guide will get you up and running with the admin panel in just a few minutes!

## ⚡ Prerequisites
- Node.js 18+
- pnpm package manager
- An Appwrite account (free at [cloud.appwrite.io](https://cloud.appwrite.io))

## 🔧 Setup Steps

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Set Up Appwrite (5 minutes)

#### Create Project
1. Go to [Appwrite Cloud](https://cloud.appwrite.io)
2. Create a new project
3. Copy your Project ID

#### Create Database
1. Go to **Databases** → Create database named "main"
2. Copy your Database ID

#### Create Storage
1. Go to **Storage** → Create bucket named "media"  
2. Copy your Bucket ID

#### Enable Authentication
1. Go to **Auth** → Enable Email/Password
2. Add `http://localhost:8081` to Platforms

### 3. Configure Environment
```bash
cp .env.example .env
```

Update `.env` with your Appwrite credentials:
```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id-here
VITE_APPWRITE_DATABASE_ID=your-database-id-here
VITE_APPWRITE_STORAGE_BUCKET_ID=your-bucket-id-here
```

### 4. Create Collections (Automatic)
After setting up your `.env` file, you can automatically create all required collections:

```bash
pnpm setup-db
```

This will create all necessary collections with proper attributes and permissions.

**Manual Setup**: If you prefer manual setup, detailed collection schemas are in `APPWRITE_SETUP.md`

### 5. Start Development
```bash
pnpm dev
```

Visit http://localhost:8081

### 6. Create Admin Account
1. Go to `/login`
2. Click **Register** tab
3. Create your admin account
4. You'll be redirected to `/admin`

## 🎉 You're Ready!

### What You Can Do Now:
- ✅ **Dashboard**: View metrics and activity
- ✅ **Hero Section**: Edit homepage banner
- ✅ **Services**: Add service offerings  
- ✅ **Projects**: Manage portfolio
- ✅ **Blog**: Create and publish posts
- ✅ **File Uploads**: Images for content

### Next Steps:
1. Add your first hero section content
2. Create some service cards
3. Add a few projects to your portfolio
4. Write your first blog post

## 🔧 Need More Detail?
- **Full Setup Guide**: `APPWRITE_SETUP.md`
- **Admin Documentation**: `ADMIN_README.md`
- **Troubleshooting**: Check the terminal for errors

## 🆘 Common Issues

**"Appwrite endpoint not defined"**: Update your `.env` file
**"Collection not found"**: Create the collections in Appwrite console
**"Permission denied"**: Check collection permissions in Appwrite
**"Cannot connect"**: Verify your Appwrite credentials

## 📞 Support
If you get stuck, check:
1. Terminal output for error messages
2. Appwrite console for configuration issues
3. Documentation files for detailed instructions

Happy building! 🎉
