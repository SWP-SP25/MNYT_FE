'use client';

import React from 'react';
import AdminLayout from '../components/admin-layout';
import { TableContent } from './components/table-content';


const AdminDashboard = () => {
    return (
        <AdminLayout>
            <h3>Memebership sale report</h3>
            <TableContent></TableContent>
        </AdminLayout>
    );
};

export default AdminDashboard;