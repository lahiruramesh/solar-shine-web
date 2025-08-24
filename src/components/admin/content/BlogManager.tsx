import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  fetchBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  uploadBlogImage
} from '@/services/blogService';
import type { BlogPost } from '@/types/payload-types';
import { Loader2, Plus, Edit, Trash2, Save, Calendar } from 'lucide-react';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { useAuth } from '@/contexts/AuthContext';

export const BlogManager: React.FC = () => {
  const { isAdmin, isLoading: isAuthLoading } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);



  const [formData, setFormData] = useState<Partial<Omit<BlogPost, '$id' | 'featured_image'>>>({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    publishDate: '',
    featured_image_id: '',
    slug: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadPosts();
  }, []);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.slug?.trim()) {
      errors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await fetchBlogPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error loading blog posts:', error);
      toast.error(`Failed to load blog posts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleOpenDialog = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        excerpt: post.excerpt || '',
        content: post.content || '',
        author: post.author || '',
        publishDate: post.publishDate ? new Date(post.publishDate).toISOString().split('T')[0] : '',
        featured_image_id: post.featured_image_id || '',
        slug: post.slug
      });
      setImagePreview(post.featured_image || null);
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        author: '',
        publishDate: new Date().toISOString().split('T')[0],
        featured_image_id: '',
        slug: ''
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPost(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      publishDate: '',
      featured_image_id: '',
      slug: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setFormErrors({});
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      let imageId: string | undefined | null = editingPost?.featured_image_id || null;

      if (imageFile) {
        setUploading(true);
        try {
          imageId = await uploadBlogImage(imageFile);
        } catch (imageError) {
          console.error('Failed to upload image:', imageError);
          toast.error("Failed to upload image");
          return;
        } finally {
          setUploading(false);
        }
      }

      const postData: Partial<Omit<BlogPost, '$id' | 'featured_image'>> = {
        ...formData,
        featured_image_id: imageId,
        publishDate: formData.publishDate ? new Date(formData.publishDate).toISOString() : new Date().toISOString(),
      };

      if (editingPost) {
        const success = await updateBlogPost(editingPost.$id, postData);
        if (success) {
          toast.success("Blog post updated successfully");
        } else {
          toast.error("Failed to update blog post");
          return;
        }
      } else {
        const postId = await createBlogPost(postData);
        if (postId) {
          toast.success("Blog post created successfully");
        } else {
          toast.error("Failed to create blog post");
          return;
        }
      }

      await loadPosts();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast.error(`Failed to save blog post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;

    try {
      await deleteBlogPost(id);
      toast.success("Blog post deleted successfully");
      await loadPosts();
    } catch (error) {
      toast.error("Failed to delete blog post");
    }
  };

  const getStatusBadge = (post: BlogPost) => {
    const date = post.publishDate ? new Date(post.publishDate) : null;
    const isPublished = date && date <= new Date();

    return (
      <Badge variant={isPublished ? 'default' : 'secondary'}>
        {isPublished ? 'Published' : 'Draft'}
      </Badge>
    );
  };

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading authentication...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground">You need admin privileges to access this section.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading blog posts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Blog Posts
          </h2>
          <p className="text-muted-foreground">
            Manage your blog content and publications
          </p>
          <div className="mt-2 text-xs text-muted-foreground">
            DB: {DATABASE_ID} | Collection: {COLLECTIONS.BLOG_POSTS}
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) {
            handleCloseDialog();
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Post
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col p-0">
            <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4">
              <DialogTitle className="text-xl font-semibold">
                {editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {editingPost ? 'Update the blog post details below.' : 'Fill in the details for the new blog post below.'}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto space-y-6 py-4 px-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value, slug: generateSlug(e.target.value) }))}
                  placeholder="Enter post title"
                  className="w-full"
                />
                {formErrors.title && <p className="text-xs text-red-500">{formErrors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" className="text-sm font-medium">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="post-slug"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">URL-friendly version of the title</p>
                {formErrors.slug && <p className="text-xs text-red-500">{formErrors.slug}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt" className="text-sm font-medium">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Short summary of the post"
                  rows={3}
                  className="w-full resize-none"
                />
                <p className="text-xs text-muted-foreground">Brief description that appears in previews</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Main content of the blog post"
                  rows={8}
                  className="min-h-[200px] w-full resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author" className="text-sm font-medium">Author</Label>
                  <Input
                    id="author"
                    value={formData.author || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Author name"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publishDate" className="text-sm font-medium">Publish Date</Label>
                  <Input
                    id="publishDate"
                    type="date"
                    value={formData.publishDate ? new Date(formData.publishDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, publishDate: e.target.value }))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="featured_image" className="text-sm font-medium">Featured Image</Label>
                <Input
                  id="featured_image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
                {uploading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading image...
                  </div>
                )}
                {imagePreview && (
                  <div className="mt-2">
                    <img src={imagePreview} alt="Preview" className="h-32 w-auto rounded-md border" />
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Recommended size: 1200x630px for optimal display</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-6 pb-6 px-6 border-t bg-background flex-shrink-0">
              <Button
                variant="outline"
                onClick={handleCloseDialog}
                className="min-w-[80px]"
                disabled={saving || uploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || uploading}
                className="min-w-[120px]"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {editingPost ? 'Update Post' : 'Create Post'}
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
          <CardDescription>
            {posts.length} post{posts.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Excerpt</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.$id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    <div className="max-w-xs text-sm text-muted-foreground truncate">
                      {post.excerpt}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(post)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(post)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(post.$id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {posts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <p>No blog posts found.</p>
              <p>Click "Add Post" to create your first blog post.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
