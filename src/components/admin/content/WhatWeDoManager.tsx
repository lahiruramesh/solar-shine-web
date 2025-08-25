import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Plus,
    Edit,
    Trash2,
    Save,
    BadgeCheck,
    Sun,
    BarChart3,
    Settings,
    Users,
    ChevronDown,
    ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { whatWeDoService, WhatWeDoContent, WhatWeDoHero, ApproachStep, ExpertiseArea, Benefit, ImpactStat } from '@/services/whatWeDoService';
import { fileUploadService } from '@/services/appwriteService';

const AVAILABLE_ICONS = [
    { value: 'Sun', label: 'Sun', icon: Sun },
    { value: 'BarChart3', label: 'Bar Chart', icon: BarChart3 },
    { value: 'Settings', label: 'Settings', icon: Settings },
    { value: 'Users', label: 'Users', icon: Users },
];

export const WhatWeDoManager: React.FC = () => {
    console.log('WhatWeDoManager: Component rendering');

    const [content, setContent] = useState<WhatWeDoContent>({
        hero: { title: '', subtitle: '' },
        approach: { title: '', description: '', steps: [] },
        expertise: { title: '', description: '', areas: [] },
        benefits: { title: '', items: [] },
        impact: { title: '', description: '', stats: [] }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        hero: true,
        approach: false,
        expertise: false,
        benefits: false,
        impact: false
    });
    const { toast } = useToast();

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    useEffect(() => {
        console.log('WhatWeDoManager: useEffect triggered');
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            console.log('WhatWeDoManager: Loading content...');
            setLoading(true);
            setError(null);

            const existingContent = await whatWeDoService.fetchWhatWeDoContent();
            console.log('WhatWeDoManager: Existing content:', existingContent);

            if (existingContent) {
                setContent(existingContent);
            } else {
                // Set default content structure
                const defaultContent = {
                    hero: { title: 'What We Do', subtitle: 'Delivering comprehensive solar energy solutions tailored to your specific needs' },
                    approach: {
                        title: 'Our Approach',
                        description: 'We believe in a comprehensive, consultative approach that ensures each solar solution is perfectly tailored to our clients\' specific energy needs, property characteristics, and budget considerations.',
                        steps: []
                    },
                    expertise: {
                        title: 'Our Expertise',
                        description: 'With years of experience in the solar industry, we\'ve developed specialized expertise across various domains of solar energy implementation.',
                        areas: []
                    },
                    benefits: {
                        title: 'Benefits of Working With Us',
                        items: []
                    },
                    impact: {
                        title: 'Our Environmental Impact',
                        description: 'Through our solar installations, we\'ve helped our clients significantly reduce their carbon footprint while saving on energy costs.',
                        stats: []
                    }
                };
                setContent(defaultContent);
                console.log('WhatWeDoManager: Set default content');
            }
        } catch (error) {
            console.error('WhatWeDoManager: Error loading content:', error);
            setError(error instanceof Error ? error.message : 'Unknown error occurred');
            toast({
                title: "Error",
                description: "Failed to load content",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            console.log('WhatWeDoManager: Saving content...');
            setSaving(true);
            setError(null);

            const success = await whatWeDoService.updateWhatWeDoContent(content);
            console.log('WhatWeDoManager: Save result:', success);

            if (success) {
                toast({
                    title: "Success",
                    description: "Content saved successfully",
                });
            } else {
                toast({
                    title: "Error",
                    description: "Failed to save content",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('WhatWeDoManager: Error saving content:', error);
            setError(error instanceof Error ? error.message : 'Unknown error occurred');
            toast({
                title: "Error",
                description: "Failed to save content",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <BadgeCheck className="h-6 w-6" />
                            What We Do Page Manager
                        </h2>
                        <p className="text-muted-foreground">
                            Manage the content displayed on the "What We Do" page
                        </p>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-red-600">{error}</p>
                        <Button onClick={loadContent} className="mt-4">
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (loading) {
        console.log('WhatWeDoManager: Rendering loading state');
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Loading content...</span>
            </div>
        );
    }

    console.log('WhatWeDoManager: Rendering main content');
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <BadgeCheck className="h-6 w-6" />
                        What We Do Page Manager
                    </h2>
                    <p className="text-muted-foreground">
                        Manage the content displayed on the "What We Do" page
                    </p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? 'Saving...' : 'Save All Changes'}
                </Button>
            </div>

            <Card>
                <CardHeader
                    className="cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                    onClick={() => toggleSection('hero')}
                >
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            {expandedSections.hero ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                            Hero Section
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                            {content.hero.title ? 'Configured' : 'Not Set'}
                        </Badge>
                    </div>
                </CardHeader>
                {expandedSections.hero && (
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label>Title</Label>
                                <Input
                                    value={content.hero.title}
                                    onChange={(e) => setContent(prev => ({
                                        ...prev,
                                        hero: { ...prev.hero, title: e.target.value }
                                    }))}
                                    placeholder="Enter hero title"
                                />
                            </div>
                            <div>
                                <Label>Subtitle</Label>
                                <Textarea
                                    value={content.hero.subtitle}
                                    onChange={(e) => setContent(prev => ({
                                        ...prev,
                                        hero: { ...prev.hero, subtitle: e.target.value }
                                    }))}
                                    placeholder="Enter hero subtitle"
                                />
                            </div>
                        </div>

                        {/* Section Save Button */}
                        <div className="flex justify-end pt-4 border-t">
                            <Button
                                onClick={() => handleSave()}
                                size="sm"
                                className="px-6"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                Save Hero Section
                            </Button>
                        </div>
                    </CardContent>
                )}
            </Card>

            <Card>
                <CardHeader
                    className="cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                    onClick={() => toggleSection('approach')}
                >
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            {expandedSections.approach ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                            Our Approach
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                            {content.approach.title ? `${content.approach.steps.length} steps` : 'Not Set'}
                        </Badge>
                    </div>
                </CardHeader>
                {expandedSections.approach && (
                    <CardContent>
                        <div className="mb-4">
                            <Label>Title</Label>
                            <Input
                                value={content.approach.title}
                                onChange={(e) => setContent(prev => ({
                                    ...prev,
                                    approach: { ...prev.approach, title: e.target.value }
                                }))}
                                placeholder="Enter approach title"
                            />
                        </div>
                        <div className="mb-4">
                            <Label>Description</Label>
                            <Textarea
                                value={content.approach.description}
                                onChange={(e) => setContent(prev => ({
                                    ...prev,
                                    approach: { ...prev.approach, description: e.target.value }
                                }))}
                                placeholder="Enter approach description"
                            />
                        </div>

                        {/* Approach Steps Management */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <Label className="text-base font-semibold">Approach Steps</Label>
                                <Button
                                    onClick={() => {
                                        const newStep: ApproachStep = {
                                            number: `${content.approach.steps.length + 1}`,
                                            title: '',
                                            description: '',
                                            order_index: content.approach.steps.length
                                        };
                                        setContent(prev => ({
                                            ...prev,
                                            approach: {
                                                ...prev.approach,
                                                steps: [...prev.approach.steps, newStep]
                                            }
                                        }));
                                    }}
                                    size="sm"
                                    className="flex items-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Step
                                </Button>
                            </div>

                            {content.approach.steps.length > 0 && (
                                <div className="space-y-4">
                                    {content.approach.steps.map((step, index) => (
                                        <Card key={index} className="border-2">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="secondary" className="text-sm">
                                                                Step {step.number}
                                                            </Badge>
                                                            <Input
                                                                value={step.title}
                                                                onChange={(e) => {
                                                                    const updatedSteps = [...content.approach.steps];
                                                                    updatedSteps[index] = {
                                                                        ...updatedSteps[index],
                                                                        title: e.target.value
                                                                    };
                                                                    setContent(prev => ({
                                                                        ...prev,
                                                                        approach: {
                                                                            ...prev.approach,
                                                                            steps: updatedSteps
                                                                        }
                                                                    }));
                                                                }}
                                                                placeholder="Enter step title"
                                                                className="max-w-xs"
                                                            />
                                                        </div>
                                                    </div>
                                                    <Button
                                                        onClick={() => {
                                                            const updatedSteps = content.approach.steps.filter((_, i) => i !== index);
                                                            // Renumber remaining steps
                                                            const reorderedSteps = updatedSteps.map((s, i) => ({
                                                                ...s,
                                                                number: `${i + 1}`,
                                                                order_index: i
                                                            }));
                                                            setContent(prev => ({
                                                                ...prev,
                                                                approach: {
                                                                    ...prev.approach,
                                                                    steps: reorderedSteps
                                                                }
                                                            }));
                                                        }}
                                                        variant="destructive"
                                                        size="sm"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <Textarea
                                                    value={step.description}
                                                    onChange={(e) => {
                                                        const updatedSteps = [...content.approach.steps];
                                                        updatedSteps[index] = {
                                                            ...updatedSteps[index],
                                                            description: e.target.value
                                                        };
                                                        setContent(prev => ({
                                                            ...prev,
                                                            approach: {
                                                                ...prev.approach,
                                                                steps: updatedSteps
                                                            }
                                                        }));
                                                    }}
                                                    placeholder="Enter step description"
                                                    rows={3}
                                                />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            {content.approach.steps.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                    <p>No approach steps added yet.</p>
                                    <p className="text-sm">Click "Add Step" to create your first approach step.</p>
                                </div>
                            )}
                        </div>

                        {/* Section Save Button */}
                        <div className="flex justify-end pt-4 border-t">
                            <Button
                                onClick={() => handleSave()}
                                size="sm"
                                className="px-6"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                Save Approach Section
                            </Button>
                        </div>
                    </CardContent>
                )}
            </Card>

            <Card>
                <CardHeader
                    className="cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                    onClick={() => toggleSection('expertise')}
                >
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            {expandedSections.expertise ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                            Our Expertise
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                            {content.expertise.title ? `${content.expertise.areas.length} areas` : 'Not Set'}
                        </Badge>
                    </div>
                </CardHeader>
                {expandedSections.expertise && (
                    <CardContent>
                        <div className="mb-4">
                            <Label>Title</Label>
                            <Input
                                value={content.expertise.title}
                                onChange={(e) => setContent(prev => ({
                                    ...prev,
                                    expertise: { ...prev.expertise, title: e.target.value }
                                }))}
                                placeholder="Enter expertise title"
                            />
                        </div>
                        <div className="mb-4">
                            <Label>Description</Label>
                            <Textarea
                                value={content.expertise.description}
                                onChange={(e) => setContent(prev => ({
                                    ...prev,
                                    expertise: { ...prev.expertise, description: e.target.value }
                                }))}
                                placeholder="Enter expertise description"
                            />
                        </div>

                        {/* Expertise Areas Management */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <Label className="text-base font-semibold">Expertise Areas</Label>
                                <Button
                                    onClick={() => {
                                        const newArea: ExpertiseArea = {
                                            title: '',
                                            description: '',
                                            icon: 'Sun',
                                            order_index: content.expertise.areas.length
                                        };
                                        setContent(prev => ({
                                            ...prev,
                                            expertise: {
                                                ...prev.expertise,
                                                areas: [...prev.expertise.areas, newArea]
                                            }
                                        }));
                                    }}
                                    size="sm"
                                    className="flex items-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Expertise Area
                                </Button>
                            </div>

                            {content.expertise.areas.length > 0 && (
                                <div className="grid gap-6">
                                    {content.expertise.areas.map((area, index) => {
                                        const IconComponent = AVAILABLE_ICONS.find(icon => icon.value === area.icon)?.icon || Sun;
                                        return (
                                            <Card key={index} className="border-2 hover:shadow-lg transition-shadow duration-200">
                                                <CardContent className="p-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {/* Left Column - Compact Image Section */}
                                                        <div className="space-y-3">
                                                            {/* Image Preview or Placeholder */}
                                                            <div className="flex justify-center">
                                                                {area.image ? (
                                                                    <div className="relative">
                                                                        <img
                                                                            src={area.image}
                                                                            alt={area.title || 'Expertise area image'}
                                                                            className="w-full max-w-64 h-auto object-cover rounded-lg border border-border shadow-md"
                                                                            onError={(e) => {
                                                                                console.error('Image failed to load:', area.image);
                                                                                e.currentTarget.style.display = 'none';
                                                                            }}
                                                                        />
                                                                        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200 rounded-lg flex items-center justify-center">
                                                                            <Button
                                                                                onClick={() => {
                                                                                    const updatedAreas = [...content.expertise.areas];
                                                                                    updatedAreas[index] = {
                                                                                        ...updatedAreas[index],
                                                                                        image: undefined,
                                                                                        image_id: undefined
                                                                                    };
                                                                                    setContent(prev => ({
                                                                                        ...prev,
                                                                                        expertise: {
                                                                                            ...prev.expertise,
                                                                                            areas: updatedAreas
                                                                                        }
                                                                                    }));
                                                                                }}
                                                                                variant="destructive"
                                                                                size="sm"
                                                                                className="opacity-0 hover:opacity-100 transition-opacity duration-200 h-6 w-6 p-0"
                                                                            >
                                                                                <Trash2 className="h-3 w-3" />
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="w-full max-w-64 h-40 bg-muted/30 border border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center">
                                                                        <div className="text-center text-muted-foreground">
                                                                            <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mb-2">
                                                                                <Sun className="h-6 w-6 text-muted-foreground/50" />
                                                                            </div>
                                                                            <p className="text-sm font-medium">No Image</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Upload Button */}
                                                            <div className="flex justify-center">
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={async (e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (file) {
                                                                            try {
                                                                                const fileId = await fileUploadService.uploadFile(file);
                                                                                const fileUrl = await fileUploadService.getFileUrl(fileId);

                                                                                const updatedAreas = [...content.expertise.areas];
                                                                                updatedAreas[index] = {
                                                                                    ...updatedAreas[index],
                                                                                    image: fileUrl,
                                                                                    image_id: fileId
                                                                                };

                                                                                setContent(prev => ({
                                                                                    ...prev,
                                                                                    expertise: {
                                                                                        ...prev.expertise,
                                                                                        areas: updatedAreas
                                                                                    }
                                                                                }));

                                                                                toast({
                                                                                    title: "Success",
                                                                                    description: "Image uploaded successfully",
                                                                                });
                                                                            } catch (error) {
                                                                                console.error('Error uploading image:', error);
                                                                                toast({
                                                                                    title: "Error",
                                                                                    description: "Failed to upload image",
                                                                                    variant: "destructive"
                                                                                });
                                                                            }
                                                                        }
                                                                    }}
                                                                    className="hidden"
                                                                    id={`expertise-image-${index}`}
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    onClick={() => document.getElementById(`expertise-image-${index}`)?.click()}
                                                                    size="sm"
                                                                    className="px-4 py-1.5 border border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                                                                >
                                                                    <div className="flex items-center gap-1.5">
                                                                        {area.image ? (
                                                                            <>
                                                                                <Edit className="h-4 w-4" />
                                                                                <span className="text-sm">Change</span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Plus className="h-4 w-4" />
                                                                                <span className="text-sm">Upload</span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {/* Right Column - Compact Details Section */}
                                                        <div className="space-y-4">
                                                            {/* Title Section */}
                                                            <div>
                                                                <Label className="text-sm font-medium text-muted-foreground mb-2 block">Area Title</Label>
                                                                <Input
                                                                    value={area.title}
                                                                    onChange={(e) => {
                                                                        const updatedAreas = [...content.expertise.areas];
                                                                        updatedAreas[index] = {
                                                                            ...updatedAreas[index],
                                                                            title: e.target.value
                                                                        };
                                                                        setContent(prev => ({
                                                                            ...prev,
                                                                            expertise: {
                                                                                ...prev.expertise,
                                                                                areas: updatedAreas
                                                                            }
                                                                        }));
                                                                    }}
                                                                    placeholder="Enter expertise area title"
                                                                    className="text-lg font-semibold border border-transparent hover:border-border focus:border-primary transition-colors duration-200 px-3 py-2 h-auto bg-transparent hover:bg-muted/30 focus:bg-background"
                                                                />
                                                            </div>

                                                            {/* Icon Section */}
                                                            <div>
                                                                <Label className="text-sm font-medium text-muted-foreground mb-2 block">Icon</Label>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                                        <IconComponent className="h-5 w-5 text-primary" />
                                                                    </div>
                                                                    <Select
                                                                        value={area.icon}
                                                                        onValueChange={(value) => {
                                                                            const updatedAreas = [...content.expertise.areas];
                                                                            updatedAreas[index] = {
                                                                                ...updatedAreas[index],
                                                                                icon: value
                                                                            };
                                                                            setContent(prev => ({
                                                                                ...prev,
                                                                                expertise: {
                                                                                    ...prev.expertise,
                                                                                    areas: updatedAreas
                                                                                }
                                                                            }));
                                                                        }}
                                                                    >
                                                                        <SelectTrigger className="flex-1 h-9">
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {AVAILABLE_ICONS.map((iconOption) => (
                                                                                <SelectItem key={iconOption.value} value={iconOption.value}>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <iconOption.icon className="h-4 w-4" />
                                                                                        {iconOption.label}
                                                                                    </div>
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </div>

                                                            {/* Description Section */}
                                                            <div>
                                                                <Label className="text-sm font-medium text-muted-foreground mb-2 block">Description</Label>
                                                                <Textarea
                                                                    value={area.description}
                                                                    onChange={(e) => {
                                                                        const updatedAreas = [...content.expertise.areas];
                                                                        updatedAreas[index] = {
                                                                            ...updatedAreas[index],
                                                                            description: e.target.value
                                                                        };
                                                                        setContent(prev => ({
                                                                            ...prev,
                                                                            expertise: {
                                                                                ...prev.expertise,
                                                                                areas: updatedAreas
                                                                            }
                                                                        }));
                                                                    }}
                                                                    placeholder="Enter expertise area description"
                                                                    rows={3}
                                                                    className="resize-none"
                                                                />
                                                            </div>

                                                            {/* Delete Button */}
                                                            <div className="flex justify-end pt-1">
                                                                <Button
                                                                    onClick={() => {
                                                                        const updatedAreas = content.expertise.areas.filter((_, i) => i !== index);
                                                                        // Reorder remaining areas
                                                                        const reorderedAreas = updatedAreas.map((a, i) => ({
                                                                            ...a,
                                                                            order_index: i
                                                                        }));
                                                                        setContent(prev => ({
                                                                            ...prev,
                                                                            expertise: {
                                                                                ...prev.expertise,
                                                                                areas: reorderedAreas
                                                                            }
                                                                        }));
                                                                    }}
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    className="h-8 px-3 text-xs"
                                                                >
                                                                    <Trash2 className="h-3 w-3 mr-1.5" />
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}

                            {content.expertise.areas.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                    <p>No expertise areas added yet.</p>
                                    <p className="text-sm">Click "Add Expertise Area" to create your first expertise area.</p>
                                </div>
                            )}

                            {/* Section Save Button */}
                            <div className="flex justify-end pt-4 border-t">
                                <Button
                                    onClick={() => handleSave()}
                                    size="sm"
                                    className="px-6"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Expertise Section
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                )}
            </Card>

            <Card>
                <CardHeader
                    className="cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                    onClick={() => toggleSection('benefits')}
                >
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            {expandedSections.benefits ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                            Benefits
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                            {content.benefits.title ? `${content.benefits.items.length} items` : 'Not Set'}
                        </Badge>
                    </div>
                </CardHeader>
                {expandedSections.benefits && (
                    <CardContent>
                        <div className="space-y-6">
                            {/* Benefits Title */}
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground mb-2 block">Section Title</Label>
                                <Input
                                    value={content.benefits.title}
                                    onChange={(e) => setContent(prev => ({
                                        ...prev,
                                        benefits: { ...prev.benefits, title: e.target.value }
                                    }))}
                                    placeholder="Enter benefits section title"
                                    className="text-lg font-semibold border border-transparent hover:border-border focus:border-primary transition-colors duration-200 px-3 py-2 h-auto bg-transparent hover:bg-muted/30 focus:bg-background"
                                />
                            </div>

                            {/* Benefits Management */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <Label className="text-base font-semibold">Benefit Items</Label>
                                    <Button
                                        onClick={() => {
                                            const newBenefit: Benefit = {
                                                text: '',
                                                order_index: content.benefits.items.length
                                            };
                                            setContent(prev => ({
                                                ...prev,
                                                benefits: {
                                                    ...prev.benefits,
                                                    items: [...prev.benefits.items, newBenefit]
                                                }
                                            }));
                                        }}
                                        size="sm"
                                        className="flex items-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Benefit
                                    </Button>
                                </div>

                                {content.benefits.items.length > 0 && (
                                    <div className="space-y-2">
                                        {content.benefits.items.map((benefit, index) => (
                                            <Card key={index} className="border hover:shadow-sm transition-shadow duration-200">
                                                <CardContent className="p-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                                                                <span className="text-xs font-semibold text-primary">
                                                                    {index + 1}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <Input
                                                                value={benefit.text}
                                                                onChange={(e) => {
                                                                    const updatedItems = [...content.benefits.items];
                                                                    updatedItems[index] = {
                                                                        ...updatedItems[index],
                                                                        text: e.target.value
                                                                    };
                                                                    setContent(prev => ({
                                                                        ...prev,
                                                                        benefits: {
                                                                            ...prev.benefits,
                                                                            items: updatedItems
                                                                        }
                                                                    }));
                                                                }}
                                                                placeholder="Enter benefit (one sentence)"
                                                                className="border-0 px-0 py-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent hover:bg-muted/30 focus:bg-background rounded-none"
                                                            />
                                                        </div>
                                                        <Button
                                                            onClick={() => {
                                                                const updatedItems = content.benefits.items.filter((_, i) => i !== index);
                                                                // Reorder remaining items
                                                                const reorderedItems = updatedItems.map((item, i) => ({
                                                                    ...item,
                                                                    order_index: i
                                                                }));
                                                                setContent(prev => ({
                                                                    ...prev,
                                                                    benefits: {
                                                                        ...prev.benefits,
                                                                        items: reorderedItems
                                                                    }
                                                                }));
                                                            }}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}

                                {content.benefits.items.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                        <p>No benefit items added yet.</p>
                                        <p className="text-sm">Click "Add Benefit" to create your first benefit item.</p>
                                    </div>
                                )}
                            </div>

                            {/* Section Save Button */}
                            <div className="flex justify-end pt-4 border-t">
                                <Button
                                    onClick={() => handleSave()}
                                    size="sm"
                                    className="px-6"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Benefits Section
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                )}
            </Card>

            <Card>
                <CardHeader
                    className="cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                    onClick={() => toggleSection('impact')}
                >
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            {expandedSections.impact ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                            Environmental Impact
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                            {content.impact.title ? `${content.impact.stats.length} stats` : 'Not Set'}
                        </Badge>
                    </div>
                </CardHeader>
                {expandedSections.impact && (
                    <CardContent>
                        <div className="mb-4">
                            <Label>Title</Label>
                            <Input
                                value={content.impact.title}
                                onChange={(e) => setContent(prev => ({
                                    ...prev,
                                    impact: { ...prev.impact, title: e.target.value }
                                }))}
                                placeholder="Enter impact title"
                            />
                        </div>
                        <div className="mb-4">
                            <Label>Description</Label>
                            <Textarea
                                value={content.impact.description}
                                onChange={(e) => setContent(prev => ({
                                    ...prev,
                                    impact: { ...prev.impact, description: e.target.value }
                                }))}
                                placeholder="Enter impact description"
                            />
                        </div>

                        {/* Section Save Button */}
                        <div className="flex justify-end pt-4 border-t">
                            <Button
                                onClick={() => handleSave()}
                                size="sm"
                                className="px-6"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                Save Impact Section
                            </Button>
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
};
