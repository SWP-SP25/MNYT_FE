'use client'

import useAxios from "@/hooks/useFetchAxios"
import { Membership, MembershipPlans } from "@/types/membershipPlan";
import { Table, TableProps } from "antd";

export const TableContent = () => {
    const {response: membershipView, error: membershipError, loading: membershipLoading} = useAxios<MembershipPlans>(
    {
        url: 'https://api-mnyt.purintech.id.vn/api/MembershipPlan',
        method: 'get'
    });

    console.log("membership list ", membershipView?.data);
    const columns: TableProps<Membership>['columns'] = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `${price} VND`
        },
        {
            title: 'Duration (days)',
            dataIndex: 'duration',
            key: 'duration'
        }
    ]

    return (
        <Table<Membership> columns={columns} dataSource={membershipView?.data}/>
    );
}

export default TableContent; 