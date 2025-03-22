'use client'

import useAxios from "@/hooks/useFetchAxios"
import { PreganacyStandard } from "@/types/pregnancyStandard";
import { Dropdown, Table, TableProps, MenuProps, Button } from "antd";
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button as MuiButton } from '@mui/material';
import axios from 'axios';

interface FormData {
    pregnancyType: string;
    type: string;
    period: number;
    minimum: number;
    maximum: number;
    unit: string;
}

export const TableContent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        pregnancyType: '',
        type: '',
        period: 0,
        minimum: 0,
        maximum: 0,
        unit: ''
    });
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const {response: pregnancyStandardView, error: pregnancyStandardError, loading: pregnancyStandardLoading} = useAxios<PreganacyStandard[]>(
    {
        url: 'https://api-mnyt.purintech.id.vn/api/PregnancyStandard',
        method: 'get'
    });

    if (pregnancyStandardError) {
        return <div>Error loading pregnancy standard data</div>;
    }

    if (pregnancyStandardLoading) {
        return <div>Loading...</div>;
    }

    const showUpdateModal = (record: PreganacyStandard) => {
        setFormData({
            pregnancyType: record.pregnancyType,
            type: record.type,
            period: record.period,
            minimum: record.minimum,
            maximum: record.maximum,
            unit: record.unit
        });
        setSelectedId(record.id);
        setIsUpdate(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (record: PreganacyStandard) => {
        try {
            await axios.delete(`https://api-mnyt.purintech.id.vn/api/PregnancyStandard/${record.id}`);
            window.location.reload();
        } catch (error) {
            console.error('Error deleting pregnancy standard:', error);
        }
    };

    const handleCreate = () => {
        setFormData({
            pregnancyType: '',
            type: '',
            period: 0,
            minimum: 0,
            maximum: 0,
            unit: ''
        });
        setSelectedId(null);
        setIsUpdate(false);
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            if (isUpdate && selectedId) {
                const response = await axios.put(
                    `https://api-mnyt.purintech.id.vn/api/PregnancyStandard/${selectedId}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                console.log('Pregnancy standard updated successfully:', response.data);
            } else {
                const response = await axios.post(
                    'https://api-mnyt.purintech.id.vn/api/PregnancyStandard',
                    [formData],
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                console.log('Pregnancy standard created successfully:', response.data);
            }
            setIsModalOpen(false);
            window.location.reload();
        } catch (error) {
            console.error('Error saving pregnancy standard:', error);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setFormData({
            pregnancyType: '',
            type: '',
            period: 0,
            minimum: 0,
            maximum: 0,
            unit: ''
        });
    };

    const handleChange = (field: string) => (event: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const columns: TableProps<PreganacyStandard>['columns'] = [
        {
            title: 'Pregnancy Type',
            dataIndex: 'pregnancyType',
            key: 'pregnancyType'
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type'
        },
        {
            title: 'Period',
            dataIndex: 'period',
            key: 'period'
        },
        {
            title: 'Minimum',
            dataIndex: 'minimum',
            key: 'minimum'
        },
        {
            title: 'Maximum',
            dataIndex: 'maximum',
            key: 'maximum'
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit'
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
                    Add Pregnancy Standard
                </Button>
            </div>
            <Table<PreganacyStandard> columns={columns} dataSource={pregnancyStandardView || []}/>
            
            <Dialog open={isModalOpen} onClose={handleCancel} maxWidth="sm" fullWidth>
                <DialogTitle>{isUpdate ? 'Update Pregnancy Standard' : 'Create New Pregnancy Standard'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Pregnancy Type"
                        fullWidth
                        value={formData.pregnancyType}
                        onChange={handleChange('pregnancyType')}
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
                        label="Period"
                        fullWidth
                        type="number"
                        value={formData.period}
                        onChange={handleChange('period')}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Minimum"
                        fullWidth
                        type="number"
                        value={formData.minimum}
                        onChange={handleChange('minimum')}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Maximum"
                        fullWidth
                        type="number"
                        value={formData.maximum}
                        onChange={handleChange('maximum')}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Unit"
                        fullWidth
                        value={formData.unit}
                        onChange={handleChange('unit')}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <MuiButton onClick={handleCancel}>Cancel</MuiButton>
                    <MuiButton onClick={handleOk} variant="contained" color="primary">
                        {isUpdate ? 'Update' : 'Create'}
                    </MuiButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default TableContent;
