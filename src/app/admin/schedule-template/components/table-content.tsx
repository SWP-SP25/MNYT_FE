'use client'

import useAxios from "@/hooks/useFetchAxios"
import { ShceduleTemplate } from "@/types/shcedule-template";
import { Dropdown, Table, TableProps, MenuProps, Button } from "antd";
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button as MuiButton } from '@mui/material';
import axios from 'axios';

interface FormData {
    period: number;
    type: string;
    status: string | null;
    title: string;
    description: string;
}

export const TableContent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        period: 0,
        type: '',
        status: null,
        title: '',
        description: ''
    });

    const {response: scheduleView, error: scheduleError, loading: scheduleLoading} = useAxios<ShceduleTemplate[]>(
    {
        url: 'https://api-mnyt.purintech.id.vn/api/ScheduleTemplate',
        method: 'get'
    });

    if (scheduleError) {
        return <div>Error loading schedule template data</div>;
    }

    if (scheduleLoading) {
        return <div>Loading...</div>;
    }

    const showUpdateModal = (record: ShceduleTemplate) => {
        setFormData({
            period: record.period,
            type: record.type,
            status: record.status,
            title: record.title,
            description: record.description
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (record: ShceduleTemplate) => {
        try {
            await axios.delete(`https://api-mnyt.purintech.id.vn/api/ScheduleTemplate/${record.id}`);
            window.location.reload();
        } catch (error) {
            console.error('Error deleting schedule template:', error);
        }
    };

    const handleCreate = () => {
        setFormData({
            period: 0,
            type: '',
            status: null,
            title: '',
            description: ''
        });
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const response = await axios.post(
                'https://api-mnyt.purintech.id.vn/api/ScheduleTemplate',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('Schedule template created successfully:', response.data);
            setIsModalOpen(false);
            window.location.reload();
        } catch (error) {
            console.error('Error creating schedule template:', error);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setFormData({
            period: 0,
            type: '',
            status: null,
            title: '',
            description: ''
        });
    };

    const handleChange = (field: string) => (event: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const columns: TableProps<ShceduleTemplate>['columns'] = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: 'Period',
            dataIndex: 'period',
            key: 'period'
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status'
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
                    Add Schedule Template
                </Button>
            </div>
            <Table<ShceduleTemplate> columns={columns} dataSource={scheduleView || []}/>
            
            <Dialog open={isModalOpen} onClose={handleCancel} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Schedule Template</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={formData.title}
                        onChange={handleChange('title')}
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
                        label="Period"
                        fullWidth
                        type="number"
                        value={formData.period}
                        onChange={handleChange('period')}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Type"
                        fullWidth
                        value={formData.type}
                        onChange={handleChange('type')}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Status"
                        fullWidth
                        value={formData.status || ''}
                        onChange={handleChange('status')}
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
