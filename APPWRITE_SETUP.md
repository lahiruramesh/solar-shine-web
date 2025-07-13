# Appwrite Setup Guide for Solar Shine Web

This guide will help you set up Appwrite backend for your Solar Shine Web admin panel.

## Step 1: Create Appwrite Project

1. Go to [Appwrite Cloud](https://cloud.appwrite.io) or your self-hosted Appwrite instance
2. Create a new project
3. Note down your Project ID

## Step 2: Create Database

1. Go to Databases in your Appwrite console
2. Create a new database called "main"
3. Note down your Database ID

## Step 3: Create Storage Bucket

1. Go to Storage in your Appwrite console
2. Create a new bucket called "media"
3. Set appropriate permissions for file uploads
4. Note down your Bucket ID

## Step 4: Create Collections

Create the following collections with their respective attributes:

### 1. Global Settings (global_settings)
- siteName (String, 255, required)
- logo (String, 500, optional)
- primaryColor (String, 10, optional)
- secondaryColor (String, 10, optional)
- contactEmail (Email, optional)
- contactPhone (String, 20, optional)

### 2. Hero Section (hero_section)
- title (String, 255, required)
- subtitle (String, 500, optional)
- backgroundImage (String, 500, optional)
- ctaText (String, 100, optional)
- ctaLink (String, 255, optional)

### 3. Service Cards (service_cards)
- title (String, 255, required)
- description (String, 1000, optional)
- icon (String, 500, optional)

### 4. Specialized Areas (specialized_areas)
- title (String, 255, required)
- description (String, 1000, optional)
- image (String, 500, optional)

### 5. Projects (projects)
- title (String, 255, required)
- category (Enum: ["Residential", "Commercial", "Industrial"], required)
- description (String, 2000, optional)
- image (String, 500, optional)
- client (String, 255, optional)
- completionDate (DateTime, optional)

### 6. Testimonials (testimonials)
- text (String, 1000, required)
- author (String, 255, required)
- position (String, 255, optional)

### 7. Blog Posts (blog_posts)
- title (String, 255, required)
- excerpt (String, 500, optional)
- content (String, 10000, optional)
- author (String, 255, optional)
- publishDate (DateTime, optional)
- featured_image (String, 500, optional)
- slug (String, 255, required)

### 8. Navigation Items (navigation_items)
- title (String, 255, required)
- path (String, 255, required)
- order (Integer, required)

### 9. Social Links (social_links)
- name (String, 100, required)
- icon (String, 100, required)
- url (URL, required)

### 10. Footer Links (footer_links)
- name (String, 255, required)
- url (String, 255, required)
- category (String, 100, required)

### 11. Company Info (company_info)
- name (String, 255, required)
- description (String, 1000, required)
- address (String, 500, required)
- email (Email, required)
- phone (String, 20, required)

### 12. About Content (about_content)
- title (String, 255, required)
- subtitle (String, 500, required)
- content (String, 5000, required)
- mainImage (String, 500, optional)
- missionTitle (String, 255, required)
- missionDescription (String, 1000, required)
- visionTitle (String, 255, required)
- visionDescription (String, 1000, required)
- imageOne (String, 500, optional)
- imageTwo (String, 500, optional)

### 13. Appointments (appointments)
- customerName (String, 255, required)
- customerEmail (Email, required)
- customerPhone (String, 20, required)
- serviceType (String, 255, required)
- preferredDate (DateTime, required)
- message (String, 1000, optional)
- status (Enum: ["pending", "confirmed", "completed", "cancelled"], required)

### 14. SEO Settings (seo_settings)
- page (String, 100, required)
- title (String, 255, required)
- description (String, 500, required)
- keywords (String, 500, optional)
- ogImage (String, 500, optional)

## Step 5: Set Permissions

For each collection, set the following permissions:
- Read: Any
- Create: Users
- Update: Users
- Delete: Users

## Step 6: Environment Variables

Create a `.env` file in your project root with:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=your-database-id
VITE_APPWRITE_STORAGE_BUCKET_ID=your-bucket-id
```

Replace with your actual values from steps 1-3.

## Step 7: Authentication Setup

1. Go to Auth in your Appwrite console
2. Enable Email/Password authentication
3. Configure your authentication settings:
   - **Session Length**: Set to your preferred duration (e.g., 7 days)
   - **Password Policy**: Set minimum length (recommended: 8 characters)
   - **Personal Data**: Enable if you want to collect user names
   - **Email Verification**: Optional for admin accounts
4. Under Security settings:
   - Add your domain to **Platforms** (e.g., http://localhost:8081 for development)
   - Set **CORS** allowed origins if needed

## Step 8: Test the Setup

1. Run your development server: `pnpm dev`
2. Navigate to `/login` in your browser
3. Use the "Register" tab to create your first admin account
4. After registration, you'll be automatically logged in
5. Access the admin panel at `/admin`
6. Test creating and editing content in different sections

### First Time Setup
- The first user you create will be an admin by default
- You can create multiple admin accounts as needed
- All registered users currently have admin privileges (you can implement role management later)

## Step 9: Security Considerations

For production deployment:
- Use strong passwords for admin accounts
- Enable email verification for additional security
- Set up proper CORS origins for your production domain
- Consider implementing role-based access control
- Enable session security features in Appwrite
- Regular backup your database

## Notes

- Make sure to set appropriate security rules for production
- Consider implementing role-based access control for multiple admin users
- Regularly backup your database
- Monitor your storage usage and set appropriate limits
