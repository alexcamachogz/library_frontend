import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Loader2, X, Plus } from 'lucide-react';
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
                title: "Libro actualizado",
                description: "Los cambios se han guardado exitosamente",
            });
            onOpenChange(false);
            onBookUpdated();
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "No se pudo actualizar el libro",
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
                    <DialogTitle>Editar Libro</DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh] pr-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Título</Label>
                            <Input
                                id="title"
                                value={formData.title || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                required
                            />
                        </div>

                        {/* Authors */}
                        <div className="space-y-2">
                            <Label>Autores</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Agregar autor..."
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
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                value={formData.description || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={4}
                            />
                        </div>

                        {/* Categories */}
                        <div className="space-y-2">
                            <Label>Categorías</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Agregar categoría..."
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
                                <Label htmlFor="publisher">Editorial</Label>
                                <Input
                                    id="publisher"
                                    value={formData.publisher || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, publisher: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pages">Páginas</Label>
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
                                <Label htmlFor="published_date">Fecha de publicación</Label>
                                <Input
                                    id="published_date"
                                    type="date"
                                    value={formData.published_date?.split('T')[0] || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, published_date: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="language">Idioma</Label>
                                <Input
                                    id="language"
                                    value={formData.language || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* Reading Status */}
                        <div className="space-y-2">
                            <Label>Estado de lectura</Label>
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
                                    <SelectItem value="unread">No leído</SelectItem>
                                    <SelectItem value="read">Leído</SelectItem>
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
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                Guardar Cambios
                            </Button>
                        </div>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}