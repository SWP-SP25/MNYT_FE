export interface MembersipOnwers {
    success: boolean;
    data:    Membership;
    message: string;
    errors:  null;
}

export interface Membership {
    id:               number;
    accountId:        number;
    membershipPlanId: number;
    startDate:        Date;
    endDate:          Date;
    amount:           number;
    status:           string;
    paymentStatus:    string;
    paymentMethodId:  number;
}
