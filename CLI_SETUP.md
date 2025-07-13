# 🚀 Quick Setup Guide - Appwrite CLI

This guide shows you how to set up your Solar Shine admin panel database using the Appwrite CLI.

## Prerequisites

1. **Install Appwrite CLI**
   ```bash
   npm install -g appwrite-cli
   ```

2. **Login to Appwrite**
   ```bash
   appwrite login
   ```

3. **Initialize your project**
   ```bash
   appwrite init project
   ```

## Method 1: Using appwrite.json (Recommended)

1. **Update appwrite.json** (already configured in this project)
   - The `appwrite.json` file contains your database schema
   - Update the `projectId` if needed

2. **Push collections to Appwrite**
   ```bash
   pnpm push-collections
   # or directly: appwrite push collections
   ```

## Method 2: Manual CLI Commands

Run the setup script to see all CLI commands:
```bash
pnpm setup-db
```

This will show you the exact commands to create each collection and attribute.

## Method 3: Manual Console Setup

If you prefer using the web console:
1. Go to your [Appwrite Console](https://cloud.appwrite.io/)
2. Create collections manually following the structure in `APPWRITE_SETUP.md`

## After Setup

1. **Start development server**
   ```bash
   pnpm dev
   ```

2. **Create admin account**
   - Visit: http://localhost:8080/login
   - Login with your credentials

3. **Access admin panel**
   - Go to: http://localhost:8080/admin

## Verification

Test your setup with CLI commands:
```bash
# List all collections
appwrite databases list-collections --database-id 6873ba790033a7d5cfdb

# Check a specific collection
appwrite databases get-collection --database-id 6873ba790033a7d5cfdb --collection-id hero_section
```

## Troubleshooting

- **CLI not found**: Install with `npm install -g appwrite-cli`
- **Login issues**: Run `appwrite login` and follow prompts
- **Project issues**: Ensure your project ID matches in `.env` and `appwrite.json`
- **Permission errors**: Check your Appwrite project permissions

## Next Steps

- Read the complete guide: `APPWRITE_SETUP.md`
- Check admin documentation: `ADMIN_README.md`
- Start building your content!

Happy coding! 🎉
