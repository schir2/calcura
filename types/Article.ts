import type {Topic} from "~/types/Topic";
import type {Tag} from "~/types/Tag";
import type {ArticleSeries} from "~/types/ArticleSeries";
import type {User} from "~/types/User";

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

export type ArticlePartial = Partial<Omit<Article, 'id'>>