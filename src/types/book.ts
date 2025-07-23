export interface Book {
    _id: string;
    isbn: string;
    title: string;
    authors: string[];
    description: string;
    categories: string[];
    page_count: number | null;
    cover_image: string;
    published_date: string;
    publisher: string;
    language: string;
    reading_status: "read" | "unread" | "in_progress";
}

export interface BooksResponse {
    message: string;
    books: Book[];
    pagination: {
        limit: number;
        skip: number;
        count: number;
        total?: number;
        has_next?: boolean;
        has_prev?: boolean;
        page?: number;
        total_pages?: number;
    };
    search_criteria?: {
        query?: string;
        title?: string;
        author?: string;
        category?: string;
        reading_status?: string;
    };
}

export interface BookResponse {
    message: string;
    book: Book;
}

export interface StatisticsResponse {
    message: string;
    statistics: {
        total_books: number;
        read: number;
        unread: number;
        in_progress: number;
        reading_percentage: number;
        progress_percentage: number;
    };
}

export interface ErrorResponse {
    error: string;
    message: string;
}

export interface SearchFilters {
    query?: string;
    title?: string;
    author?: string;
    category?: string;
    status?: "read" | "unread" | "in_progress";
}