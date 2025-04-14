
import React from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ContentSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Management</CardTitle>
        <CardDescription>Edit website content for different sections.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toast.info('Feature coming soon')}
              >
                Edit Hero Content
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Service Cards</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toast.info('Feature coming soon')}
              >
                Manage Services
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Projects</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toast.info('Feature coming soon')}
              >
                Manage Projects
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Testimonials</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toast.info('Feature coming soon')}
              >
                Manage Testimonials
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Blog Posts</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toast.info('Feature coming soon')}
              >
                Manage Blog Posts
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Available Time Slots</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toast.info('Feature coming soon')}
              >
                Manage Time Slots
              </Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentSection;
