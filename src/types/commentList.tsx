export interface CommentListResponse {
    success: boolean;
    data:    CommentListData;
    message: string;
    errors:  null;
}

export interface CommentListData {
    pageIndex:       number;
    totalPages:      number;
    totalCount:      number;
    items:           CommentListItem[];
    hasPreviousPage: boolean;
    hasNextPage:     boolean;
}

export interface CommentListItem {
    id:              number;
    accountId:       number;
    accountUserName: string;
    blogPostId:      number;
    replyId:         null;
    content:         string;
    createDate:      Date;
}