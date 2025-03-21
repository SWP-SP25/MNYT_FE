export interface BlogManage {
    success: boolean;
    data:    Blog[];
    message: string;
    errors:  null;
}

export interface Blog {
    id:            number;
    category:      string;
    title:         string;
    description:   string;
    authorId:      number;
    authorName:    string;
    period:        number;
    status:        Status;
    publishedDay:  Date;
    imageId:       number;
    imageUrl:      string;
    createDate:    Date;
    likeCount:     number;
    commentCount:  number;
    bookmarkCount: number;
}

export enum Status {
    Draft = "Draft",
    Published = "Pushlished",
    Removed = "Removed",
    Reported = "Reported"
}
