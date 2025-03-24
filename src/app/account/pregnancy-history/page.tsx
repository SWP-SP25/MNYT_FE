'use client';

import { useState } from 'react';
import styles from '../components.module.css';

// Mock data
const mockPregnancies = [
    {
        id: 1,
        startDate: '2023-01-10',
        dueDate: '2023-10-17',
        status: 'inactive',
        notes: 'First pregnancy',
        weeksCurrent: null,
        weeksTotal: 40,
    },
    {
        id: 2,
        startDate: '2024-02-15',
        dueDate: '2024-11-22',
        status: 'active',
        notes: 'Second pregnancy',
        weeksCurrent: 12,
        weeksTotal: 40,
    },
];

export default function PregnanciesPage() {
    return (
        <div className={styles.card}>
            <h3>Lịch sử thai kỳ</h3>

            {mockPregnancies.length === 0 ? (
                <p>Bạn chưa có thai kỳ nào được ghi nhận.</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Ngày bắt đầu</th>
                            <th>Ngày dự sinh</th>
                            <th>Tuần hiện tại</th>
                            <th>Ghi chú</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockPregnancies.map((pregnancy, index) => (
                            <tr key={pregnancy.id}>
                                <td>{index + 1}</td>
                                <td>{pregnancy.startDate}</td>
                                <td>{pregnancy.dueDate}</td>
                                <td>
                                    {pregnancy.weeksCurrent ?
                                        `${pregnancy.weeksCurrent}/${pregnancy.weeksTotal}` :
                                        'Đã kết thúc'}
                                </td>
                                <td>{pregnancy.notes}</td>
                                <td>
                                    <span className={`${styles.status} ${pregnancy.status === 'active' ? styles.activeStatus : styles.inactiveStatus}`}>
                                        {pregnancy.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}