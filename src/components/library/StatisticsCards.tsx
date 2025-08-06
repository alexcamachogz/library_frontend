import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { BookOpen, BookCheck, Library, TrendingUp, Clock } from 'lucide-react';
import { type StatisticsResponse } from '../../types/book';
import { useTranslation } from 'react-i18next';

interface StatisticsCardsProps {
    statistics: StatisticsResponse['statistics'] | null | undefined;
    isLoading?: boolean;
}

export function StatisticsCards({ statistics, isLoading }: StatisticsCardsProps) {
    const { t } = useTranslation();
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
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
            title: t('totalBooks'),
            value: statistics.total_books,
            icon: Library,
            description: t('inYourLibrary'),
            color: "text-blue-500",
        },
        {
            title: t('booksRead'),
            value: statistics.read,
            icon: BookCheck,
            description: t('completed'),
            color: "text-green-500",
        },
        {
            title: t('readingNow'),
            value: statistics.in_progress,
            icon: Clock,
            description: t('inProgress'),
            color: "text-orange-400",
        },
        {
            title: t('toRead'),
            value: statistics.unread,
            icon: BookOpen,
            description: t('pending'),
            color: "text-gray-500",
        },
        {
            title: t('totalProgress'),
            value: `${statistics.reading_percentage.toFixed(1)}%`,
            icon: TrendingUp,
            description: t('readPercentage'),
            color: "text-purple-500",
            showProgress: true,
            progressValue: statistics.reading_percentage,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {cards.map((card) => (
                <Card key={card.title} className="relative overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {card.title}
                        </CardTitle>
                        <card.icon className={`h-4 w-4 ${card.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                        <p className="text-xs text-muted-foreground mb-2">
                            {card.description}
                        </p>

                        {/* Progress bars for different metrics */}
                        {card.showProgress && (
                            <div className="space-y-2">
                                <Progress
                                    value={statistics.reading_percentage}
                                    className="h-2"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{t('read')}: {statistics.reading_percentage.toFixed(1)}%</span>
                                    <span>{t('inProgress')}: {statistics.progress_percentage.toFixed(1)}%</span>
                                </div>
                            </div>
                        )}

                        {/* Individual progress indicators for other cards */}
                        {!card.showProgress && card.title !== t('totalBooks') && (
                            <div className="mt-2">
                                <Progress
                                    value={(card.value as number / statistics.total_books) * 100}
                                    className="h-1"
                                />
                            </div>
                        )}
                    </CardContent>

                    {/* Visual indicator based on card type - Softer colors */}
                    <div className={`absolute bottom-0 left-0 w-full h-1 ${
                        card.title === t('booksRead') ? "bg-green-300" :
                            card.title === t('readingNow') ? "bg-orange-300" :
                                card.title === t('toRead') ? "bg-gray-300" :
                                    card.title === t('totalProgress') ? "bg-purple-300" :
                                        "bg-blue-300"
                    }`} />
                </Card>
            ))}
        </div>
    );
}