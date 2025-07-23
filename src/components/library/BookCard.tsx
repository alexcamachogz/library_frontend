import { type Book } from '../../types/book';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { BookOpen, BookOpenCheck, Eye, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface BookCardProps {
    book: Book;
    onStatusChange: (isbn: string, status: "read" | "unread") => Promise<void>;
    onView: (book: Book) => void;
    onEdit: (book: Book) => void;
    onDelete: (isbn: string) => Promise<void>;
}

export function BookCard({ book, onStatusChange, onView, onEdit, onDelete }: BookCardProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleStatusToggle = async () => {
        setIsUpdating(true);
        try {
            const newStatus = book.reading_status === "read" ? "unread" : "read";
            await onStatusChange(book.isbn, newStatus);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete(book.isbn);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
            <CardContent className="flex-1 p-4">
                {/* Cover Image */}
                <div className="aspect-[2/3] mb-3 overflow-hidden rounded-md bg-muted">
                    {book.cover_image ? (
                        <img
                            src={book.cover_image}
                            alt={`Cover of ${book.title}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="h-16 w-16 text-muted-foreground" />
                        </div>
                    )}
                </div>

                {/* Book Info */}
                <div className="space-y-2">
                    <h3 className="font-semibold line-clamp-2 text-sm" title={book.title}>
                        {book.title}
                    </h3>

                    <p className="text-xs text-muted-foreground line-clamp-1">
                        {book.authors.join(', ')}
                    </p>

                    {book.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {book.categories.slice(0, 2).map((category) => (
                                <Badge key={category} variant="secondary" className="text-xs">
                                    {category}
                                </Badge>
                            ))}
                            {book.categories.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                    +{book.categories.length - 2}
                                </Badge>
                            )}
                        </div>
                    )}

                    {book.page_count && (
                        <p className="text-xs text-muted-foreground">
                            {book.page_count} páginas
                        </p>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <div className="w-full space-y-2">
                    {/* Reading Status Toggle */}
                    <Button
                        variant={book.reading_status === "read" ? "default" : "outline"}
                        size="sm"
                        className="w-full"
                        onClick={handleStatusToggle}
                        disabled={isUpdating}
                    >
                        {book.reading_status === "read" ? (
                            <>
                                <BookOpenCheck className="h-4 w-4 mr-2" />
                                Leído
                            </>
                        ) : (
                            <>
                                <BookOpen className="h-4 w-4 mr-2" />
                                No leído
                            </>
                        )}
                    </Button>

                    {/* Action Buttons - New row */}
                    <div className="flex gap-1 w-full">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1"
                            onClick={() => onView(book)}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1"
                            onClick={() => onEdit(book)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}