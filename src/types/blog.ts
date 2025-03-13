export interface BlogPost {
    id: number;
    title: string;
    description: string;
    authorId: number;
    authorName: string;
    period: number;
    status: string;
    publishedDay: string;
    likeCount: number;
    commentCount: number;
    bookmarkCount: number;
}

export interface BlogResponse {
    success: boolean;
    data: {
        pageIndex: number;
        totalPages: number;
        totalCount: number;
        items: BlogPost[];
        hasPreviousPage: boolean;
        hasNextPage: boolean;
    };
    message: string;
    errors: null | string[];
}