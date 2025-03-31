export interface CommentListItem {
    id: number;
    accountId: number;
    accountUserName: string;
    blogPostId: number;
    replyId: number | null;
    content: string;
    createDate: string | Date;
    imageUrl?: string;
    forumPostId?: number;
    images?: { url: string }[];
} 