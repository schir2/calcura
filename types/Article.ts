export interface Article {
    id: number;
    title: string;
    slug: string;
    content: string;
    topic: Topic;
    tags: Tag[];
    image?: string;
    isPublished: boolean;
    seriesId?: number;
    series?: ArticleSeries;
    seriesSequenceNumber?: number;
    creator: User;
}