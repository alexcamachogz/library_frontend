import { type Book } from '../../types/book';
import { BookCard } from './BookCard';
import { Skeleton } from '../ui/skeleton';

interface BookGridProps {
    books: Book[];
    isLoading?: boolean;
    onStatusChange: (isbn: string, status: "read" | "unread" | "in_progress") => Promise<void>;
    onView: (book: Book) => void;
    onEdit: (book: Book) => void;
    onDelete: (isbn: string) => Promise<void>;
    isAuthenticated: boolean;
}

export function BookGrid({
                             books,
                             isLoading,
                             onStatusChange,
                             onView,
                             onEdit,
                             onDelete,
                             isAuthenticated
                         }: BookGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="aspect-[2/3] w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                ))}
            </div>
        );
    }

    if (books.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="mx-auto max-w-sm">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                        📚
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No hay libros</h3>
                    <p className="text-muted-foreground">
                        {isAuthenticated
                            ? "No se encontraron libros con los criterios de búsqueda actuales."
                            : "Sign in to view and manage your personal book collection."
                        }
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {books.map((book) => (
                <BookCard
                    key={book._id}
                    book={book}
                    onStatusChange={onStatusChange}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isAuthenticated={isAuthenticated}
                />
            ))}
        </div>
    );
}