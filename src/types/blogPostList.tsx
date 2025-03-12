export interface BlogPostListResponse {
    success: boolean;
    data:    BlogPostListData;
    message: string;
    errors:  null;
}

export interface BlogPostListData {
    pageIndex:       number;
    totalPages:      number;
    totalCount:      number;
    items:           BlogPostItem[];
    hasPreviousPage: boolean;
    hasNextPage:     boolean;
}

export interface BlogPostItem {
    id:            number;
    title:         string;
    description:   string;
    authorId:      number;
    authorName:    string;
    period:        number;
    status:        string;
    publishedDay:  Date;
    likeCount:     number;
    commentCount:  number;
    bookmarkCount: number;
}