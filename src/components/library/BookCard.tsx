import { type Book } from '../../types/book';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { BookOpen, BookOpenCheck, Eye, Edit, Trash2, Clock } from 'lucide-react';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface BookCardProps {
    book: Book;
    onStatusChange: (isbn: string, status: "read" | "unread" | "in_progress") => Promise<void>;
    onView: (book: Book) => void;
    onEdit: (book: Book) => void;
    onDelete: (isbn: string) => Promise<void>;
    isAuthenticated: boolean;
}

export function BookCard({
                             book,
                             onStatusChange,
                             onView,
                             onEdit,
                             onDelete,
                             isAuthenticated
                         }: BookCardProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Cycle through statuses: unread -> in_progress -> read -> unread
    const getNextStatus = (currentStatus: Book['reading_status']): Book['reading_status'] => {
        switch (currentStatus) {
            case 'unread':
                return 'in_progress';
            case 'in_progress':
                return 'read';
            case 'read':
                return 'unread';
            default:
                return 'unread';
        }
    };

    const handleStatusCycle = async () => {
        if (!isAuthenticated) return;

        setIsUpdating(true);
        try {
            const newStatus = getNextStatus(book.reading_status);
            await onStatusChange(book.isbn, newStatus);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!isAuthenticated) return;

        setIsDeleting(true);
        try {
            await onDelete(book.isbn);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = () => {
        if (!isAuthenticated) return;
        onEdit(book);
    };

    const getStatusConfig = (status: Book['reading_status']) => {
        switch (status) {
            case 'read':
                return {
                    icon: BookOpenCheck,
                    label: 'Leído',
                    variant: 'default' as const,
                    className: 'bg-green-100 hover:bg-green-200 text-green-800 border-green-200'
                };
            case 'in_progress':
                return {
                    icon: Clock,
                    label: 'Leyendo',
                    variant: 'secondary' as const,
                    className: 'bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-200'
                };
            case 'unread':
            default:
                return {
                    icon: BookOpen,
                    label: 'No leído',
                    variant: 'outline' as const,
                    className: ''
                };
        }
    };

    const statusConfig = getStatusConfig(book.reading_status);
    const StatusIcon = statusConfig.icon;

    // Componente para botón deshabilitado con tooltip
    interface DisabledButtonProps extends React.ComponentProps<typeof Button> {
        children: React.ReactNode;
        tooltipText: string;
    }

    const DisabledButton = ({ children, tooltipText, className, ...props }: DisabledButtonProps) => (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="w-full">
                    <Button
                        {...props}
                        disabled={true}
                        className={`relative ${className}`}
                    >
                        {children}
                    </Button>
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltipText}</p>
            </TooltipContent>
        </Tooltip>
    );

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
                    {/* Reading Status Cycle Button */}
                    {isAuthenticated ? (
                        <Button
                            variant={statusConfig.variant}
                            size="sm"
                            className={`w-full ${statusConfig.className}`}
                            onClick={handleStatusCycle}
                            disabled={isUpdating}
                            title={`Cambiar de "${statusConfig.label}" a "${getStatusConfig(getNextStatus(book.reading_status)).label}"`}
                        >
                            <StatusIcon className="h-4 w-4 mr-2" />
                            {statusConfig.label}
                        </Button>
                    ) : (
                        <DisabledButton
                            variant={statusConfig.variant}
                            size="sm"
                            className={`w-full ${statusConfig.className} opacity-60`}
                            tooltipText="Inicia sesión para actualizar el estado de lectura"
                        >
                            <StatusIcon className="h-4 w-4 mr-2" />
                            {statusConfig.label}
                        </DisabledButton>
                    )}

                    {/* Action Buttons - New row */}
                    <div className="flex gap-1 w-full">
                        {/* View button - always available */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1"
                            onClick={() => onView(book)}
                            title="Ver detalles"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>

                        {/* Edit button - conditional */}
                        {isAuthenticated ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex-1"
                                onClick={handleEdit}
                                title="Editar libro"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full opacity-60"
                                            disabled={true}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Inicia sesión para editar</p>
                                </TooltipContent>
                            </Tooltip>
                        )}

                        {/* Delete button - conditional */}
                        {isAuthenticated ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex-1"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                title="Eliminar libro"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full opacity-60"
                                            disabled={true}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Inicia sesión para borrar libros</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}