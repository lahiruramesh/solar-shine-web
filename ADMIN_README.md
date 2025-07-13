# Solar Shine Web Admin Panel

A comprehensive admin panel for managing your Solar Shine website content using Appwrite as the backend.

## Features

### ✨ Modern Admin Interface
- **Sidebar Navigation**: Collapsible sidebar with organized sections
- **Dashboard**: Overview with key metrics and quick actions
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Clean UI**: Built with shadcn/ui components for a professional look

### 📊 Dashboard
- Key metrics overview (appointments, blog posts, projects, testimonials)
- Recent activity feed
- Quick action buttons
- System status indicators

### 🎨 Content Management
- **Hero Section**: Manage homepage hero content with background images
- **Services**: Add, edit, and delete service offerings with icons
- **Projects**: Portfolio management with categories and client information
- **Blog Posts**: Full blog management with rich content editing
- **Specialized Areas**: Manage specialized service areas (coming soon)
- **Testimonials**: Customer testimonials management (coming soon)
- **About Content**: Company information and mission/vision (coming soon)

### 📅 Appointment Management
- View and manage customer appointments
- Track appointment status (pending, confirmed, completed, cancelled)
- Customer contact information management

### 🔧 Configuration
- **Company Info**: Manage company details and contact information
- **Navigation**: Configure website navigation structure
- **SEO Settings**: Manage meta tags and SEO optimization
- **Global Settings**: Site-wide settings and branding

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Backend**: Appwrite (Database, Storage, Authentication)
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Context + Hooks
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm
- Appwrite account (cloud or self-hosted)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd solar-shine-web
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up Appwrite backend**
   - Follow the detailed guide in `APPWRITE_SETUP.md`
   - Create your Appwrite project, database, and collections
   - Configure authentication and storage

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your Appwrite credentials:
   ```env
   VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=your-project-id
   VITE_APPWRITE_DATABASE_ID=your-database-id
   VITE_APPWRITE_STORAGE_BUCKET_ID=your-bucket-id
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

6. **Access the admin panel**
   - Create an admin account at `/login`
   - Access the admin panel at `/admin`

## Project Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminLayout.tsx          # Main admin layout wrapper
│   │   ├── AdminSidebar.tsx         # Collapsible sidebar navigation
│   │   ├── Dashboard.tsx            # Dashboard with metrics
│   │   └── content/
│   │       ├── ContentManager.tsx   # Content routing component
│   │       ├── HeroSectionManager.tsx
│   │       ├── ServicesManager.tsx
│   │       ├── ProjectsManager.tsx
│   │       └── BlogManager.tsx
│   ├── auth/
│   │   └── ProtectedRoute.tsx
│   └── ui/                          # shadcn/ui components
├── services/
│   └── appwriteService.ts           # Appwrite integration
├── types/
│   └── payload-types.ts             # TypeScript interfaces
├── contexts/
│   └── AuthContext.tsx              # Authentication state
├── lib/
│   └── appwrite.ts                  # Appwrite configuration
└── pages/
    └── Admin.tsx                    # Main admin page
```

## Admin Panel Sections

### 1. Dashboard
The main overview page showing:
- Key metrics (appointments, posts, projects, testimonials)
- Recent activity feed
- Quick action buttons
- System status indicators

### 2. Content Management
Manage all website content:
- **Hero Section**: Homepage banner with title, subtitle, background image, and CTA
- **Services**: Service offerings with descriptions and icons
- **Projects**: Portfolio items with categories, images, and client details
- **Blog**: Articles with rich content, cover images, and publishing schedules

### 3. Appointments
Customer appointment management:
- View all appointments in a table format
- Filter by status (pending, confirmed, completed, cancelled)
- View customer contact details
- Update appointment status

### 4. Configuration
Site-wide settings:
- **Company Info**: Business details and contact information
- **Navigation**: Configure menu structure
- **SEO Settings**: Meta tags and search optimization
- **Global Settings**: Branding and site-wide preferences

## Key Features

### 🔒 Authentication
- Secure login with Appwrite authentication
- Protected routes for admin access
- Session management and logout functionality

### 📱 Responsive Design
- Mobile-first design approach
- Collapsible sidebar for mobile devices
- Touch-friendly interface elements

### 🖼️ File Management
- Image upload with drag-and-drop support
- Automatic file optimization
- Secure file storage with Appwrite

### 📝 Form Validation
- Client-side validation with Zod schemas
- Real-time error feedback
- Type-safe form handling

### 🔄 Real-time Updates
- Instant content updates
- Toast notifications for user feedback
- Loading states for better UX

## Best Practices Implemented

### Code Organization
- Modular component structure
- Separation of concerns (services, components, types)
- Reusable CRUD operations
- Consistent naming conventions

### UI/UX
- Consistent design language
- Intuitive navigation patterns
- Accessible form controls
- Loading and error states

### Performance
- Optimized bundle size
- Lazy loading where appropriate
- Efficient re-rendering patterns
- Image optimization

### Security
- Input validation and sanitization
- Secure file uploads
- Protected API endpoints
- Authentication-based access control

## Development

### Available Scripts
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

### Adding New Content Types
1. Define the TypeScript interface in `types/payload-types.ts`
2. Add the collection to `COLLECTIONS` in `lib/appwrite.ts`
3. Create a service instance in `services/appwriteService.ts`
4. Build the management component in `components/admin/content/`
5. Add the route to `ContentManager.tsx`
6. Update the sidebar navigation in `AdminSidebar.tsx`

### Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_APPWRITE_ENDPOINT` | Appwrite server endpoint | `https://cloud.appwrite.io/v1` |
| `VITE_APPWRITE_PROJECT_ID` | Your Appwrite project ID | `abc123` |
| `VITE_APPWRITE_DATABASE_ID` | Database ID | `main` |
| `VITE_APPWRITE_STORAGE_BUCKET_ID` | Storage bucket ID | `media` |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the Appwrite documentation
- Review the setup guide in `APPWRITE_SETUP.md`
