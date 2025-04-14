
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Upload } from 'lucide-react';
import { fetchHeroSection, updateHeroSection } from '@/services/cmsService';

const HeroEditor: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  
  const { data: hero, isLoading } = useQuery({
    queryKey: ['heroSection'],
    queryFn: fetchHeroSection
  });
  
  const updateMutation = useMutation({
    mutationFn: updateHeroSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroSection'] });
      setSelectedImage(null);
      toast.success('Hero section updated');
    },
    onError: () => toast.error('Failed to update hero section')
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };
  
  const handleUpdateHero = () => {
    if (!hero) return;
    
    const formData = new FormData();
    formData.append('id', hero.id || '');
    formData.append('title', hero.title);
    formData.append('subtitle', hero.subtitle || '');
    formData.append('ctaText', hero.ctaText || '');
    formData.append('ctaLink', hero.ctaLink || '');
    
    if (selectedImage) {
      formData.append('backgroundImage', selectedImage);
    }
    
    updateMutation.mutate(formData);
  };

  const handleFieldUpdate = (field: string, value: string) => {
    if (!hero) return;
    
    // Create a new hero object with the updated field
    const updatedHero = { 
      ...hero, 
      [field]: value 
    };
    
    // Create a FormData object for the update
    const formData = new FormData();
    formData.append('id', updatedHero.id || '');
    formData.append('title', updatedHero.title);
    formData.append('subtitle', updatedHero.subtitle || '');
    formData.append('ctaText', updatedHero.ctaText || '');
    formData.append('ctaLink', updatedHero.ctaLink || '');
    
    // Submit the update
    updateMutation.mutate(formData);
  };
  
  if (isLoading) {
    return <div className="flex justify-center p-6">Loading hero section data...</div>;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Section</CardTitle>
      </CardHeader>
      <CardContent>
        {hero && (
          <div className="space-y-5">
            <div>
              <Label htmlFor="hero-title">Title</Label>
              <Input 
                id="hero-title"
                value={hero.title} 
                onChange={(e) => handleFieldUpdate('title', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Textarea 
                id="hero-subtitle"
                value={hero.subtitle || ''} 
                onChange={(e) => handleFieldUpdate('subtitle', e.target.value)}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="hero-cta-text">CTA Button Text</Label>
              <Input 
                id="hero-cta-text"
                value={hero.ctaText || ''} 
                onChange={(e) => handleFieldUpdate('ctaText', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="hero-cta-link">CTA Button Link</Label>
              <Input 
                id="hero-cta-link"
                value={hero.ctaLink || ''} 
                onChange={(e) => handleFieldUpdate('ctaLink', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="hero-background">Background Image</Label>
              <div className="mt-2">
                <div className="mb-4">
                  <img 
                    src={hero.backgroundImage || '/placeholder.svg'} 
                    alt="Hero background" 
                    className="h-40 object-cover rounded-md border"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label 
                    htmlFor="hero-background-upload" 
                    className="cursor-pointer bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md flex items-center gap-2"
                  >
                    <Upload size={16} />
                    <span>Choose Image</span>
                  </Label>
                  <Input 
                    id="hero-background-upload"
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  {selectedImage && (
                    <span className="text-sm text-green-600">
                      {selectedImage.name} selected
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleUpdateHero}
              className="mt-4"
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

export default HeroEditor;
