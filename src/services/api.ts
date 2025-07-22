import type { Book, BooksResponse, BookResponse, StatisticsResponse, SearchFilters } from "../types/book.ts";

const API_BASE_URL = 'http://localhost:5001/api/v1';

class LibraryAPI {
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        const response = await fetch(url, config);

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Network error' }));
            throw new Error(error.message || error.error || 'Something went wrong');
        }

        return response.json();
    }

    // Books CRUD
    async getBooks(limit = 50, skip = 0): Promise<BooksResponse> {
        return this.request<BooksResponse>(`/books/?limit=${limit}&skip=${skip}`);
    }

    async getBook(isbn: string): Promise<BookResponse> {
        return this.request<BookResponse>(`/books/${isbn}`);
    }

    async addBook(isbn: string): Promise<BookResponse> {
        return this.request<BookResponse>('/books/', {
            method: 'POST',
            body: JSON.stringify({ isbn }),
        });
    }

    async updateBook(isbn: string, updates: Partial<Book>): Promise<BookResponse> {
        return this.request<BookResponse>(`/books/${isbn}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    }

    async deleteBook(isbn: string): Promise<{ message: string }> {
        return this.request<{ message: string }>(`/books/${isbn}`, {
            method: 'DELETE',
        });
    }

    // Search
    async searchBooks(filters: SearchFilters, limit = 50, skip = 0): Promise<BooksResponse> {
        const params = new URLSearchParams();

        if (filters.query) params.append('query', filters.query);
        if (filters.title) params.append('title', filters.title);
        if (filters.author) params.append('author', filters.author);
        if (filters.category) params.append('category', filters.category);
        params.append('limit', limit.toString());
        params.append('skip', skip.toString());

        return this.request<BooksResponse>(`/books/search?${params.toString()}`);
    }

    async getBooksByAuthor(author: string, limit = 50, skip = 0): Promise<BooksResponse> {
        return this.request<BooksResponse>(`/books/authors/${encodeURIComponent(author)}?limit=${limit}&skip=${skip}`);
    }

    async getBooksByCategory(category: string, limit = 50, skip = 0): Promise<BooksResponse> {
        return this.request<BooksResponse>(`/books/categories/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`);
    }

    // Reading status
    async updateReadingStatus(isbn: string, status: "read" | "unread"): Promise<{ message: string; isbn: string; reading_status: string }> {
        return this.request(`/books/${isbn}/status`, {
            method: 'PUT',
            body: JSON.stringify({ reading_status: status }),
        });
    }

    async getBooksByStatus(status: "read" | "unread", limit = 50, skip = 0): Promise<BooksResponse> {
        return this.request<BooksResponse>(`/books/status/${status}?limit=${limit}&skip=${skip}`);
    }

    // Statistics
    async getStatistics(): Promise<StatisticsResponse> {
        return this.request<StatisticsResponse>('/books/statistics');
    }
}

export const libraryAPI = new LibraryAPI();