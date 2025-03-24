'use client'

import useAxios from "@/hooks/useFetchAxios"
import { ShceduleTemplate } from "@/types/shcedule-template";
import { Dropdown, Table, TableProps, MenuProps, Button } from "antd";
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button as MuiButton } from '@mui/material';
import axios from 'axios';

interface FormData {
    id?: number;
    period: number;
    type: string;
    tag: string;
    title: string;
    description: string;
}

export const TableContent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        period: 0,
        type: '',
        tag: '',
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
            id: record.id,
            period: record.period,
            type: record.type,
            tag: record.tag || '',
            title: record.title,
            description: record.description
        });
        setIsUpdateMode(true);
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
            tag: '',
            title: '',
            description: ''
        });
        setIsUpdateMode(false);
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            if (isUpdateMode) {
                const originalRecord = scheduleView?.find(item => item.id === formData.id);
                if (!originalRecord) {
                    console.error('Original record not found');
                    return;
                }

                const updateData = {
                    id: formData.id,
                    period: formData.period,
                    type: formData.type,
                    tag: formData.tag,
                    title: formData.title,
                    description: formData.description,
                    createDate: originalRecord.createDate,
                    updateDate: new Date().toISOString(),
                    isDeleted: false
                };

                const updateResponse = await axios.put(
                    'https://api-mnyt.purintech.id.vn/api/ScheduleTemplate',
                    updateData,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                console.log('Schedule template updated successfully:', updateResponse.data);
            } else {
                const createData = {
                    period: formData.period,
                    type: formData.type,
                    tag: formData.tag,
                    title: formData.title,
                    description: formData.description,
                    createDate: new Date().toISOString(),
                    updateDate: new Date().toISOString(),
                    isDeleted: false
                };

                const createResponse = await axios.post(
                    'https://api-mnyt.purintech.id.vn/api/ScheduleTemplate',
                    [createData],
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                console.log('Schedule template created successfully:', createResponse.data);
            }
            setIsModalOpen(false);
            window.location.reload();
        } catch (error) {
            console.error('Error saving schedule template:', error);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setIsUpdateMode(false);
        setFormData({
            period: 0,
            type: '',
            tag: '',
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
            key: 'period',
            sorter: (a, b) => a.period - b.period
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            filters: scheduleView ? [...new Set(scheduleView.map(item => item.type))].map(type => ({
                text: type,
                value: type
            })) : [],
            onFilter: (value, record) => record.type === value,
            sorter: (a, b) => a.type.localeCompare(b.type)
        },
        {
            title: 'Tag',
            dataIndex: 'tag',
            key: 'tag',
            filters: scheduleView ? [...new Set(scheduleView.map(item => item.tag).filter(Boolean))].map(tag => ({
                text: tag,
                value: tag
            })) : [],
            onFilter: (value, record) => record.tag === value,
            sorter: (a, b) => (a.tag || '').localeCompare(b.tag || '')
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
                <DialogTitle>{isUpdateMode ? 'Update Schedule Template' : 'Create New Schedule Template'}</DialogTitle>
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
                        label="Tag"
                        fullWidth
                        value={formData.tag}
                        onChange={handleChange('tag')}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <MuiButton onClick={handleCancel}>Cancel</MuiButton>
                    <MuiButton onClick={handleOk} variant="contained" color="primary">
                        {isUpdateMode ? 'Update' : 'Create'}
                    </MuiButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default TableContent;
