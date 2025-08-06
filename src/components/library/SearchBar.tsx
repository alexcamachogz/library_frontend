import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Search, X, Filter } from 'lucide-react';
import { type SearchFilters } from '../../types/book';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Label } from '../ui/label';

interface SearchBarProps {
    onSearch: (filters: SearchFilters) => void;
    isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
    const [filters, setFilters] = useState<SearchFilters>({});
    const [showAdvanced, setShowAdvanced] = useState(false);
    const { t } = useTranslation();

    const handleSearch = () => {
        onSearch(filters);
        setShowAdvanced(false); // Close popover after searching
    };

    const handleClear = () => {
        setFilters({});
        onSearch({});
        setShowAdvanced(false); // Close popover after clearing
    };

    const updateFilter = (key: keyof SearchFilters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value || undefined
        }));
    };

    const activeFilterCount = Object.values(filters).filter(v => v && v.length > 0).length;

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'read':
                return t('completed');
            case 'in_progress':
                return t('reading');
            case 'unread':
                return t('toRead');
            default:
                return status;
        }
    };

    return (
        <div className="space-y-3">
            {/* Main Search Bar */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t('searchBooks')}
                        value={filters.query || ''}
                        onChange={(e) => updateFilter('query', e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="pl-10"
                        disabled={isLoading}
                    />
                </div>

                <Popover open={showAdvanced} onOpenChange={setShowAdvanced}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="relative" disabled={isLoading}>
                            <Filter className="h-4 w-4 mr-2" />
                            {t('filters')}
                            {activeFilterCount > 0 && (
                                <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                                    {activeFilterCount}
                                </Badge>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-80" sideOffset={5}>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium">{t('advancedSearch')}</h4>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowAdvanced(false)}
                                    className="h-8 w-8 p-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">{t('title')}</Label>
                                <Input
                                    id="title"
                                    placeholder={t('searchByTitle')}
                                    value={filters.title || ''}
                                    onChange={(e) => updateFilter('title', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="author">{t('author')}</Label>
                                <Input
                                    id="author"
                                    placeholder={t('searchByAuthor')}
                                    value={filters.author || ''}
                                    onChange={(e) => updateFilter('author', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">{t('category')}</Label>
                                <Input
                                    id="category"
                                    placeholder={t('searchByCategory')}
                                    value={filters.category || ''}
                                    onChange={(e) => updateFilter('category', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>{t('readingStatus')}</Label>
                                <Select
                                    value={filters.status || 'all'}
                                    onValueChange={(value) => updateFilter('status', value === 'all' ? '' : value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('allStatuses')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t('allStatuses')}</SelectItem>
                                        <SelectItem value="unread">📖 {t('toRead')}</SelectItem>
                                        <SelectItem value="in_progress">🕐 {t('reading')}</SelectItem>
                                        <SelectItem value="read">✅ {t('completed')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button onClick={handleSearch} className="flex-1" disabled={isLoading}>
                                    <Search className="h-4 w-4 mr-2" />
                                    {t('search')}
                                </Button>
                                <Button variant="outline" onClick={handleClear} disabled={isLoading}>
                                    {t('clear')}
                                </Button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                <Button onClick={handleSearch} disabled={isLoading}>
                    <Search className="h-4 w-4 mr-2" />
                    {t('search')}
                </Button>

                {activeFilterCount > 0 && (
                    <Button variant="outline" onClick={handleClear} disabled={isLoading}>
                        <X className="h-4 w-4 mr-2" />
                        {t('clear')}
                    </Button>
                )}
            </div>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2">
                    {filters.query && (
                        <Badge variant="secondary" className="gap-1">
                            {t('search')}: {filters.query}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => updateFilter('query', '')}
                            />
                        </Badge>
                    )}
                    {filters.title && (
                        <Badge variant="secondary" className="gap-1">
                            {t('title')}: {filters.title}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => updateFilter('title', '')}
                            />
                        </Badge>
                    )}
                    {filters.author && (
                        <Badge variant="secondary" className="gap-1">
                            {t('author')}: {filters.author}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => updateFilter('author', '')}
                            />
                        </Badge>
                    )}
                    {filters.category && (
                        <Badge variant="secondary" className="gap-1">
                            {t('category')}: {filters.category}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => updateFilter('category', '')}
                            />
                        </Badge>
                    )}
                    {filters.status && (
                        <Badge variant="secondary" className="gap-1">
                            {t('status')}: {getStatusLabel(filters.status)}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => updateFilter('status', '')}
                            />
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
}