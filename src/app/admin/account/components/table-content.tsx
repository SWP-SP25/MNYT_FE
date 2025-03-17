'use client'

import useAxios from "@/hooks/useFetchAxios"
import { Account, AccountListResponse } from "@/types/accountsView";
import { Space, Table, TableProps, Button } from "antd";
import axios from "axios";

export const TableContent =() =>
{
    const {response: accountView, error: accountError, loading: accountLoading} = useAxios<AccountListResponse>(
    {
        url: 'https://api-mnyt.purintech.id.vn/api/Accounts',
        method: 'get'
    });

    const handleBanAccount = async (id: number) => {
        try {
            // const token = localStorage.getItem("token");
            const response = await axios.patch(
                `https://api-mnyt.purintech.id.vn/api/Accounts/ban/${id}`,
                {},
                //add token into account
                // {
                //     headers: {
                //         "Content-Type": "application/json",
                //         ...(token && { Authorization: `Bearer ${token}` })
                //     }
                // }
            );
            
            if (response.data) {
                // Refresh the account list after successful ban
                window.location.reload();
            }
        } catch (error) {
            console.error('Error banning account:', error);
        }
    };

    const handleUnbanAccount = async (id: number) => {
        try {
            // const token = localStorage.getItem("token");
            const response = await axios.patch(
                `https://api-mnyt.purintech.id.vn/api/Accounts/unban/${id}`,
                {},
                //add token into account
                // {
                //     headers: {
                //         "Content-Type": "application/json",
                //         ...(token && { Authorization: `Bearer ${token}` })
                //     }
                // }
            );
            
            if (response.data) {
                // Refresh the account list after successful unban
                window.location.reload();
            }
        } catch (error) {
            console.error('Error unbanning account:', error);
        }
    };
    
    console.log("account list ", accountView);
    const columns: TableProps<Account>['columns']=
    [
        {
            title: 'Username',
            dataIndex: 'userName',
            key: 'userName'
        },
        {
            title:'Full Name',
            dataIndex: 'fullName',
            key:'fullName'
        },
        {
            title:'Email',
            dataIndex: 'email',
            key:'email'
        },
        {
            title:'PhoneNumber',
            dataIndex:'phoneNumber',
            key:'phoneNumber'
        },
        {
            title:"Status",
            dataIndex:'status',
            key:'status'
        },
        {
            title:'Action',
            key:'action',
            render: (_,{id}) => {
                return (
                    <Space size='middle'>
                        <Button type="primary" danger onClick={() => handleBanAccount(id)}>Ban</Button>
                        <Button type="primary" onClick={() => handleUnbanAccount(id)}>Unban</Button>
                    </Space>
                )
            },
        }
    ]
    
    return (
        <Table<Account> columns={columns} dataSource={accountView?.data}/>
    );
}
export default TableContent;

