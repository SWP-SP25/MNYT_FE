"use client";

import useAxios from "@/hooks/useFetchAxios";
import {
  Dropdown,
  Table,
  TableProps,
  MenuProps,
  Button,
  Input,
  Tabs,
} from "antd";
import {
  EllipsisOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button as MuiButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { Blogmanage, Blog, Category } from "@/types/blogAdmin";
import { useAuth } from "@/hooks/useAuth";
import UploadButton from "@/app/components/upload-button/upload";

interface FormData {
  category: string;
  isAnonymous: boolean;
  title: string;
  description: string;
  images: Array<{
    id: number;
    url: string;
  }>;
  period: number;
  status: string;
  publishedDay: string;
}

interface ForumFormData {
  category: string;
  isAnonymous: boolean;
  title: string;
  description: string;
  images: Array<{
    id: number;
    url: string;
  }>;
  period: number;
  status: string;
  publishedDay: string;
}

export const TableContent = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isForumModalOpen, setIsForumModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('blogs');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    category: '',
    isAnonymous: false,
    title: '',
    description: '',
    images: [],
    period: 0,
    status: '',
    publishedDay: new Date().toISOString().split("T")[0],
  });

  const [forumFormData, setForumFormData] = useState<ForumFormData>({
    category: '',
    isAnonymous: false,
    title: '',
    description: '',
    images: [],
    period: 0,
    status: '',
    publishedDay: new Date().toISOString().split("T")[0],
  });

  const { response: blogView, error: blogError, loading: blogLoading } = useAxios<Blogmanage>(
    {
      url: 'https://api-mnyt.purintech.id.vn/api/Posts/blogs',
      method: 'get'
    }
  );

  const { response: forumView, error: forumError, loading: forumLoading } = useAxios<Blogmanage>(
    {
      url: 'https://api-mnyt.purintech.id.vn/api/Posts/forums',
      method: 'get'
    }
  );

  if (blogError || forumError) {
    return <div>Error loading data</div>;
  }

  if (blogLoading || forumLoading) {
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

  const handleCreateForum = () => {
    setIsForumModalOpen(true);
  };

  const handleFileSelected = (file: File | null) => {
    setSelectedFile(file);
    console.log('File được chọn:', file?.name);
  };

  const handleUrlChange = (url: string | null) => {
    if (url) {
      setFormData(prev => ({
        ...prev,
        images: [{
          id: 0,
          url: url
        }]
      }));
      setImageUrl(url);
      console.log('URL hình ảnh nhận được:', url);
    } else {
      setFormData(prev => ({
        ...prev,
        images: []
      }));
      setImageUrl('');
    }
  };

  const handleOk = async () => {
    try {
      console.log('Form data trước khi tải ảnh:', formData);

      if (!user?.id) {
        console.error('Không có ID người dùng');
        return;
      }

      let finalImageUrl = imageUrl;
      if (selectedFile && !imageUrl) {
        // @ts-ignore
        const uploadResult = await UploadButton.uploadFile();
        if (uploadResult) {
          finalImageUrl = uploadResult;
          setImageUrl(finalImageUrl);
          setFormData(prev => ({
            ...prev,
            images: [{
              id: 0,
              url: finalImageUrl
            }]
          }));
        } else {
          console.error('Không thể tải lên hình ảnh');
          return;
        }
      }

      const blogData = {
        ...formData,
        images: finalImageUrl ? [{
          id: 0,
          url: finalImageUrl
        }] : []
      };

      console.log('Form data sau khi xử lý:', blogData);

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
        isAnonymous: false,
        title: '',
        description: '',
        images: [],
        period: 0,
        status: '',
        publishedDay: new Date().toISOString().split('T')[0]
      });
      setSelectedFile(null);
      setImageUrl('');

      window.location.reload();
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFormData({
      category: '',
      isAnonymous: false,
      title: '',
      description: '',
      images: [],
      period: 0,
      status: '',
      publishedDay: new Date().toISOString().split('T')[0]
    });
  };

  const handleForumOk = async () => {
    try {
      if (!user?.id) {
        console.error('No user ID available');
        return;
      }

      let finalImageUrl = imageUrl;
      if (selectedFile && !imageUrl) {
        // @ts-ignore
        const uploadResult = await UploadButton.uploadFile();
        if (uploadResult) {
          finalImageUrl = uploadResult;
          setImageUrl(finalImageUrl);
        } else {
          console.error('Failed to upload image');
          return;
        }
      }

      const forumData = {
        ...forumFormData,
        images: finalImageUrl ? [{
          id: 0,
          url: finalImageUrl
        }] : []
      };

      const response = await axios.post(
        `https://api-mnyt.purintech.id.vn/api/Posts/forum?authorId=${user.id}`,
        forumData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Forum post created successfully:', response.data);
      setIsForumModalOpen(false);
      setForumFormData({
        category: '',
        isAnonymous: false,
        title: '',
        description: '',
        images: [],
        period: 0,
        status: '',
        publishedDay: new Date().toISOString().split('T')[0]
      });
      setSelectedFile(null);
      setImageUrl('');

      window.location.reload();
    } catch (error) {
      console.error('Error creating forum post:', error);
    }
  };

  const handleForumCancel = () => {
    setIsForumModalOpen(false);
    setForumFormData({
      category: '',
      isAnonymous: false,
      title: '',
      description: '',
      images: [],
      period: 0,
      status: '',
      publishedDay: new Date().toISOString().split('T')[0]
    });
  };

  const handleForumChange = (field: string) => (event: any) => {
    setForumFormData(prev => ({
      ...prev,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    }));
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
    const data = activeTab === 'forums' ? forumView?.data : blogView?.data;

    if (!searchText) {
      return data;
    }

    const searchLower = searchText.toLowerCase();
    return data?.filter((blog: Blog) =>
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
      sorter: (a, b) => (a.period || 0) - (b.period || 0)
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
            color = '#ff4d4f';
            break;
          case 'Published':
            color = '#52c41a';
            break;
          case 'Reported':
            color = '#faad14';
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
        ? [...new Set(blogView.data.map((blog: Blog) => blog.category))]
            .map(category => ({ text: category as string, value: category as string }))
        : [],
      onFilter: (value, record) => record.category === value
    },
    {
      title: 'Likes',
      dataIndex: 'likeCount',
      key: 'likeCount',
      sorter: (a, b) => (a.likeCount || 0) - (b.likeCount || 0)
    },
    {
      title: 'Comments',
      dataIndex: 'commentCount',
      key: 'commentCount',
      sorter: (a, b) => (a.commentCount || 0) - (b.commentCount || 0)
    },
    {
      title: '',
      key: 'actions',
      render: (_, record) => {
        const items: MenuProps['items'] = [
          {
            key: 'view',
            label: activeTab === 'blogs' ? 'View Blog' : 'View Forum',
            onClick: () => window.open(activeTab === 'blogs' ? `/blog/${record.id}` : `/forum/${record.id}`, '_blank')
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
  ];

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'blogs',
            label: 'Blogs',
          },
          {
            key: 'forums',
            label: 'Forums',
          },
        ]}
      />
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Input
          placeholder="Search..."
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
        {activeTab === 'blogs' ? (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Add Blog
          </Button>
        ) : (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateForum}>
            Add Forum Post
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
          <FormControl fullWidth margin="dense" required>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              label="Category"
              onChange={handleChange('category')}
            >
              {Object.values(Category).map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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

          <div style={{ margin: '16px 0' }}>
            <UploadButton
              onImageChange={handleFileSelected}
              onUrlChange={handleUrlChange}
              autoUpload={false}
              className="w-full"
            />
          </div>

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

      <Dialog open={isForumModalOpen} onClose={handleForumCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Forum Post</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" required>
            <InputLabel>Category</InputLabel>
            <Select
              value={forumFormData.category}
              label="Category"
              onChange={handleForumChange('category')}
            >
              {Object.values(Category).map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            value={forumFormData.title}
            onChange={handleForumChange('title')}
            required
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={forumFormData.description}
            onChange={handleForumChange('description')}
            required
          />

          <div style={{ margin: '16px 0' }}>
            <UploadButton
              onImageChange={handleFileSelected}
              onUrlChange={handleUrlChange}
              autoUpload={false}
              className="w-full"
            />
          </div>

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
            label="Period"
            fullWidth
            type="number"
            value={forumFormData.period}
            onChange={handleForumChange('period')}
            required
          />
          <FormControl fullWidth margin="dense" required>
            <InputLabel>Status</InputLabel>
            <Select
              value={forumFormData.status}
              label="Status"
              onChange={handleForumChange('status')}
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <label>
              <input
                type="checkbox"
                checked={forumFormData.isAnonymous}
                onChange={handleForumChange('isAnonymous')}
              />
              Anonymous Post
            </label>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleForumCancel}>Cancel</MuiButton>
          <MuiButton onClick={handleForumOk} variant="contained" color="primary">
            Create
          </MuiButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TableContent;
