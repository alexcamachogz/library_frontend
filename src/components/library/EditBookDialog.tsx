import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Loader2, X, Plus, Upload } from 'lucide-react';
import { type Book } from '../../types/book';
import { libraryAPI } from '../../services/api';
import { useToast } from '../../hooks/use-toast';

interface EditBookDialogProps {
    book: Book | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onBookUpdated: () => void;
}

export function EditBookDialog({ book, open, onOpenChange, onBookUpdated }: EditBookDialogProps) {
    const [formData, setFormData] = useState<Partial<Book>>({});
    const [newAuthor, setNewAuthor] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title,
                authors: book.authors,
                description: book.description,
                categories: book.categories,
                page_count: book.page_count,
                publisher: book.publisher,
                published_date: book.published_date,
                language: book.language,
                reading_status: book.reading_status,
                cover_image: book.cover_image,
            });
        }
    }, [book]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!book) return;

        setIsLoading(true);
        try {
            await libraryAPI.updateBook(book.isbn, formData);
            toast({
                title: "Book updated",
                description: "Changes have been saved successfully",
            });
            onOpenChange(false);
            onBookUpdated();
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Could not update book",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const addAuthor = () => {
        if (newAuthor.trim() && formData.authors) {
            setFormData(prev => ({
                ...prev,
                authors: [...(prev.authors || []), newAuthor.trim()]
            }));
            setNewAuthor('');
        }
    };

    const removeAuthor = (index: number) => {
        setFormData(prev => ({
            ...prev,
            authors: prev.authors?.filter((_, i) => i !== index)
        }));
    };

    const addCategory = () => {
        if (newCategory.trim() && formData.categories) {
            setFormData(prev => ({
                ...prev,
                categories: [...(prev.categories || []), newCategory.trim()]
            }));
            setNewCategory('');
        }
    };

    const removeCategory = (index: number) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories?.filter((_, i) => i !== index)
        }));
    };

    if (!book) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Edit Book</DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh] pr-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={formData.title || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                required
                            />
                        </div>

                        {/* Authors */}
                        <div className="space-y-2">
                            <Label>Authors</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add author..."
                                    value={newAuthor}
                                    onChange={(e) => setNewAuthor(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAuthor())}
                                />
                                <Button type="button" onClick={addAuthor} size="sm">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.authors?.map((author, index) => (
                                    <Badge key={index} variant="secondary" className="gap-1">
                                        {author}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => removeAuthor(index)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={4}
                            />
                        </div>

                        {/* Cover Image URL */}
                        <div className="space-y-2">
                            <Label htmlFor="cover_image">Cover Image URL</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="cover_image"
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                    value={formData.cover_image || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))}
                                />
                                <Button type="button" variant="outline" size="sm">
                                    <Upload className="h-4 w-4" />
                                </Button>
                            </div>
                            {formData.cover_image && (
                                <div className="mt-2">
                                    <img
                                        src={formData.cover_image}
                                        alt="Cover preview"
                                        className="w-20 h-28 object-cover rounded border"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Categories */}
                        <div className="space-y-2">
                            <Label>Categories</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add category..."
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                                />
                                <Button type="button" onClick={addCategory} size="sm">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.categories?.map((category, index) => (
                                    <Badge key={index} variant="secondary" className="gap-1">
                                        {category}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => removeCategory(index)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Publisher and Pages */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="publisher">Publisher</Label>
                                <Input
                                    id="publisher"
                                    value={formData.publisher || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, publisher: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pages">Pages</Label>
                                <Input
                                    id="pages"
                                    type="number"
                                    value={formData.page_count || ''}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        page_count: e.target.value ? parseInt(e.target.value) : null
                                    }))}
                                />
                            </div>
                        </div>

                        {/* Published Date and Language */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="published_date">Publication Date</Label>
                                <Input
                                    id="published_date"
                                    type="date"
                                    value={formData.published_date?.split('T')[0] || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, published_date: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="language">Language</Label>
                                <Input
                                    id="language"
                                    value={formData.language || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* Reading Status */}
                        <div className="space-y-2">
                            <Label>Reading Status</Label>
                            <Select
                                value={formData.reading_status}
                                onValueChange={(value: "read" | "unread") =>
                                    setFormData(prev => ({ ...prev, reading_status: value }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unread">Unread</SelectItem>
                                    <SelectItem value="read">Read</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}