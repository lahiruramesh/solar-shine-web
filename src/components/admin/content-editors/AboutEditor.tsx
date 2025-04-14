
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Upload } from 'lucide-react';
import { fetchAboutContent, updateAboutContent } from '@/services/cmsService';
import { AboutContent } from '@/types/payload-types';

const AboutEditor: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedImages, setSelectedImages] = useState<{
    mainImage?: File,
    imageOne?: File,
    imageTwo?: File
  }>({});
  
  const { data: aboutContent, isLoading } = useQuery({
    queryKey: ['aboutContent'],
    queryFn: fetchAboutContent
  });
  
  const updateMutation = useMutation({
    mutationFn: updateAboutContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aboutContent'] });
      setSelectedImages({});
      toast.success('About page content updated');
    },
    onError: () => toast.error('Failed to update about page content')
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageKey: string) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImages({
        ...selectedImages,
        [imageKey]: e.target.files[0]
      });
    }
  };
  
  const handleUpdateContent = () => {
    if (!aboutContent) return;
    
    const formData = new FormData();
    formData.append('id', aboutContent.id);
    formData.append('title', aboutContent.title);
    formData.append('subtitle', aboutContent.subtitle || '');
    formData.append('content', aboutContent.content || '');
    formData.append('missionTitle', aboutContent.missionTitle || '');
    formData.append('missionDescription', aboutContent.missionDescription || '');
    formData.append('visionTitle', aboutContent.visionTitle || '');
    formData.append('visionDescription', aboutContent.visionDescription || '');
    
    if (selectedImages.mainImage) {
      formData.append('mainImage', selectedImages.mainImage);
    }
    
    if (selectedImages.imageOne) {
      formData.append('imageOne', selectedImages.imageOne);
    }
    
    if (selectedImages.imageTwo) {
      formData.append('imageTwo', selectedImages.imageTwo);
    }
    
    updateMutation.mutate(formData);
  };

  const handleFieldUpdate = (field: keyof AboutContent, value: string) => {
    if (!aboutContent) return;
    
    // Create a FormData object for the update
    const formData = new FormData();
    formData.append('id', aboutContent.id);
    formData.append('title', field === 'title' ? value : aboutContent.title);
    formData.append('subtitle', field === 'subtitle' ? value : (aboutContent.subtitle || ''));
    formData.append('content', field === 'content' ? value : (aboutContent.content || ''));
    formData.append('missionTitle', field === 'missionTitle' ? value : (aboutContent.missionTitle || ''));
    formData.append('missionDescription', field === 'missionDescription' ? value : (aboutContent.missionDescription || ''));
    formData.append('visionTitle', field === 'visionTitle' ? value : (aboutContent.visionTitle || ''));
    formData.append('visionDescription', field === 'visionDescription' ? value : (aboutContent.visionDescription || ''));
    
    // Submit the update
    updateMutation.mutate(formData);
  };
  
  if (isLoading) {
    return <div className="flex justify-center p-6">Loading about page content...</div>;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>About Page Content</CardTitle>
      </CardHeader>
      <CardContent>
        {aboutContent && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="about-title">Main Title</Label>
                  <Input 
                    id="about-title"
                    value={aboutContent.title} 
                    onChange={(e) => handleFieldUpdate('title', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="about-subtitle">Subtitle</Label>
                  <Input 
                    id="about-subtitle"
                    value={aboutContent.subtitle || ''} 
                    onChange={(e) => handleFieldUpdate('subtitle', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="about-content">Main Content</Label>
                  <Textarea 
                    id="about-content"
                    value={aboutContent.content || ''} 
                    onChange={(e) => handleFieldUpdate('content', e.target.value)}
                    rows={6}
                  />
                </div>
              </div>
              
              <div>
                <Label>Main Image</Label>
                <div className="mt-2">
                  <div className="mb-4">
                    <img 
                      src={aboutContent.mainImage || '/placeholder.svg'} 
                      alt="About page main" 
                      className="h-40 object-cover rounded-md border"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Label 
                      htmlFor="main-image-upload" 
                      className="cursor-pointer bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md flex items-center gap-2"
                    >
                      <Upload size={16} />
                      <span>Choose Image</span>
                    </Label>
                    <Input 
                      id="main-image-upload"
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(e, 'mainImage')}
                    />
                    {selectedImages.mainImage && (
                      <span className="text-sm text-green-600">
                        {selectedImages.mainImage.name} selected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6 mt-8">
              <h3 className="text-lg font-medium mb-4">Mission & Vision</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mission-title">Mission Title</Label>
                    <Input 
                      id="mission-title"
                      value={aboutContent.missionTitle || ''} 
                      onChange={(e) => handleFieldUpdate('missionTitle', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="mission-description">Mission Description</Label>
                    <Textarea 
                      id="mission-description"
                      value={aboutContent.missionDescription || ''} 
                      onChange={(e) => handleFieldUpdate('missionDescription', e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="vision-title">Vision Title</Label>
                    <Input 
                      id="vision-title"
                      value={aboutContent.visionTitle || ''} 
                      onChange={(e) => handleFieldUpdate('visionTitle', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="vision-description">Vision Description</Label>
                    <Textarea 
                      id="vision-description"
                      value={aboutContent.visionDescription || ''} 
                      onChange={(e) => handleFieldUpdate('visionDescription', e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6 mt-8">
              <h3 className="text-lg font-medium mb-4">Additional Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Image One</Label>
                  <div className="mt-2">
                    <div className="mb-4">
                      <img 
                        src={aboutContent.imageOne || '/placeholder.svg'} 
                        alt="About page additional 1" 
                        className="h-40 object-cover rounded-md border"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Label 
                        htmlFor="image-one-upload" 
                        className="cursor-pointer bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md flex items-center gap-2"
                      >
                        <Upload size={16} />
                        <span>Choose Image</span>
                      </Label>
                      <Input 
                        id="image-one-upload"
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange(e, 'imageOne')}
                      />
                      {selectedImages.imageOne && (
                        <span className="text-sm text-green-600">
                          {selectedImages.imageOne.name} selected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>Image Two</Label>
                  <div className="mt-2">
                    <div className="mb-4">
                      <img 
                        src={aboutContent.imageTwo || '/placeholder.svg'} 
                        alt="About page additional 2" 
                        className="h-40 object-cover rounded-md border"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Label 
                        htmlFor="image-two-upload" 
                        className="cursor-pointer bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md flex items-center gap-2"
                      >
                        <Upload size={16} />
                        <span>Choose Image</span>
                      </Label>
                      <Input 
                        id="image-two-upload"
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange(e, 'imageTwo')}
                      />
                      {selectedImages.imageTwo && (
                        <span className="text-sm text-green-600">
                          {selectedImages.imageTwo.name} selected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleUpdateContent}
              className="mt-6"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AboutEditor;
