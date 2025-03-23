'use client'

import useAxios from "@/hooks/useFetchAxios"
import { Dropdown, Table, TableProps, MenuProps, Button, Input, Tabs } from "antd";
import { EllipsisOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useState, useRef, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button as MuiButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { BlogManage, Blog } from "@/types/blogAdmin";
import { useAuth } from "@/hooks/useAuth";
import UploadButton from "@/app/components/upload-button/upload";

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
    const [searchText, setSearchText] = useState('');
    const [activeTab, setActiveTab] = useState('user');
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

    // Ref để lưu trữ hàm tải lên từ component UploadButton
    const uploadImageRef = useRef<() => Promise<string>>();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');

    const handleImageUploaded = (url: string) => {
        console.log('Image was uploaded successfully:', url);
        // Có thể xử lý thêm với URL hình ảnh nếu cần
    };

    const { response: blogView, error: blogError, loading: blogLoading } = useAxios<BlogManage>(
        {
            url: 'https://api-mnyt.purintech.id.vn/api/Posts/blogs',
            method: 'get'
        });

    const { response: userBlogView, error: userBlogError, loading: userBlogLoading } = useAxios<BlogManage>(
        {
            url: 'https://api-mnyt.purintech.id.vn/api/Posts/forums',
            method: 'get'
        });

    if (blogError || userBlogError) {
        return <div>Error loading blog data</div>;
    }

    if (blogLoading || userBlogLoading) {
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

    // Xử lý khi chọn file
    const handleFileSelected = (file: File | null) => {
        setSelectedFile(file);
        console.log('File được chọn:', file?.name);
    };

    // Xử lý khi có URL
    const handleUrlChange = (url: string | null) => {
        if (url) {
            setFormData(prev => ({
                ...prev,
                imageUrl: url
            }));
            setImageUrl(url);
            console.log('URL hình ảnh nhận được:', url);
        } else {
            setFormData(prev => ({
                ...prev,
                imageUrl: ''
            }));
            setImageUrl('');
        }
    };

    const handleOk = async () => {
        try {
            // Log form data
            console.log('Form data trước khi tải ảnh:', formData);

            // Lấy user ID từ useAuth
            if (!user?.id) {
                console.error('Không có ID người dùng');
                return;
            }

            // Tải ảnh lên nếu có file được chọn
            let finalImageUrl = imageUrl;
            if (selectedFile && !imageUrl) {
                // @ts-ignore
                const uploadResult = await UploadButton.uploadFile();
                if (uploadResult) {
                    finalImageUrl = uploadResult;
                    setImageUrl(finalImageUrl);
                    setFormData(prev => ({
                        ...prev,
                        imageUrl: finalImageUrl
                    }));
                } else {
                    console.error('Không thể tải lên hình ảnh');
                    return;
                }
            }

            // Cập nhật imageUrl trong formData
            const blogData = {
                ...formData,
                imageUrl: finalImageUrl
            };

            console.log('Form data sau khi xử lý:', blogData);

            // Đã sửa lại URL từ BlogPosts thành Posts
            const response = await axios.post(
                `https://api-mnyt.purintech.id.vn/api/Posts/blog?authorId=${user?.id}`,
                blogData,
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
            setSelectedFile(null);
            setImageUrl('');

            // Refresh blog data
            window.location.reload();
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
                `https://api-mnyt.purintech.id.vn/api/Posts/${blogId}/change-status?accountId=${user.id}&status=${newStatus}`,
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

    const handleSearch = (value: string) => {
        setSearchText(value);
    };

    const getFilteredData = () => {
        const data = activeTab === 'admin' ? blogView?.data : userBlogView?.data;

        if (!searchText) {
            return activeTab === 'admin' ? data : data?.filter(blog => blog.status !== 'Draft');
        }

        const searchLower = searchText.toLowerCase();
        const filteredData = activeTab === 'admin' ? data : data?.filter(blog => blog.status !== 'Draft');

        return filteredData?.filter(blog =>
            (blog.title?.toLowerCase() || '').includes(searchLower) ||
            (blog.authorName?.toLowerCase() || '').includes(searchLower) ||
            (blog.category?.toLowerCase() || '').includes(searchLower) ||
            (blog.status?.toLowerCase() || '').includes(searchLower) ||
            (blog.description?.toLowerCase() || '').includes(searchLower) ||
            (blog.period?.toString() || '').includes(searchLower) ||
            (blog.likeCount?.toString() || '').includes(searchLower) ||
            (blog.commentCount?.toString() || '').includes(searchLower)
        );
    };

    const columns: TableProps<Blog>['columns'] = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title)
        },
        {
            title: 'Author',
            dataIndex: 'authorName',
            key: 'authorName',
            sorter: (a, b) => a.authorName.localeCompare(b.authorName)
        },
        {
            title: 'Period',
            dataIndex: 'period',
            key: 'period',
            sorter: (a, b) => a.period - b.period
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'Published', value: 'Published' },
                { text: 'Removed', value: 'Removed' },
                { text: 'Reported', value: 'Reported' }
            ],
            onFilter: (value, record) => record.status === value,
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
            key: 'category',
            filters: blogView?.data
                ? [...new Set(blogView.data.map(blog => blog.category))]
                    .map(category => ({ text: category, value: category }))
                : [],
            onFilter: (value, record) => record.category === value
        },
        {
            title: 'Likes',
            dataIndex: 'likeCount',
            key: 'likeCount',
            sorter: (a, b) => a.likeCount - b.likeCount
        },
        {
            title: 'Comments',
            dataIndex: 'commentCount',
            key: 'commentCount',
            sorter: (a, b) => a.commentCount - b.commentCount
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
                                key: 'Draft',
                                label: 'Set as Draft',
                                onClick: () => handleStatusChange(record.id, 'Draft')
                            },
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
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                    {
                        key: 'user',
                        label: 'User Blogs',
                    },
                    {
                        key: 'admin',
                        label: 'Admin Blogs',
                    },
                ]}
            />
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Input
                    placeholder="Search blogs..."
                    prefix={<SearchOutlined />}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ width: 300 }}
                    allowClear
                />
                {activeTab === 'admin' && (
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                        Add Blog
                    </Button>
                )}
            </div>
            <Table<Blog>
                columns={columns}
                dataSource={getFilteredData()}
            />

            <Dialog open={isModalOpen} onClose={handleCancel} maxWidth="sm" fullWidth>
                <DialogTitle>Tạo Blog Mới</DialogTitle>
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

                    {/* Sử dụng UploadButton với className thêm vào */}
                    <div style={{ margin: '16px 0' }}>
                        <UploadButton
                            onImageChange={handleFileSelected}
                            onUrlChange={handleUrlChange}
                            autoUpload={false}
                            className="w-full" /* Thêm class để làm cho nút full width */
                        />
                    </div>

                    {/* Hiển thị URL hình ảnh nếu có */}
                    {imageUrl && (
                        <TextField
                            margin="dense"
                            label="Image URL"
                            fullWidth
                            value={imageUrl}
                            disabled
                        />
                    )}

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
                    <MuiButton onClick={handleCancel}>Hủy</MuiButton>
                    <MuiButton onClick={handleOk} variant="contained" color="primary">
                        Tạo
                    </MuiButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default TableContent; 