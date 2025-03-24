export interface Blogmanage {
    success: boolean;
    data:    Blog[];
    message: string;
    errors:  null;
}

export interface Blog {
    id:            number;
    category:      string;
    isAnonymous:   boolean;
    title:         string;
    typeEnum:      number;
    description:   null | string;
    authorId:      number;
    authorName:    string;
    period:        number | null;
    status:        Status;
    publishedDay:  Date | null;
    imageId:       number | null;
    imageUrl:      null | string;
    createDate:    Date;
    likeCount:     number;
    commentCount:  number;
    bookmarkCount: number;
}

export enum Status {
    Draft = "Draft",
    Published = "Published",
    Removed = "Removed",
    Reported = "Reported",
}