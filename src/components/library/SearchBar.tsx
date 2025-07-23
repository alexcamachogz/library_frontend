import { useState } from 'react';
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
                return 'Leído';
            case 'in_progress':
                return 'Leyendo';
            case 'unread':
                return 'No leído';
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
                        placeholder="Buscar libros..."
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
                            Filtros
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
                                <h4 className="font-medium">Búsqueda Avanzada</h4>
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
                                <Label htmlFor="title">Título</Label>
                                <Input
                                    id="title"
                                    placeholder="Buscar por título..."
                                    value={filters.title || ''}
                                    onChange={(e) => updateFilter('title', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="author">Autor</Label>
                                <Input
                                    id="author"
                                    placeholder="Buscar por autor..."
                                    value={filters.author || ''}
                                    onChange={(e) => updateFilter('author', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Categoría</Label>
                                <Input
                                    id="category"
                                    placeholder="Buscar por categoría..."
                                    value={filters.category || ''}
                                    onChange={(e) => updateFilter('category', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Estado de Lectura</Label>
                                <Select
                                    value={filters.status || 'all'}
                                    onValueChange={(value) => updateFilter('status', value === 'all' ? '' : value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todos los estados" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos los estados</SelectItem>
                                        <SelectItem value="unread">📖 No leído</SelectItem>
                                        <SelectItem value="in_progress">🕐 Leyendo</SelectItem>
                                        <SelectItem value="read">✅ Leído</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button onClick={handleSearch} className="flex-1" disabled={isLoading}>
                                    <Search className="h-4 w-4 mr-2" />
                                    Buscar
                                </Button>
                                <Button variant="outline" onClick={handleClear} disabled={isLoading}>
                                    Limpiar
                                </Button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                <Button onClick={handleSearch} disabled={isLoading}>
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                </Button>

                {activeFilterCount > 0 && (
                    <Button variant="outline" onClick={handleClear} disabled={isLoading}>
                        <X className="h-4 w-4 mr-2" />
                        Limpiar
                    </Button>
                )}
            </div>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2">
                    {filters.query && (
                        <Badge variant="secondary" className="gap-1">
                            Búsqueda: {filters.query}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => updateFilter('query', '')}
                            />
                        </Badge>
                    )}
                    {filters.title && (
                        <Badge variant="secondary" className="gap-1">
                            Título: {filters.title}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => updateFilter('title', '')}
                            />
                        </Badge>
                    )}
                    {filters.author && (
                        <Badge variant="secondary" className="gap-1">
                            Autor: {filters.author}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => updateFilter('author', '')}
                            />
                        </Badge>
                    )}
                    {filters.category && (
                        <Badge variant="secondary" className="gap-1">
                            Categoría: {filters.category}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => updateFilter('category', '')}
                            />
                        </Badge>
                    )}
                    {filters.status && (
                        <Badge variant="secondary" className="gap-1">
                            Estado: {getStatusLabel(filters.status)}
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