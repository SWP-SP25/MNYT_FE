'use client'

import useAxios from "@/hooks/useFetchAxios"
import { Account, AccountListResponse } from "@/types/accountsView"
import { Table, TableProps, Dropdown } from "antd";
import type { MenuProps } from 'antd';
import axios from "axios";
import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, Button } from '@mui/material';

export const TableContent =() =>
{
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [formData, setFormData] = useState({
        userName: '',
        fullName: '',
        email: '',
        phoneNumber: ''
    });

    const {response: accountView, error: accountError, loading: accountLoading} = useAxios<AccountListResponse>(
        {
            url: 'https://api-mnyt.purintech.id.vn/api/Accounts',
            method: 'get'
        });
    
    const handleUpdateAccount = async (id: number) => {
        try {
            const updateData = {
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                userName: formData.userName,
                email: formData.email
            };

            const response = await axios.put(
                `https://api-mnyt.purintech.id.vn/api/Accounts/${id}`,
                JSON.stringify(updateData),
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data) {
                setIsUpdateModalVisible(false);
                window.location.reload();
            }
        } catch (error) {
            console.error('Error updating account:', error);
        }
    };

    const showUpdateModal = (account: Account) => {
        setSelectedAccount(account);
        setFormData({
            userName: account.userName,
            fullName: account.fullName,
            email: account.email,
            phoneNumber: account.phoneNumber
        });
        setIsUpdateModalVisible(true);
    };

    const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

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
            title:'',
            key:'Action',
            render: (_, record) => {
                const items: MenuProps['items'] = [
                    {
                        key: 'update',
                        label: 'Update',
                        onClick: () => showUpdateModal(record)
                    },
                    ...(record.status === 'Banned' 
                        ? [
                            {
                                key: 'unban',
                                label: 'Unban',
                                onClick: () => handleUnbanAccount(record.id)
                            }
                        ]
                        : [
                            {
                                key: 'ban',
                                label: 'Ban',
                                danger: true,
                                onClick: () => handleBanAccount(record.id)
                            }
                        ])
                ];

                return (
                    <Dropdown menu={{ items }} placement="bottomRight">
                        <Button>...</Button>
                    </Dropdown>
                )
            },
        }
    ]
      
    return (
        <>
            <Table<Account> 
                columns={columns} 
                dataSource={accountView?.data?.filter(account => account.role === 'Member')}
            />
            <Dialog 
                open={isUpdateModalVisible} 
                onClose={() => setIsUpdateModalVisible(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Update Account</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Username"
                            value={formData.userName}
                            onChange={handleInputChange('userName')}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Full Name"
                            value={formData.fullName}
                            onChange={handleInputChange('fullName')}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Email"
                            value={formData.email}
                            onChange={handleInputChange('email')}
                            fullWidth
                            required
                            type="email"
                        />
                        <TextField
                            label="Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleInputChange('phoneNumber')}
                            fullWidth
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsUpdateModalVisible(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => handleUpdateAccount(selectedAccount?.id || 0)} variant="contained" color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
export default TableContent;