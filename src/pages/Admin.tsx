
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Dashboard } from '@/components/admin/Dashboard';
import { ContentManager } from '@/components/admin/content/ContentManager';
import { GlobalSettingsManager } from '@/components/admin/content/GlobalSettingsManager';
import { NavigationManager } from '@/components/admin/content/NavigationManager';
import { SEOManager } from '@/components/admin/content/SEOManager';
import AppointmentsSection from '@/components/admin/AppointmentsSection';
import SEOSection from '@/components/admin/SEOSection';

const Admin: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user } = useAuth();

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'appointments':
        return <AppointmentsSection />;
      case 'seo':
        return <SEOManager />;
      case 'hero':
      case 'services':
      case 'specialized-areas':
      case 'projects':
      case 'testimonials':
      case 'blog':
      case 'about':
        return <ContentManager activeSection={activeSection} />;
      case 'company-info':
        return (
          <div className="text-center py-8 text-gray-500">
            Company Info management coming soon...
          </div>
        );
      case 'navigation':
        return <NavigationManager />;
      case 'settings':
        return <GlobalSettingsManager />;
      default:
        return <Dashboard />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">Please log in to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderContent()}
    </AdminLayout>
  );
};

export default Admin;
