import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Plus, Loader2 } from 'lucide-react';
import { libraryAPI } from '../../services/api';
import { useToast } from '../../hooks/use-toast';

interface AddBookDialogProps {
    onBookAdded: () => void;
}

export function AddBookDialog({ onBookAdded }: AddBookDialogProps) {
    const [open, setOpen] = useState(false);
    const [isbn, setIsbn] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isbn.trim()) {
            toast({
                title: "Error",
                description: "Por favor ingresa un ISBN válido",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            await libraryAPI.addBook(isbn.trim());
            toast({
                title: "Libro agregado",
                description: "El libro se ha agregado exitosamente a tu biblioteca",
            });
            setIsbn('');
            setOpen(false);
            onBookAdded();
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "No se pudo agregar el libro",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Libro
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Agregar Nuevo Libro</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="isbn">ISBN</Label>
                        <Input
                            id="isbn"
                            placeholder="Ej: 9780439708180"
                            value={isbn}
                            onChange={(e) => setIsbn(e.target.value)}
                            disabled={isLoading}
                        />
                        <p className="text-sm text-muted-foreground">
                            Ingresa el ISBN de 10 o 13 dígitos del libro
                        </p>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Agregar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}