'use client';

import React from 'react';
import { Card, CardBody, CardHeader, Button } from "@nextui-org/react";
import AdminLayout from '@/app/components/AdminLayout';
import "./page.css";
const AdminDashboard = () => {
    const recentOrders = [
        { id: 1, customer: 'John Doe', amount: '$150', status: 'Completed' },
        { id: 2, customer: 'Jane Smith', amount: '$200', status: 'Pending' },
        { id: 3, customer: 'Mike Johnson', amount: '$175', status: 'Processing' },
    ];

    return (
        <AdminLayout>
            <div className="dashboard">
                <h2 className="mb-4">Dashboard Overview</h2>

                <div className="row mb-4">
                    <div className="col-md-4">
                        <Card>
                            <CardBody>
                                <h3>Total Users</h3>
                                <p className="h2">1,234</p>
                                <Button color="primary" variant="flat">
                                    View Details
                                </Button>
                            </CardBody>
                        </Card>
                    </div>
                    <div className="col-md-4">
                        <Card>
                            <CardBody>
                                <h3>Total Orders</h3>
                                <p className="h2">567</p>
                                <Button color="primary" variant="flat">
                                    View Details
                                </Button>
                            </CardBody>
                        </Card>
                    </div>
                    <div className="col-md-4">
                        <Card>
                            <CardBody>
                                <h3>Total Revenue</h3>
                                <p className="h2">$12,345</p>
                                <Button color="primary" variant="flat">
                                    View Details
                                </Button>
                            </CardBody>
                        </Card>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <h3>Recent Orders</h3>
                    </CardHeader>
                    <CardBody>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>ORDER ID</th>
                                        <th>CUSTOMER</th>
                                        <th>AMOUNT</th>
                                        <th>STATUS</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td>{order.id}</td>
                                            <td>{order.customer}</td>
                                            <td>{order.amount}</td>
                                            <td>{order.status}</td>
                                            <td>
                                                <Button size="sm" color="primary" variant="flat">
                                                    View
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;