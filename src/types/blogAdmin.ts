export interface Blogmanage {
    success: boolean;
    data:    Blog[];
    message: string;
    errors:  null;
}

export interface Blog {
    id:            number;
    category:      Category;
    isAnonymous:   boolean;
    title:         string;
    typeEnum:      number;
    description:   string | null;
    authorId:      number;
    authorName:    string;
    period:        number | null;
    status:        Status;
    publishedDay:  string | null;
    images:        Array<{
        id: number;
        url: string;
    }>;
    createDate:    string;
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

export enum Category {
    all = "Tất cả",
    experience = "Kinh nghiệm",
    story = "Tâm sự",
    health = "Sức khỏe mẹ & bé",
    fashion = "Thời trang",
    nutrition = "Dinh dưỡng"
}
