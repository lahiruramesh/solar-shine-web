# Appwrite Collections Setup

This document provides instructions for setting up the required Appwrite collections for the Solar Shine Web CMS.

## Required Collections

You need to create the following collections in your Appwrite database (ID: `6873ba790033a7d5cfdb`):

### 1. Navigation Items Collection

**Collection ID:** `navigation_items`
**Collection Name:** `Navigation Items`

**Attributes:**
- `title` (String, 100 chars, Required)
- `path` (String, 255 chars, Required)
- `order` (Integer, Required)

**Permissions:**
- Read: Any
- Create: Users
- Update: Users
- Delete: Users

### 2. SEO Settings Collection

**Collection ID:** `seo_settings`
**Collection Name:** `SEO Settings`

**Attributes:**
- `site_title` (String, 255 chars, Required)
- `site_description` (String, 500 chars, Optional)
- `site_keywords` (String, 500 chars, Optional)
- `author` (String, 100 chars, Optional)
- `site_url` (String, 255 chars, Optional)
- `default_og_image` (String, 255 chars, Optional)
- `twitter_handle` (String, 100 chars, Optional)
- `facebook_app_id` (String, 100 chars, Optional)
- `google_analytics_id` (String, 100 chars, Optional)
- `google_search_console_id` (String, 255 chars, Optional)
- `robots_txt` (String, 1000 chars, Optional)
- `sitemap_url` (String, 255 chars, Optional)

**Permissions:**
- Read: Any
- Create: Users
- Update: Users
- Delete: Users

### 3. Page SEO Collection

**Collection ID:** `page_seo`
**Collection Name:** `Page SEO`

**Attributes:**
- `page_path` (String, 255 chars, Required)
- `page_title` (String, 255 chars, Required)
- `meta_description` (String, 500 chars, Optional)
- `meta_keywords` (String, 500 chars, Optional)
- `og_title` (String, 255 chars, Optional)
- `og_description` (String, 500 chars, Optional)
- `og_image` (String, 255 chars, Optional)
- `canonical_url` (String, 255 chars, Optional)

**Permissions:**
- Read: Any
- Create: Users
- Update: Users
- Delete: Users

### 4. Testimonials Collection

**Collection ID:** `testimonials`
**Collection Name:** `Testimonials`

**Attributes:**
- `text` (String, 1000 chars, Required)
- `author` (String, 100 chars, Required)
- `position` (String, 100 chars, Optional)
- `company` (String, 100 chars, Optional)
- `rating` (Integer, Optional, Min: 1, Max: 5)

**Permissions:**
- Read: Any
- Create: Users
- Update: Users
- Delete: Users

### 5. Specialized Areas Collection

**Collection ID:** `specialized_areas`
**Collection Name:** `Specialized Areas`

**Attributes:**
- `title` (String, 100 chars, Required)
- `description` (String, 1000 chars, Optional)
- `image` (String, 255 chars, Optional)
- `order` (Integer, Optional)

**Permissions:**
- Read: Any
- Create: Users
- Update: Users
- Delete: Users

## Setup Instructions

1. Open your Appwrite Console
2. Navigate to your project: Solar Shine Database (ID: 6873ba790033a7d5cfdb)
3. Go to Databases → Your Database
4. For each collection above:
   - Click "Create Collection"
   - Enter the Collection ID and Name
   - Set the permissions as specified
   - Add each attribute with the specified type, size, and requirements
   - Save the collection

## Sample Data

After creating the collections, you can add sample data:

### Navigation Items
```json
[
  {"title": "Home", "path": "/", "order": 1},
  {"title": "Services", "path": "/services", "order": 2},
  {"title": "Projects", "path": "/projects", "order": 3},
  {"title": "About", "path": "/who-we-are", "order": 4},
  {"title": "Contact", "path": "/contact", "order": 5}
]
```

### SEO Settings
```json
{
  "site_title": "Solar Shine - Professional Solar Panel Installation",
  "site_description": "Expert solar panel installation and maintenance services. Transform your home with clean, renewable energy solutions.",
  "site_keywords": "solar panels, renewable energy, solar installation, clean energy, solar maintenance",
  "author": "Solar Shine Team",
  "site_url": "https://solarshine.com",
  "twitter_handle": "@solarshine",
  "robots_txt": "User-agent: *\nAllow: /",
  "sitemap_url": "/sitemap.xml"
}
```

### Page SEO
```json
[
  {
    "page_path": "/",
    "page_title": "Solar Shine - Professional Solar Panel Installation",
    "meta_description": "Transform your home with clean, renewable energy solutions. Expert solar panel installation and maintenance services.",
    "meta_keywords": "solar panels, home solar, renewable energy",
    "og_title": "Solar Shine - Professional Solar Panel Installation",
    "og_description": "Transform your home with clean, renewable energy solutions.",
    "canonical_url": "https://solarshine.com/"
  },
  {
    "page_path": "/services",
    "page_title": "Our Solar Services - Solar Shine",
    "meta_description": "Comprehensive solar panel services including installation, maintenance, and consultation.",
    "meta_keywords": "solar services, solar installation, solar maintenance",
    "og_title": "Our Solar Services - Solar Shine",
    "og_description": "Comprehensive solar panel services including installation, maintenance, and consultation.",
    "canonical_url": "https://solarshine.com/services"
  }
]
```
