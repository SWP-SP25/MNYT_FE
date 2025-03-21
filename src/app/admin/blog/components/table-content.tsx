'use client'

import useAxios from "@/hooks/useFetchAxios"
import { Dropdown, Table, TableProps, MenuProps, Button } from "antd";
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button as MuiButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { BlogManage, Blog } from "@/types/blogAdmin";
import { useAuth } from "@/hooks/useAuth";

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
    const { user } = useAuth();
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

    const {response: blogView, error: blogError, loading: blogLoading} = useAxios<BlogManage>(
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

    const showUpdateModal = (record: Blog) => {
        console.log('Update:', record);
    };

    const handleDelete = (record: Blog) => {
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

    const handleStatusChange = async (blogId: number, newStatus: string) => {
        try {
            if (!user?.id) {
                console.error('No user ID available');
                return;
            }
            await axios.patch(
                `https://api-mnyt.purintech.id.vn/api/BlogPosts/${blogId}/change-status?accountId=${user.id}&status=${newStatus}`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            // Refresh the blog data after status change
            window.location.reload();
        } catch (error) {
            console.error('Error updating blog status:', error);
        }
    };

    const handleChange = (field: string) => (event: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const columns: TableProps<Blog>['columns'] = [
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
            key: 'status',
            render: (status: string) => {
                let color = 'inherit';
                switch (status) {
                    case 'Removed':
                        color = '#ff4d4f'; // red
                        break;
                    case 'Published':
                        color = '#52c41a'; // green
                        break;
                    case 'Reported':
                        color = '#faad14'; // yellow
                        break;
                    default:
                        color = 'inherit';
                }
                return <span style={{ color }}>{status}</span>;
            }
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category'
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
                        key: 'view',
                        label: 'View Blog',
                        onClick: () => window.open(`/blog/${record.id}`, '_blank')
                    },
                    {
                        key: 'status',
                        label: 'Change Status',
                        children: [
                            {
                                key: 'Removed',
                                label: 'Set as Removed',
                                onClick: () => handleStatusChange(record.id, 'Removed')
                            },
                            {
                                key: 'Published',
                                label: 'Set as Published',
                                onClick: () => handleStatusChange(record.id, 'Published')
                            }
                        ]
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
            <Table<Blog> 
                columns={columns} 
                dataSource={blogView?.data?.filter(blog => blog.status !== 'Draft')}
            />
            
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