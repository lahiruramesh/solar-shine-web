# Specialized Areas Collection Setup

## Issue
The specialized areas function is not working because the collection might not exist in your Appwrite database.

## Solution
You need to create the `specialized_areas` collection in your Appwrite database.

## Step 1: Check if collection exists
1. Go to your Appwrite Console
2. Navigate to your project: Solar Shine Database (ID: 6873ba790033a7d5cfdb)
3. Go to Databases → Your Database
4. Look for a collection called "Specialized Areas" with ID `specialized_areas`

## Step 2: Create the collection (if it doesn't exist)
If the collection doesn't exist, create it with these settings:

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

## Step 3: Use the automated setup (Recommended)
Instead of manually creating the collection, you can use the provided configuration:

1. Install Appwrite CLI:
   ```bash
   npm install -g appwrite-cli
   ```

2. Login to Appwrite:
   ```bash
   appwrite login
   ```

3. Initialize project (if not done):
   ```bash
   appwrite init project
   ```

4. Create all collections automatically:
   ```bash
   appwrite push collections
   ```

## Step 4: Test the functionality
1. Start your development server: `pnpm dev`
2. Go to `/admin` and navigate to "Specialized Areas"
3. Try to add a new specialized area
4. Check the browser console for any error messages

## Troubleshooting
If you still have issues:

1. **Check browser console** for error messages
2. **Verify collection exists** in Appwrite Console
3. **Check permissions** are set correctly
4. **Ensure database ID** matches your environment

## Environment Variables
Make sure you have these environment variables set (or the app will use fallback values):
```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=685bcfb7001103824569
VITE_APPWRITE_DATABASE_ID=6873ba790033a7d5cfdb
VITE_APPWRITE_STORAGE_BUCKET_ID=6873ba8f00060c027d7c
```

## Collection Structure
The collection should have this exact structure:
```json
{
  "$id": "specialized_areas",
  "name": "Specialized Areas",
  "attributes": [
    {
      "key": "title",
      "type": "string",
      "required": true,
      "size": 100
    },
    {
      "key": "description",
      "type": "string",
      "required": false,
      "size": 1000
    },
    {
      "key": "image",
      "type": "string",
      "required": false,
      "size": 255
    },
    {
      "key": "order",
      "type": "integer",
      "required": false
    }
  ]
}
```

After setting up the collection, the specialized areas functionality should work correctly!
