'use client'

import useAxios from "@/hooks/useFetchAxios"
import { BlogPost, BlogResponse } from "@/types/blog";
import { Dropdown, Table, TableProps, MenuProps, Button } from "antd";
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button as MuiButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

interface FormData {
    category: string;
    title: string;
    description: string;
    imageId: number;
    imageUrl: string;
    period: number;
    status: string;
    publishedDay: string;
}

export const TableContent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        category: '',
        title: '',
        description: '',
        imageId: 0,
        imageUrl: '',
        period: 0,
        status: '',
        publishedDay: new Date().toISOString().split('T')[0]
    });

    const {response: blogView, error: blogError, loading: blogLoading} = useAxios<BlogResponse>(
    {
        url: 'https://api-mnyt.purintech.id.vn/api/BlogPosts/all',
        method: 'get'
    });

    if (blogError) {
        return <div>Error loading blog data</div>;
    }

    if (blogLoading) {
        return <div>Loading...</div>;
    }

    const showUpdateModal = (record: BlogPost) => {
        console.log('Update:', record);
    };

    const handleDelete = (record: BlogPost) => {
        console.log('Delete:', record);
    };

    const handleCreate = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const response = await axios.post(
                'https://api-mnyt.purintech.id.vn/api/BlogPosts?authorId=28',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('Blog created successfully:', response.data);
            setIsModalOpen(false);
            setFormData({
                category: '',
                title: '',
                description: '',
                imageId: 0,
                imageUrl: '',
                period: 0,
                status: '',
                publishedDay: new Date().toISOString().split('T')[0]
            });
        } catch (error) {
            console.error('Error creating blog:', error);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setFormData({
            category: '',
            title: '',
            description: '',
            imageId: 0,
            imageUrl: '',
            period: 0,
            status: '',
            publishedDay: new Date().toISOString().split('T')[0]
        });
    };

    const handleChange = (field: string) => (event: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const columns: TableProps<BlogPost>['columns'] = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: 'Author',
            dataIndex: 'authorName',
            key: 'authorName'
        },
        {
            title: 'Period',
            dataIndex: 'period',
            key: 'period'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: 'Published Date',
            dataIndex: 'publishedDay',
            key: 'publishedDay'
        },
        {
            title: 'Likes',
            dataIndex: 'likeCount',
            key: 'likeCount'
        },
        {
            title: 'Comments',
            dataIndex: 'commentCount',
            key: 'commentCount'
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
                    Add Blog
                </Button>
            </div>
            <Table<BlogPost> columns={columns} dataSource={blogView?.data}/>
            {/* ignore line 179*/}
            
            <Dialog open={isModalOpen} onClose={handleCancel} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Blog</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Category"
                        fullWidth
                        value={formData.category}
                        onChange={handleChange('category')}
                        required
                    />
                    <TextField
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
                        label="Image URL"
                        fullWidth
                        value={formData.imageUrl}
                        onChange={handleChange('imageUrl')}
                    />
                    <TextField
                        margin="dense"
                        label="Image ID"
                        fullWidth
                        type="number"
                        value={formData.imageId}
                        onChange={handleChange('imageId')}
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
                    <FormControl fullWidth margin="dense" required>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={formData.status}
                            label="Status"
                            onChange={handleChange('status')}
                        >
                            <MenuItem value="draft">Draft</MenuItem>
                            <MenuItem value="published">Published</MenuItem>
                        </Select>
                    </FormControl>
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