
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import AdminHeader from '@/components/admin/AdminHeader';
import AppointmentsSection from '@/components/admin/AppointmentsSection';
import SEOSection from '@/components/admin/SEOSection';
import ContentSection from '@/components/admin/ContentSection';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const { user, logout } = useAuth();

  return (
    <>
      <AdminHeader user={user} onLogout={logout} />
      <main className="min-h-screen pt-8 pb-12 px-4">
        <div className="container-custom">
          <Tabs defaultValue="appointments" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="seo">SEO Settings</TabsTrigger>
              <TabsTrigger value="content">Content Management</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appointments" className="space-y-6">
              <AppointmentsSection />
            </TabsContent>
            
            <TabsContent value="seo" className="space-y-6">
              <SEOSection />
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <ContentSection />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Admin;
