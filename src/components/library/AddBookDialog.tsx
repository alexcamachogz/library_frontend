import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Plus, Loader2, X, Upload, BookOpen } from 'lucide-react';
import { libraryAPI } from '../../services/api';
import { useToast } from '../../hooks/use-toast';

interface AddBookDialogProps {
    onBookAdded: () => void;
}

interface ManualBookData {
    isbn: string;
    title: string;
    authors: string[];
    description: string;
    categories: string[];
    page_count: number | null;
    publisher: string;
    published_date: string;
    language: string;
    cover_image: string;
    reading_status: "read" | "unread" | "in_progress";
}

export function AddBookDialog({ onBookAdded }: AddBookDialogProps) {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('isbn');

    // ISBN form state
    const [isbn, setIsbn] = useState('');

    // Manual form state
    const [manualData, setManualData] = useState<ManualBookData>({
        isbn: '',
        title: '',
        authors: [],
        description: '',
        categories: [],
        page_count: null,
        publisher: '',
        published_date: '',
        language: '',
        cover_image: '',
        reading_status: 'unread'
    });

    const [newAuthor, setNewAuthor] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { t } = useTranslation();

    const resetForm = () => {
        setIsbn('');
        setManualData({
            isbn: '',
            title: '',
            authors: [],
            description: '',
            categories: [],
            page_count: null,
            publisher: '',
            published_date: '',
            language: '',
            cover_image: '',
            reading_status: 'unread'
        });
        setNewAuthor('');
        setNewCategory('');
    };

    const handleISBNSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isbn.trim()) {
            toast({
                title: t('error'),
                description: t('invalidISBN'),
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            await libraryAPI.addBook(isbn.trim());
            toast({
                title: t('bookAddedTitle'),
                description: t('bookAddedDescription'),
            });
            resetForm();
            setOpen(false);
            onBookAdded();
        } catch (error) {
            toast({
                title: t('error'),
                description: error instanceof Error ? error.message : t('couldNotAddBook'),
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!manualData.title.trim() || !manualData.isbn.trim()) {
            toast({
                title: t('error'),
                description: t('titleAndISBNRequired'),
                variant: "destructive",
            });
            return;
        }

        if (manualData.authors.length === 0) {
            toast({
                title: t('error'),
                description: t('authorRequired'),
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            // Create book data in the format expected by the backend
            const bookData = {
                ...manualData,
                // Ensure arrays are not empty
                authors: manualData.authors.length > 0 ? manualData.authors : ['Unknown'],
                categories: manualData.categories.length > 0 ? manualData.categories : ['Uncategorized'],
            };

            await libraryAPI.addManualBook(bookData);
            toast({
                title: t('bookAddedTitle'),
                description: t('bookAddedDescription'),
            });
            resetForm();
            setOpen(false);
            onBookAdded();
        } catch (error) {
            toast({
                title: t('error'),
                description: error instanceof Error ? error.message : t('couldNotAddBook'),
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const addAuthor = () => {
        if (newAuthor.trim()) {
            setManualData(prev => ({
                ...prev,
                authors: [...prev.authors, newAuthor.trim()]
            }));
            setNewAuthor('');
        }
    };

    const removeAuthor = (index: number) => {
        setManualData(prev => ({
            ...prev,
            authors: prev.authors.filter((_, i) => i !== index)
        }));
    };

    const addCategory = () => {
        if (newCategory.trim()) {
            setManualData(prev => ({
                ...prev,
                categories: [...prev.categories, newCategory.trim()]
            }));
            setNewCategory('');
        }
    };

    const removeCategory = (index: number) => {
        setManualData(prev => ({
            ...prev,
            categories: prev.categories.filter((_, i) => i !== index)
        }));
    };

    const updateManualData = <K extends keyof ManualBookData>(field: K, value: ManualBookData[K]) => {
        setManualData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('addBookTrigger')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[95vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle>{t('addBookTitle')}</DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
                    <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
                        <TabsTrigger value="isbn" className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            {t('byISBN')}
                        </TabsTrigger>
                        <TabsTrigger value="manual" className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            {t('manualEntry')}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="isbn" className="space-y-4 mt-4 flex-shrink-0">
                        <form onSubmit={handleISBNSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="isbn">{t('isbnRequired')}</Label>
                                <Input
                                    id="isbn"
                                    placeholder={t('exampleISBN')}
                                    value={isbn}
                                    onChange={(e) => setIsbn(e.target.value)}
                                    disabled={isLoading}
                                />
                                <p className="text-sm text-muted-foreground">
                                    {t('isbnHelp')}
                                </p>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    disabled={isLoading}
                                >
                                    {t('cancel')}
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                    {t('addBookTrigger')}
                                </Button>
                            </div>
                        </form>
                    </TabsContent>

                    <TabsContent value="manual" className="mt-4 flex-1 min-h-0">
                        <div className="h-full flex flex-col">
                            <ScrollArea className="flex-1 pr-4" style={{ maxHeight: 'calc(95vh - 180px)' }}>
                                <form onSubmit={handleManualSubmit} className="space-y-4 pb-4">
                                    {/* ISBN and Title */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="manual-isbn">{t('isbnRequired')}</Label>
                                            <Input
                                                id="manual-isbn"
                                                placeholder={t('exampleISBN')}
                                                value={manualData.isbn}
                                                onChange={(e) => updateManualData('isbn', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="manual-title">{t('titleRequired')}</Label>
                                            <Input
                                                id="manual-title"
                                                placeholder={t('bookTitle')}
                                                value={manualData.title}
                                                onChange={(e) => updateManualData('title', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Authors */}
                                    <div className="space-y-2">
                                        <Label>{t('authorsRequired')}</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder={t('addAuthorPlaceholder')}
                                                value={newAuthor}
                                                onChange={(e) => setNewAuthor(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAuthor())}
                                            />
                                            <Button type="button" onClick={addAuthor} size="sm">
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {manualData.authors.map((author, index) => (
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
                                        <Label htmlFor="manual-description">{t('descriptionField')}</Label>
                                        <Textarea
                                            id="manual-description"
                                            placeholder={t('bookDescription')}
                                            value={manualData.description}
                                            onChange={(e) => updateManualData('description', e.target.value)}
                                            rows={3}
                                        />
                                    </div>

                                    {/* Cover Image URL */}
                                    <div className="space-y-2">
                                        <Label htmlFor="manual-cover">{t('coverImageField')}</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="manual-cover"
                                                type="url"
                                                placeholder={t('coverImageUrl')}
                                                value={manualData.cover_image}
                                                onChange={(e) => updateManualData('cover_image', e.target.value)}
                                            />
                                            <Button type="button" variant="outline" size="sm">
                                                <Upload className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        {manualData.cover_image && (
                                            <div className="mt-2">
                                                <img
                                                    src={manualData.cover_image}
                                                    alt={t('coverPreviewAlt')}
                                                    className="w-16 h-24 object-cover rounded border"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Categories */}
                                    <div className="space-y-2">
                                        <Label>{t('categoriesField')}</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder={t('addCategoryPlaceholder')}
                                                value={newCategory}
                                                onChange={(e) => setNewCategory(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                                            />
                                            <Button type="button" onClick={addCategory} size="sm">
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {manualData.categories.map((category, index) => (
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
                                            <Label htmlFor="manual-publisher">{t('publisherField')}</Label>
                                            <Input
                                                id="manual-publisher"
                                                placeholder={t('publisherName')}
                                                value={manualData.publisher}
                                                onChange={(e) => updateManualData('publisher', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="manual-pages">{t('pagesField')}</Label>
                                            <Input
                                                id="manual-pages"
                                                type="number"
                                                placeholder={t('numberOfPages')}
                                                value={manualData.page_count || ''}
                                                onChange={(e) => updateManualData('page_count', e.target.value ? parseInt(e.target.value) : null)}
                                            />
                                        </div>
                                    </div>

                                    {/* Published Date and Language */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="manual-date">{t('publishedDateField')}</Label>
                                            <Input
                                                id="manual-date"
                                                type="date"
                                                value={manualData.published_date}
                                                onChange={(e) => updateManualData('published_date', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="manual-language">{t('languageField')}</Label>
                                            <Input
                                                id="manual-language"
                                                placeholder={t('languageCodes')}
                                                value={manualData.language}
                                                onChange={(e) => updateManualData('language', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Reading Status */}
                                    <div className="space-y-2">
                                        <Label>{t('readingStatusField')}</Label>
                                        <Select
                                            value={manualData.reading_status}
                                            onValueChange={(value: "read" | "unread" | "in_progress") => updateManualData('reading_status', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="unread">{t('unreadStatus')}</SelectItem>
                                                <SelectItem value="in_progress">{t('inProgressStatus')}</SelectItem>
                                                <SelectItem value="read">{t('readStatus')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-end space-x-2 pt-4 border-t bg-background">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setOpen(false)}
                                            disabled={isLoading}
                                        >
                                            {t('cancel')}
                                        </Button>
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                            {t('addBookTrigger')}
                                        </Button>
                                    </div>
                                </form>
                            </ScrollArea>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}