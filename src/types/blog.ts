export interface BlogPost {
    id: number;
    category: Category;
    isAnonymous: boolean;
    title: string;
    typeEnum: number;
    description: string;
    authorId: number;
    authorName: string;
    period: number;
    status: string;
    publishedDay: string;
    images: string[];
    createDate: string;
    likeCount: number;
    commentCount: number;
    bookmarkCount: number;
    thumbnail?: string;
}

export interface PaginatedResponse<T> {
    pageIndex: number;
    totalPages: number;
    totalCount: number;
    items: T[];
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface BlogResponse {
    success: boolean;
    data: PaginatedResponse<BlogPost>;
    message: string;
    errors: null | string[];
}

export enum Category {
    All = "Tất cả",
    Experience = "Kinh nghiệm",
    Story = "Tâm sự",
    HealthPregnancy = "Sức khỏe mẹ & bé",
    Fashion = "Thời trang",
    Nutrition = "Dinh dưỡng"
}