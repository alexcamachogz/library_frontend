import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Book, SearchFilters } from "../types/book.ts";
import { libraryAPI } from '../services/api';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../components/auth/AuthContext';

// Components
import { StatisticsCards } from '../components/library/StatisticsCards';
import { SearchBar } from '../components/library/SearchBar';
import { AddBookDialog } from '../components/library/AddBookDialog';
import { BookGrid } from '../components/library/BookGrid';
import { BookDetailDialog } from '../components/library/BookDetailDialog';
import { EditBookDialog } from '../components/library/EditBookDialog';
import { Button } from '../components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GoogleLoginComponent } from '../components/auth/GoogleLogin';
import { LanguageSelector } from '../components/ui/language-selector';

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
    const { isAuthenticated } = useAuth();
    const { t } = useTranslation();

    // Reset page when search changes
    useEffect(() => {
        setCurrentPage(0);
    }, [searchFilters]);

    // Scroll to top when page changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    // Fetch books
    const { data: booksData, isLoading: booksLoading } = useQuery({
        queryKey: ['books', searchFilters, currentPage],
        queryFn: async () => {
            const skip = currentPage * BOOKS_PER_PAGE;

            // Check if we have search filters (excluding sortBy as it's handled client-side)
            const { sortBy, ...searchOnlyFilters } = searchFilters;
            const hasFilters = Object.values(searchOnlyFilters).some(v => v && v.length > 0);

            if (hasFilters) {
                // If status filter, use status endpoint
                if (searchFilters.status && !searchFilters.query && !searchFilters.title && !searchFilters.author && !searchFilters.category) {
                    return libraryAPI.getBooksByStatus(searchFilters.status, BOOKS_PER_PAGE, skip);
                }
                // Use search endpoint with filters excluding sortBy
                return libraryAPI.searchBooks(searchOnlyFilters, BOOKS_PER_PAGE, skip);
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

    // Apply sorting to books
    const sortBooks = (books: Book[], sortBy: string | undefined) => {
        if (!sortBy || sortBy === 'default') return books;
        
        const sortedBooks = [...books];
        switch (sortBy) {
            case 'title_asc':
                return sortedBooks.sort((a, b) => a.title.localeCompare(b.title, 'es', { numeric: true }));
            case 'title_desc':
                return sortedBooks.sort((a, b) => b.title.localeCompare(a.title, 'es', { numeric: true }));
            default:
                return sortedBooks;
        }
    };

    const books = sortBooks(booksData?.books || [], searchFilters.sortBy);
    const pagination = booksData?.pagination;
    const statistics = statsData?.statistics;

    const handleSearch = (filters: SearchFilters) => {
        setSearchFilters(filters);
    };

    const handleStatusChange = async (isbn: string, status: "read" | "unread" | "in_progress") => {
        if (!isAuthenticated) {
            toast({
                title: t('error'),
                description: t('authRequiredUpdateStatus'),
                variant: "destructive",
            });
            return;
        }

        try {
            await libraryAPI.updateReadingStatus(isbn, status);
            await queryClient.invalidateQueries({queryKey: ['books']});
            await queryClient.invalidateQueries({queryKey: ['statistics']});

            const statusLabels = {
                'read': t('completed'),
                'in_progress': t('reading'),
                'unread': t('toRead')
            };

            toast({
                title: t('success'),
                description: `${t('bookMarkedAs')} ${statusLabels[status]}`,
            });
        } catch (error) {
            toast({
                title: t('error'),
                description: error instanceof Error ? error.message : t('couldNotUpdateStatus'),
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (isbn: string) => {
        if (!isAuthenticated) {
            toast({
                title: t('error'),
                description: t('authRequiredDelete'),
                variant: "destructive",
            });
            return;
        }

        try {
            await libraryAPI.deleteBook(isbn);
            await queryClient.invalidateQueries({queryKey: ['books']});
            await queryClient.invalidateQueries({queryKey: ['statistics']});
            toast({
                title: t('success'),
                description: t('bookDeleted'),
            });
        } catch (error) {
            toast({
                title: t('error'),
                description: error instanceof Error ? error.message : t('couldNotDeleteBook'),
                variant: "destructive",
            });
        }
    };

    const handleView = (book: Book) => {
        setSelectedBook(book);
        setShowDetail(true);
    };

    const handleEdit = (book: Book) => {
        if (!isAuthenticated) {
            toast({
                title: t('error'),
                description: t('authRequiredEdit'),
                variant: "destructive",
            });
            return;
        }

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

    const totalBooks = pagination?.total || pagination?.count || 0;
    const totalPages = pagination?.total_pages || Math.ceil(totalBooks / BOOKS_PER_PAGE);
    const hasNextPage = pagination?.has_next || currentPage < totalPages - 1;
    const hasPrevPage = pagination?.has_prev || currentPage > 0;

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        {/* TODO: Añadir logo biblioteca*/}
                        <h1 className="text-3xl font-bold">{t('library')}</h1>
                        {isAuthenticated && (
                            <p className="text-muted-foreground">
                                {t('libraryDescription')}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <LanguageSelector />
                        <GoogleLoginComponent />
                        {/* Solo mostrar el botón de agregar libro si está autenticado */}
                        {isAuthenticated && (
                            <AddBookDialog onBookAdded={handleBookAdded} />
                        )}
                    </div>
                </div>

                {/* Mensaje de bienvenida para usuarios no autenticados */}
                {!isAuthenticated && (
                    <div className="bg-muted/50 border border-border rounded-lg p-6 mb-6 text-center">
                        <h3 className="text-lg font-semibold mb-2">{t('welcomeToLibrary')}</h3>
                        <p className="text-muted-foreground">
                            {t('welcomeDescription')}
                        </p>
                    </div>
                )}

                {/* Statistics - Solo mostrar si está autenticado */}
                {isAuthenticated && (
                    <StatisticsCards
                        statistics={statistics}
                        isLoading={statsLoading}
                    />
                )}

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
                                {t('page')} {currentPage + 1} {t('of')} {totalPages}
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
                    isAuthenticated={isAuthenticated}
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
                            {t('previous')}
                        </Button>

                        <span className="text-sm text-muted-foreground px-4">
                            {currentPage + 1} / {totalPages}
                        </span>

                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            disabled={!hasNextPage}
                        >
                            {t('next')}
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
                    isAuthenticated={isAuthenticated}
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