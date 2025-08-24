# Additional Services Collection Setup

## Overview
This guide explains how to set up the `additional_services` collection in Appwrite to manage additional services displayed on the Services page.

## Collection Details

**Collection ID:** `additional_services`  
**Collection Name:** `Additional Services`

## Attributes

| Key | Type | Size | Required | Description |
|-----|------|------|----------|-------------|
| `title` | string | 255 | ✅ Yes | Service title |
| `description` | string | 500 | ❌ No | Service description |
| `icon` | string | 100 | ✅ Yes | Icon name (e.g., "Sun", "Battery", "Wrench") |
| `order_index` | integer | - | ❌ No | Display order (0, 1, 2, ...) |

## Permissions

- **Read:** Any (public access)
- **Create:** Users (admin access)
- **Update:** Users (admin access)
- **Delete:** Users (admin access)

## Available Icons

The system supports the following Lucide React icons:

- **Sun** - Solar/Energy
- **Battery** - Storage
- **Wrench** - Maintenance
- **BarChart3** - Monitoring
- **Zap** - Power
- **Shield** - Protection
- **Home** - Residential
- **Building** - Commercial
- **Factory** - Industrial
- **Settings** - Configuration
- **Lightbulb** - Ideas
- **CheckCircle** - Success
- **Star** - Featured
- **Heart** - Care

## Setup Instructions

### Option 1: Using Appwrite Console

1. Go to your Appwrite Console
2. Navigate to Databases → Your Database
3. Click "Create Collection"
4. Enter Collection ID: `additional_services`
5. Enter Collection Name: `Additional Services`
6. Set permissions as specified above
7. Add each attribute with the specified type, size, and requirements
8. Save the collection

### Option 2: Using Appwrite CLI

1. Ensure you have the Appwrite CLI installed
2. Run: `appwrite init collections`
3. The collection will be created automatically based on your configuration

## Sample Data

After creating the collection, you can add sample data:

```json
[
  {
    "title": "Solar System Design",
    "description": "Custom-designed solar systems that maximize energy production while considering aesthetic and space constraints.",
    "icon": "Sun",
    "order_index": 0
  },
  {
    "title": "Battery Storage Solutions",
    "description": "Advanced energy storage systems that provide power during outages and help manage energy consumption.",
    "icon": "Battery",
    "order_index": 1
  },
  {
    "title": "Maintenance & Repairs",
    "description": "Regular maintenance and prompt repairs to ensure your solar system operates at peak efficiency throughout its lifespan.",
    "icon": "Wrench",
    "order_index": 2
  }
]
```

## Admin Panel Integration

Once the collection is set up, the additional services will be automatically available in the admin panel under:

**Services → Additional Services**

Features include:
- ✅ Create new additional services
- ✅ Edit existing services
- ✅ Delete services
- ✅ Reorder services using up/down arrows
- ✅ Icon selection from available options
- ✅ Real-time updates

## Frontend Display

The additional services will automatically appear on the Services page (`/services`) in the "Additional Services" section, displaying with:

- Beautiful circular icon backgrounds
- Responsive grid layout
- Smooth animations
- Loading states
- Fallback for missing icons

## Troubleshooting

### Common Issues

1. **Icons not displaying**: Ensure the icon name matches exactly (case-sensitive)
2. **Services not loading**: Check collection permissions and database connection
3. **Order not working**: Verify `order_index` field is properly set

### Support

If you encounter issues, check:
- Appwrite console logs
- Browser developer console
- Collection permissions
- Database connection status

