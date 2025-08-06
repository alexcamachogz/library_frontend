import { type Book } from '../../types/book';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { BookOpen, Calendar, Globe, Building, Hash } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface BookDetailDialogProps {
    book: Book | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit: (book: Book) => void;
    isAuthenticated: boolean;
}

export function BookDetailDialog({
                                     book,
                                     open,
                                     onOpenChange,
                                     onEdit,
                                     isAuthenticated
                                 }: BookDetailDialogProps) {
    if (!book) return null;

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const handleEdit = () => {
        if (!isAuthenticated) return;
        onEdit(book);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="sr-only">Detalles del libro</DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh]">
                    <div className="space-y-6">
                        {/* Header with cover and basic info */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-32">
                                {book.cover_image ? (
                                    <img
                                        src={book.cover_image}
                                        alt={`Cover of ${book.title}`}
                                        className="w-full aspect-[2/3] object-cover rounded-md"
                                    />
                                ) : (
                                    <div className="w-full aspect-[2/3] bg-muted rounded-md flex items-center justify-center">
                                        <BookOpen className="h-12 w-12 text-muted-foreground" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 space-y-3">
                                <div>
                                    <h2 className="text-xl font-bold leading-tight">{book.title}</h2>
                                    <p className="text-muted-foreground mt-1">
                                        {book.authors.join(', ')}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Badge variant={book.reading_status === 'read' ? 'default' : 'secondary'}>
                                        {book.reading_status === 'read' ? 'Leído' : 'No leído'}
                                    </Badge>
                                </div>

                                {/* Edit Button - Conditional */}
                                {isAuthenticated ? (
                                    <Button onClick={handleEdit} className="w-full">
                                        Editar Libro
                                    </Button>
                                ) : (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div>
                                                <Button
                                                    disabled
                                                    className="w-full"
                                                    variant="outline"
                                                >
                                                    Editar Libro
                                                </Button>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Sign in to edit books</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* Categories */}
                        {book.categories.length > 0 && (
                            <div>
                                <h3 className="font-semibold mb-2">Categorías</h3>
                                <div className="flex flex-wrap gap-2">
                                    {book.categories.map((category) => (
                                        <Badge key={category} variant="outline">
                                            {category}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        {book.description && (
                            <div>
                                <h3 className="font-semibold mb-2">Descripción</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {book.description}
                                </p>
                            </div>
                        )}

                        <Separator />

                        {/* Details */}
                        <div className="space-y-3">
                            <h3 className="font-semibold">Información del libro</h3>
                            <div className="grid grid-cols-1 gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <Hash className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">ISBN:</span>
                                    <span>{book.isbn}</span>
                                </div>

                                {book.publisher && (
                                    <div className="flex items-center gap-2">
                                        <Building className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Editorial:</span>
                                        <span>{book.publisher}</span>
                                    </div>
                                )}

                                {book.published_date && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Fecha de publicación:</span>
                                        <span>{formatDate(book.published_date)}</span>
                                    </div>
                                )}

                                {book.page_count && (
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Páginas:</span>
                                        <span>{book.page_count}</span>
                                    </div>
                                )}

                                {book.language && (
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Idioma:</span>
                                        <span>{book.language}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}