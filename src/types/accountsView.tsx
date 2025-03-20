export interface AccountListResponse {
    success: boolean;
    data:    Account[];
    message: string;
    errors:  null;
}

export interface Account {
    id:               number;
    userName:         string;
    fullName:         string;
    email:            string;
    phoneNumber:      string;
    role:             string;
    status:           string;
    isExternal:       boolean;
    externalProvider: string;
}