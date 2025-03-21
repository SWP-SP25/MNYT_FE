'use client'

import useAxios from "@/hooks/useFetchAxios"
import { Membership, MembershipPlans } from "@/types/membershipPlan";
import { Dropdown, Table, TableProps, MenuProps, Button } from "antd";
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button as MuiButton } from '@mui/material';
import axios from 'axios';

interface FormData {
    name: string;
    description: string;
    price: number;
    duration: number;
}

export const TableContent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        price: 0,
        duration: 0
    });

    const {response: membershipView, error: membershipError, loading: membershipLoading} = useAxios<MembershipPlans>(
    {
        url: 'https://api-mnyt.purintech.id.vn/api/MembershipPlan',
        method: 'get'
    });

    if (membershipError) {
        return <div>Error loading membership data</div>;
    }

    if (membershipLoading) {
        return <div>Loading...</div>;
    }

    const showUpdateModal = (record: Membership) => {
        setFormData({
            name: record.name,
            description: record.description,
            price: record.price,
            duration: record.duration
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (record: Membership) => {
        try {
            await axios.delete(`https://api-mnyt.purintech.id.vn/api/MembershipPlan/${record.id}`);
            // Refresh the data after deletion
            window.location.reload();
        } catch (error) {
            console.error('Error deleting membership plan:', error);
        }
    };

    const handleCreate = () => {
        setFormData({
            name: '',
            description: '',
            price: 0,
            duration: 0
        });
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const response = await axios.post(
                'https://api-mnyt.purintech.id.vn/api/MembershipPlan',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('Membership plan created successfully:', response.data);
            setIsModalOpen(false);
            window.location.reload();
        } catch (error) {
            console.error('Error creating membership plan:', error);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setFormData({
            name: '',
            description: '',
            price: 0,
            duration: 0
        });
    };

    const handleChange = (field: string) => (event: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

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
        },
        {
            title: '',
            key: 'actions',
            render: (_, record) => {
                const items: MenuProps['items'] = [
                    {
                        key: 'update',
                        label: 'Update',
                        onClick: () => showUpdateModal(record)
                    },
                    {
                        key: 'delete',
                        label: 'Delete',
                        danger: true,
                        onClick: () => handleDelete(record)
                    }
                ];
                return (
                    <Dropdown menu={{ items }} placement="bottomRight">
                        <Button icon={<EllipsisOutlined />} />
                    </Dropdown>
                );
            }
        }
    ]

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                    Add Membership Plan
                </Button>
            </div>
            <Table<Membership> columns={columns} dataSource={membershipView?.data}/>
            
            <Dialog open={isModalOpen} onClose={handleCancel} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Membership Plan</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        fullWidth
                        value={formData.name}
                        onChange={handleChange('name')}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={handleChange('description')}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Price"
                        fullWidth
                        type="number"
                        value={formData.price}
                        onChange={handleChange('price')}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Duration (days)"
                        fullWidth
                        type="number"
                        value={formData.duration}
                        onChange={handleChange('duration')}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <MuiButton onClick={handleCancel}>Cancel</MuiButton>
                    <MuiButton onClick={handleOk} variant="contained" color="primary">
                        Create
                    </MuiButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default TableContent; 