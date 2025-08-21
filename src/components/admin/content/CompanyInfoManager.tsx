import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Building, Mail, Phone, MapPin, Globe, Save, Loader2, Clock } from 'lucide-react';
import { fetchCompanyInfo, updateCompanyInfo } from '@/services/companyService';
import { CompanyInfo } from '@/types/payload-types';

export const CompanyInfoManager: React.FC = () => {
    const [formData, setFormData] = useState<Partial<CompanyInfo>>({});
    const [isEditing, setIsEditing] = useState(false);
    const queryClient = useQueryClient();

    const { data: companyInfo, isLoading, error } = useQuery({
        queryKey: ['companyInfo'],
        queryFn: fetchCompanyInfo
    });

    const updateMutation = useMutation({
        mutationFn: updateCompanyInfo,
        onSuccess: () => {
            toast.success('Company information updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['companyInfo'] });
            setIsEditing(false);
        },
        onError: (error) => {
            toast.error('Failed to update company information');
            console.error('Update error:', error);
        }
    });

    useEffect(() => {
        if (companyInfo) {
            setFormData(companyInfo);
        }
    }, [companyInfo]);

    const handleInputChange = (field: keyof CompanyInfo, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        if (!formData.name || !formData.email) {
            toast.error('Company name and email are required');
            return;
        }

        updateMutation.mutate(formData as CompanyInfo);
    };

    const handleCancel = () => {
        setFormData(companyInfo || {});
        setIsEditing(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-600">
                Failed to load company information. Please try again.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Company Information</h2>
                    <p className="text-gray-600">Manage your business details and contact information</p>
                </div>
                <div className="flex space-x-2">
                    {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)}>
                            <Building className="h-4 w-4 mr-2" />
                            Edit Information
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={updateMutation.isPending}
                            >
                                {updateMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4 mr-2" />
                                )}
                                Save Changes
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Company Information Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Building className="h-5 w-5 mr-2" />
                        Basic Information
                    </CardTitle>
                    <CardDescription>
                        Core business details and company description
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Company Name *</Label>
                            <Input
                                id="name"
                                value={formData.name || ''}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                disabled={!isEditing}
                                placeholder="Solar Shine Solutions"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                value={formData.website || ''}
                                onChange={(e) => handleInputChange('website', e.target.value)}
                                disabled={!isEditing}
                                placeholder="https://solarshine.com"
                                type="url"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Company Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description || ''}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            disabled={!isEditing}
                            placeholder="Describe your company's mission, values, and expertise..."
                            rows={4}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Mail className="h-5 w-5 mr-2" />
                        Contact Information
                    </CardTitle>
                    <CardDescription>
                        How customers can reach your business
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                                id="email"
                                value={formData.email || ''}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                disabled={!isEditing}
                                placeholder="info@solarshine.com"
                                type="email"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                value={formData.phone || ''}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                disabled={!isEditing}
                                placeholder="+1 (555) 123-4567"
                                type="tel"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        Address Information
                    </CardTitle>
                    <CardDescription>
                        Physical location and service areas
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="address">Full Address</Label>
                        <Textarea
                            id="address"
                            value={formData.address || ''}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            disabled={!isEditing}
                            placeholder="123 Solar Street, Green City, ST 12345"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                value={formData.city || ''}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                disabled={!isEditing}
                                placeholder="Green City"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State/Province</Label>
                            <Input
                                id="state"
                                value={formData.state || ''}
                                onChange={(e) => handleInputChange('state', e.target.value)}
                                disabled={!isEditing}
                                placeholder="ST"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                            <Input
                                id="zipCode"
                                value={formData.zipCode || ''}
                                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                disabled={!isEditing}
                                placeholder="12345"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                value={formData.country || ''}
                                onChange={(e) => handleInputChange('country', e.target.value)}
                                disabled={!isEditing}
                                placeholder="United States"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        Business Hours
                    </CardTitle>
                    <CardDescription>
                        When your business is open for customers
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="businessHours">Business Hours</Label>
                        <Textarea
                            id="businessHours"
                            value={formData.businessHours || ''}
                            onChange={(e) => handleInputChange('businessHours', e.target.value)}
                            disabled={!isEditing}
                            placeholder="Monday - Friday: 8:00 AM - 6:00 PM&#10;Saturday: 9:00 AM - 4:00 PM&#10;Sunday: Closed"
                            rows={4}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Social Media & Additional Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Globe className="h-5 w-5 mr-2" />
                        Additional Information
                    </CardTitle>
                    <CardDescription>
                        Social media links and other business details
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="facebook">Facebook</Label>
                            <Input
                                id="facebook"
                                value={formData.facebook || ''}
                                onChange={(e) => handleInputChange('facebook', e.target.value)}
                                disabled={!isEditing}
                                placeholder="https://facebook.com/solarshine"
                                type="url"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <Input
                                id="linkedin"
                                value={formData.linkedin || ''}
                                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                                disabled={!isEditing}
                                placeholder="https://linkedin.com/company/solarshine"
                                type="url"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="additionalInfo">Additional Information</Label>
                        <Textarea
                            id="additionalInfo"
                            value={formData.additionalInfo || ''}
                            onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                            disabled={!isEditing}
                            placeholder="Any additional information about your business, certifications, awards, etc."
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
