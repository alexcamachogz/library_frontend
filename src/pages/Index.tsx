import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Book, SearchFilters } from "../types/book.ts";
import { libraryAPI } from '../services/api';
import { useToast } from '../hooks/use-toast';

// Components
import { StatisticsCards } from '../components/library/StatisticsCards';
import { SearchBar } from '../components/library/SearchBar';
import { AddBookDialog } from '../components/library/AddBookDialog';
import { BookGrid } from '../components/library/BookGrid';
import { BookDetailDialog } from '../components/library/BookDetailDialog';
import { EditBookDialog } from '../components/library/EditBookDialog';
import { Button } from '../components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BOOKS_PER_PAGE = 20;

const Index = () => {
    const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [showDetail, setShowDetail] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Reset page when search changes
    useEffect(() => {
        setCurrentPage(0);
    }, [searchFilters]);

    // Fetch books
    const { data: booksData, isLoading: booksLoading } = useQuery({
        queryKey: ['books', searchFilters, currentPage],
        queryFn: async () => {
            const skip = currentPage * BOOKS_PER_PAGE;

            // Check if we have search filters
            const hasFilters = Object.values(searchFilters).some(v => v && v.length > 0);

            if (hasFilters) {
                // If status filter, use status endpoint
                if (searchFilters.status && !searchFilters.query && !searchFilters.title && !searchFilters.author && !searchFilters.category) {
                    return libraryAPI.getBooksByStatus(searchFilters.status, BOOKS_PER_PAGE, skip);
                }
                // Use search endpoint
                return libraryAPI.searchBooks(searchFilters, BOOKS_PER_PAGE, skip);
            }

            // Default: get all books
            return libraryAPI.getBooks(BOOKS_PER_PAGE, skip);
        },
    });

    // Fetch statistics
    const { data: statsData, isLoading: statsLoading } = useQuery({
        queryKey: ['statistics'],
        queryFn: () => libraryAPI.getStatistics(),
    });

    const books = booksData?.books || [];
    const pagination = booksData?.pagination;
    const statistics = statsData?.statistics;

    const handleSearch = (filters: SearchFilters) => {
        setSearchFilters(filters);
    };

    const handleStatusChange = async (isbn: string, status: "read" | "unread") => {
        try {
            await libraryAPI.updateReadingStatus(isbn, status);
            queryClient.invalidateQueries({ queryKey: ['books'] });
            queryClient.invalidateQueries({ queryKey: ['statistics'] });
            toast({
                title: "Estado actualizado",
                description: `Libro marcado como ${status === 'read' ? 'leído' : 'no leído'}`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "No se pudo actualizar el estado",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (isbn: string) => {
        try {
            await libraryAPI.deleteBook(isbn);
            queryClient.invalidateQueries({ queryKey: ['books'] });
            queryClient.invalidateQueries({ queryKey: ['statistics'] });
            toast({
                title: "Libro eliminado",
                description: "El libro ha sido eliminado de tu biblioteca",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "No se pudo eliminar el libro",
                variant: "destructive",
            });
        }
    };

    const handleView = (book: Book) => {
        setSelectedBook(book);
        setShowDetail(true);
    };

    const handleEdit = (book: Book) => {
        setEditingBook(book);
        setShowEdit(true);
    };

    const handleBookAdded = () => {
        queryClient.invalidateQueries({ queryKey: ['books'] });
        queryClient.invalidateQueries({ queryKey: ['statistics'] });
    };

    const handleBookUpdated = () => {
        queryClient.invalidateQueries({ queryKey: ['books'] });
        queryClient.invalidateQueries({ queryKey: ['statistics'] });
    };

    const totalBooks = pagination?.count || 0;
    const totalPages = Math.ceil(totalBooks / BOOKS_PER_PAGE);
    const hasNextPage = currentPage < totalPages - 1;
    const hasPrevPage = currentPage > 0;

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Mi biblioteca</h1>
                        <p className="text-muted-foreground">
                            Una pequeña colección de libros
                        </p>
                    </div>
                    <AddBookDialog onBookAdded={handleBookAdded} />
                </div>

                {/* Statistics */}
                <StatisticsCards
                    statistics={statistics}
                    isLoading={statsLoading}
                />

                {/* Search */}
                <div className="mb-6">
                    <SearchBar
                        onSearch={handleSearch}
                        isLoading={booksLoading}
                    />
                </div>

                {/* Results info */}
                {booksData && (
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-muted-foreground">
                            {booksData.message}
                        </p>
                        {totalPages > 1 && (
                            <p className="text-sm text-muted-foreground">
                                Página {currentPage + 1} de {totalPages}
                            </p>
                        )}
                    </div>
                )}

                {/* Books Grid */}
                <BookGrid
                    books={books}
                    isLoading={booksLoading}
                    onStatusChange={handleStatusChange}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            disabled={!hasPrevPage}
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Anterior
                        </Button>

                        <span className="text-sm text-muted-foreground px-4">
              {currentPage + 1} / {totalPages}
            </span>

                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            disabled={!hasNextPage}
                        >
                            Siguiente
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                )}

                {/* Dialogs */}
                <BookDetailDialog
                    book={selectedBook}
                    open={showDetail}
                    onOpenChange={setShowDetail}
                    onEdit={handleEdit}
                />

                <EditBookDialog
                    book={editingBook}
                    open={showEdit}
                    onOpenChange={setShowEdit}
                    onBookUpdated={handleBookUpdated}
                />
            </div>
        </div>
    );
};

export default Index;