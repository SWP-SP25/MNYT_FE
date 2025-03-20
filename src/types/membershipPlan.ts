export interface MembershipPlans {
    success: boolean;
    data:    Membership[];
    message: string;
    errors:  null;
}

export interface Membership {
    id:          number;
    name:        string;
    description: string;
    price:       number;
    duration:    number;
}
