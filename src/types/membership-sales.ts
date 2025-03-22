export interface MembershipSales {
    success: boolean;
    data:    AccountMembership[];
    message: string;
    errors:  null;
}

export interface AccountMembership {
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
