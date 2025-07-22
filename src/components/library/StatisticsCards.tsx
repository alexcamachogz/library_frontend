import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { BookOpen, BookCheck, Library, TrendingUp } from 'lucide-react';
import { type StatisticsResponse } from '../../types/book';

interface StatisticsCardsProps {
    statistics: StatisticsResponse['statistics'] | null;
    isLoading?: boolean;
}

export function StatisticsCards({ statistics, isLoading }: StatisticsCardsProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="h-4 bg-muted rounded w-20"></div>
                            <div className="h-4 w-4 bg-muted rounded"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-6 bg-muted rounded w-12 mb-2"></div>
                            <div className="h-3 bg-muted rounded w-24"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!statistics) {
        return null;
    }

    const cards = [
        {
            title: "Total de Libros",
            value: statistics.total_books,
            icon: Library,
            description: "En tu biblioteca",
        },
        {
            title: "Libros Leídos",
            value: statistics.read,
            icon: BookCheck,
            description: "Completados",
        },
        {
            title: "Por Leer",
            value: statistics.unread,
            icon: BookOpen,
            description: "Pendientes",
        },
        {
            title: "Progreso",
            value: `${statistics.reading_percentage.toFixed(1)}%`,
            icon: TrendingUp,
            description: "Porcentaje leído",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {cards.map((card) => (
                <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {card.title}
                        </CardTitle>
                        <card.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                        <p className="text-xs text-muted-foreground">
                            {card.description}
                        </p>
                        {card.title === "Progreso" && (
                            <Progress
                                value={statistics.reading_percentage}
                                className="mt-2"
                            />
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}