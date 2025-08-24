# Service Process Collection Setup

## Overview
This guide explains how to set up the `service_process_steps` collection in Appwrite to manage the "Our Service Process" section steps on the Services page.

## Collection Details

**Collection ID:** `service_process_steps`  
**Collection Name:** `Service Process Steps`

## Attributes

| Key | Type | Size | Required | Description |
|-----|------|------|----------|-------------|
| `number` | string | 10 | ✅ Yes | Step number (e.g., "01", "02", "03") |
| `title` | string | 255 | ✅ Yes | Step title |
| `description` | string | 500 | ✅ Yes | Step description |
| `order_index` | integer | - | ❌ No | Display order (0, 1, 2, ...) |

## Permissions

- **Read:** Any (public access)
- **Create:** Users (admin access)
- **Update:** Users (admin access)
- **Delete:** Users (admin access)

## Setup Instructions

### Option 1: Using Appwrite Console

1. Go to your Appwrite Console
2. Navigate to Databases → Your Database
3. Click "Create Collection"
4. Enter Collection ID: `service_process_steps`
5. Enter Collection Name: `Service Process Steps`
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
    "number": "01",
    "title": "Initial Consultation",
    "description": "We discuss your energy needs, budget, and goals to determine the best approach for your solar project.",
    "order_index": 0
  },
  {
    "number": "02",
    "title": "Site Assessment",
    "description": "Our technicians evaluate your property to assess solar potential, optimal panel placement, and any technical considerations.",
    "order_index": 1
  },
  {
    "number": "03",
    "title": "Custom Design",
    "description": "We create a tailored system design that maximizes energy production and meets your specific requirements.",
    "order_index": 2
  },
  {
    "number": "04",
    "title": "Proposal & Agreement",
    "description": "You receive a detailed proposal including system specifications, costs, financing options, and projected savings.",
    "order_index": 3
  },
  {
    "number": "05",
    "title": "Installation",
    "description": "Our experienced team installs your solar system with minimal disruption to your home or business.",
    "order_index": 4
  },
  {
    "number": "06",
    "title": "Commissioning & Activation",
    "description": "We perform thorough testing and coordinate with utilities to ensure your system is safely connected to the grid.",
    "order_index": 5
  },
  {
    "number": "07",
    "title": "Ongoing Support",
    "description": "We provide monitoring, maintenance, and customer support throughout the life of your solar system.",
    "order_index": 6
  }
]
```

## Admin Panel Integration

Once the collection is set up, the service process steps will be automatically available in the admin panel under:

**Services → Service Process Steps**

Features include:
- ✅ Create new process steps
- ✅ Edit existing steps
- ✅ Delete steps
- ✅ Reorder steps using up/down arrows
- ✅ Custom step numbers (01, 02, 03, etc.)
- ✅ Real-time updates

## Frontend Display

The process steps will automatically appear on the Services page (`/services`) in the "Our Service Process" section, displaying with:

- Beautiful numbered circles
- Responsive layout
- Smooth animations
- Loading states
- Empty state handling

## Troubleshooting

### Common Issues

1. **Steps not displaying**: Ensure collection permissions and database connection
2. **Order not working**: Verify `order_index` field is properly set
3. **Step numbers not showing**: Check that the `number` field contains valid values

### Support

If you encounter issues, check:
- Appwrite console logs
- Browser developer console
- Collection permissions
- Database connection status
