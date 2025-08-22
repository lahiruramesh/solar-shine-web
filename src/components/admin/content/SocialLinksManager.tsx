import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Globe, Save, Loader2, X } from 'lucide-react';
import { SocialLink } from '@/types/payload-types';

// Mock data for now - you'll need to implement the actual service
const mockSocialLinks: SocialLink[] = [
    { $id: '1', name: 'Facebook', icon: 'facebook', url: 'https://facebook.com/solarshine' },
    { $id: '2', name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com/company/solarshine' },
    { $id: '3', name: 'Twitter', icon: 'twitter', url: 'https://twitter.com/solarshine' },
    { $id: '4', name: 'Instagram', icon: 'instagram', url: 'https://instagram.com/solarshine' },
];

interface SocialLinkFormData {
    name: string;
    icon: string;
    url: string;
}

export const SocialLinksManager: React.FC = () => {
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>(mockSocialLinks);
    const [isAdding, setIsAdding] = useState(false);
    const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
    const [formData, setFormData] = useState<SocialLinkFormData>({
        name: '',
        icon: '',
        url: ''
    });

    const handleAddLink = () => {
        if (!formData.name || !formData.icon || !formData.url) {
            toast.error('Please fill in all fields');
            return;
        }

        const newLink: SocialLink = {
            $id: Date.now().toString(),
            name: formData.name,
            icon: formData.icon,
            url: formData.url
        };

        setSocialLinks(prev => [...prev, newLink]);
        setFormData({ name: '', icon: '', url: '' });
        setIsAdding(false);
        toast.success('Social link added successfully!');
    };

    const handleEditLink = () => {
        if (!editingLink || !formData.name || !formData.icon || !formData.url) {
            toast.error('Please fill in all fields');
            return;
        }

        const updatedLink: SocialLink = {
            ...editingLink,
            name: formData.name,
            icon: formData.icon,
            url: formData.url
        };

        setSocialLinks(prev => prev.map(link =>
            link.$id === editingLink.$id ? updatedLink : link
        ));

        setEditingLink(null);
        setFormData({ name: '', icon: '', url: '' });
        toast.success('Social link updated successfully!');
    };

    const handleDeleteLink = (id: string) => {
        setSocialLinks(prev => prev.filter(link => link.$id !== id));
        toast.success('Social link deleted successfully!');
    };

    const handleEdit = (link: SocialLink) => {
        setEditingLink(link);
        setFormData({
            name: link.name,
            icon: link.icon,
            url: link.url
        });
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingLink(null);
        setFormData({ name: '', icon: '', url: '' });
    };

    const getIconComponent = (iconName: string) => {
        const iconMap: { [key: string]: string } = {
            facebook: '📘',
            twitter: '🐦',
            linkedin: '💼',
            instagram: '📷',
            youtube: '📺',
            tiktok: '🎵',
            pinterest: '📌',
            snapchat: '👻'
        };
        return iconMap[iconName] || '🔗';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Social Media Links</h2>
                    <p className="text-gray-600">Manage your social media profiles and external links</p>
                </div>
                <Dialog open={isAdding} onOpenChange={setIsAdding}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Social Link
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Social Media Link</DialogTitle>
                            <DialogDescription>
                                Add a new social media profile or external link
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Platform Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Facebook, LinkedIn, etc."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="icon">Icon Identifier</Label>
                                <Input
                                    id="icon"
                                    value={formData.icon}
                                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                                    placeholder="facebook, linkedin, twitter"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="url">Profile URL</Label>
                                <Input
                                    id="url"
                                    value={formData.url}
                                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                                    placeholder="https://facebook.com/yourpage"
                                    type="url"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddLink}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Link
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Social Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {socialLinks.map((link) => (
                    <Card key={link.$id} className="relative group">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="text-2xl">{getIconComponent(link.icon)}</span>
                                    <CardTitle className="text-lg">{link.name}</CardTitle>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEdit(link)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteLink(link.$id)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Globe className="h-4 w-4 text-gray-500" />
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 text-sm truncate"
                                    >
                                        {link.url}
                                    </a>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                    {link.icon}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {socialLinks.length === 0 && (
                <Card className="text-center py-12">
                    <CardContent>
                        <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No social links yet</h3>
                        <p className="text-gray-600 mb-4">
                            Add your social media profiles to help customers connect with you
                        </p>
                        <Button onClick={() => setIsAdding(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Your First Link
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Edit Dialog */}
            <Dialog open={!!editingLink} onOpenChange={() => setEditingLink(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Social Media Link</DialogTitle>
                        <DialogDescription>
                            Update the details for this social media link
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Platform Name</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Facebook, LinkedIn, etc."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-icon">Icon Identifier</Label>
                            <Input
                                id="edit-icon"
                                value={formData.icon}
                                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                                placeholder="facebook, linkedin, twitter"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-url">Profile URL</Label>
                            <Input
                                id="edit-url"
                                value={formData.url}
                                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                                placeholder="https://facebook.com/yourpage"
                                type="url"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditLink}>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Help Section */}
            <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                    <CardTitle className="text-blue-900">💡 Tips for Social Media Links</CardTitle>
                </CardHeader>
                <CardContent className="text-blue-800">
                    <ul className="space-y-2 text-sm">
                        <li>• Use consistent naming for your social media platforms</li>
                        <li>• Ensure all URLs are complete and accessible</li>
                        <li>• Keep icon identifiers simple (e.g., "facebook", "linkedin")</li>
                        <li>• Test all links to make sure they work correctly</li>
                        <li>• Update links when you change social media handles</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};
