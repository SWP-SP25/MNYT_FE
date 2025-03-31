'use client'

import useAxios from "@/hooks/useFetchAxios"
import { PreganacyStandard } from "@/types/pregnancyStandard";
import { Dropdown, Table, TableProps, MenuProps, Button, Upload, message } from "antd";
import { EllipsisOutlined, PlusOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button as MuiButton } from '@mui/material';
import axios from 'axios';
import * as XLSX from 'xlsx';

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
    const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
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

    const handleExcelUpload = async () => {
        if (!excelFile) return;

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const data = e.target?.result;
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);

                    // Get the first row to check column names
                    const firstRow = jsonData[0];
                    if (!firstRow) {
                        throw new Error('Excel file is empty');
                    }

                    // Map of possible column names to their standard names
                    const columnNameMap: { [key: string]: string } = {
                        'Pregnancy Type': 'pregnancyType',
                        'PregnancyType': 'pregnancyType',
                        'pregnancy type': 'pregnancyType',
                        'Type': 'type',
                        'type': 'type',
                        'Period': 'period',
                        'period': 'period',
                        'Minimum': 'minimum',
                        'minimum': 'minimum',
                        'Min': 'minimum',
                        'Maximum': 'maximum',
                        'maximum': 'maximum',
                        'Max': 'maximum',
                        'Unit': 'unit',
                        'unit': 'unit'
                    };

                    // Log available columns for debugging
                    console.log('Available columns:', Object.keys(firstRow));

                    // Validate and transform the data
                    const transformedData = jsonData.map((row: any, index: number) => {
                        // Find the actual column names in the row
                        const actualColumns = Object.keys(row);
                        const missingFields: string[] = [];
                        const transformedRow: any = {};

                        // Check each required field
                        ['pregnancyType', 'type', 'period', 'minimum', 'maximum', 'unit'].forEach(field => {
                            const foundColumn = actualColumns.find(col => 
                                columnNameMap[col] === field
                            );

                            if (!foundColumn) {
                                missingFields.push(field);
                            } else {
                                transformedRow[field] = row[foundColumn];
                            }
                        });

                        if (missingFields.length > 0) {
                            throw new Error(
                                `Row ${index + 1} is missing required fields: ${missingFields.join(', ')}. ` +
                                `Available columns are: ${actualColumns.join(', ')}`
                            );
                        }

                        // Validate numeric fields
                        const period = Number(transformedRow.period);
                        const minimum = Number(transformedRow.minimum);
                        const maximum = Number(transformedRow.maximum);

                        if (isNaN(period) || isNaN(minimum) || isNaN(maximum)) {
                            throw new Error(
                                `Row ${index + 1} has invalid numeric values. ` +
                                `Period: ${transformedRow.period}, ` +
                                `Minimum: ${transformedRow.minimum}, ` +
                                `Maximum: ${transformedRow.maximum}`
                            );
                        }

                        // Validate minimum is less than maximum
                        if (minimum > maximum) {
                            throw new Error(
                                `Row ${index + 1}: Minimum value (${minimum}) is greater than Maximum value (${maximum})`
                            );
                        }

                        return {
                            pregnancyType: String(transformedRow.pregnancyType).trim(),
                            type: String(transformedRow.type).trim(),
                            period: period,
                            minimum: minimum,
                            maximum: maximum,
                            unit: String(transformedRow.unit).trim()
                        };
                    });

                    // Send the data to the API
                    const response = await axios.post(
                        'https://api-mnyt.purintech.id.vn/api/PregnancyStandard',
                        transformedData,
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    );

                    if (response.status === 200) {
                        message.success(`Successfully imported ${transformedData.length} records`);
                        setIsExcelModalOpen(false);
                        setExcelFile(null);
                        window.location.reload();
                    }
                } catch (error: any) {
                    message.error(error.message || 'Error processing Excel file');
                    console.error('Error processing Excel file:', error);
                }
            };
            reader.readAsArrayBuffer(excelFile);
        } catch (error) {
            message.error('Error reading Excel file');
            console.error('Error reading Excel file:', error);
        }
    };

    const handleExcelFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setExcelFile(event.target.files[0]);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Please select at least one item to delete');
            return;
        }

        try {
            // Delete each selected item
            await Promise.all(
                selectedRowKeys.map(id =>
                    axios.delete(`https://api-mnyt.purintech.id.vn/api/PregnancyStandard/${id}`)
                )
            );
            
            message.success('Selected items deleted successfully');
            setSelectedRowKeys([]);
            window.location.reload();
        } catch (error) {
            console.error('Error deleting pregnancy standards:', error);
            message.error('Failed to delete selected items');
        }
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
    };

    const columns: TableProps<PreganacyStandard>['columns'] = [
        {
            title: 'Pregnancy Type',
            dataIndex: 'pregnancyType',
            key: 'pregnancyType',
            filters: pregnancyStandardView ? [...new Set(pregnancyStandardView.map(item => item.pregnancyType))].map(type => ({
                text: type,
                value: type
            })) : [],
            onFilter: (value, record) => record.pregnancyType === value,
            sorter: (a, b) => a.pregnancyType.localeCompare(b.pregnancyType)
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            filters: pregnancyStandardView ? [...new Set(pregnancyStandardView.map(item => item.type))].map(type => ({
                text: type,
                value: type
            })) : [],
            onFilter: (value, record) => record.type === value,
            sorter: (a, b) => a.type.localeCompare(b.type)
        },
        {
            title: 'Period',
            dataIndex: 'period',
            key: 'period',
            sorter: (a, b) => a.period - b.period
        },
        {
            title: 'Minimum',
            dataIndex: 'minimum',
            key: 'minimum',
            sorter: (a, b) => a.minimum - b.minimum
        },
        {
            title: 'Maximum',
            dataIndex: 'maximum',
            key: 'maximum',
            sorter: (a, b) => a.maximum - b.maximum
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit',
            sorter: (a, b) => a.unit.localeCompare(b.unit)
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
            <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                    Add New
                </Button>
                <Button icon={<UploadOutlined />} onClick={() => setIsExcelModalOpen(true)}>
                    Import Excel
                </Button>
                {selectedRowKeys.length > 0 && (
                    <Button 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={handleBulkDelete}
                    >
                        Delete Selected ({selectedRowKeys.length})
                    </Button>
                )}
            </div>
            <Table<PreganacyStandard> 
                rowSelection={rowSelection}
                rowKey="id"
                columns={columns} 
                dataSource={pregnancyStandardView || []}
            />
            
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

            <Dialog open={isExcelModalOpen} onClose={() => setIsExcelModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Import Pregnancy Standards from Excel</DialogTitle>
                <DialogContent>
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleExcelFileChange}
                        style={{ marginTop: '16px' }}
                    />
                    <div style={{ marginTop: '16px' }}>
                        <p style={{ color: '#666', marginBottom: '8px' }}>
                            Please ensure your Excel file has the following columns:
                        </p>
                        <ul style={{ color: '#666', margin: '0', paddingLeft: '20px' }}>
                            <li>Pregnancy Type (text)</li>
                            <li>Type (text)</li>
                            <li>Period (number)</li>
                            <li>Minimum (number)</li>
                            <li>Maximum (number)</li>
                            <li>Unit (text)</li>
                        </ul>
                        <p style={{ color: '#666', marginTop: '8px' }}>
                            Note: Minimum value must be less than Maximum value
                        </p>
                    </div>
                </DialogContent>
                <DialogActions>
                    <MuiButton onClick={() => setIsExcelModalOpen(false)}>Cancel</MuiButton>
                    <MuiButton 
                        onClick={handleExcelUpload} 
                        variant="contained" 
                        color="primary"
                        disabled={!excelFile}
                    >
                        Import
                    </MuiButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default TableContent;
