import React, { useEffect, useState, useCallback } from 'react';
import { customFetch } from '~/config/customFetch';
import CardTable from './CardTable';
import styles from './ListTable.module.scss';

const ListTable = ({ onSuccess }) => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTables = useCallback(async () => {
        try {
            setLoading(true);
            const res = await customFetch('https://gustoweb.onrender.com/api/RestaurantTable/getByMyRestaurant', {
                method: 'GET',
            });
            if (!res.ok) throw new Error('Lỗi khi lấy danh sách bàn');
            const data = await res.json();
            setTables(data);
        } catch (error) {
            console.error('Fetch tables failed:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTables();
        if (onSuccess) {
            onSuccess(fetchTables);
        }
    }, [fetchTables, onSuccess]);

    const handleDeleteSuccess = (tableId) => {
        setTables(tables.filter((table) => table.tableId !== tableId));
    };

    if (loading) return <div className={styles.loading}>Đang tải danh sách bàn...</div>;

    return (
        <div className={styles.listTableContainer}>
            {tables.length === 0 ? (
                <p>Chưa có bàn nào.</p>
            ) : (
                tables.map((table) => (
                    <CardTable
                        key={table.tableId}
                        table={table}
                        onDeleteSuccess={handleDeleteSuccess}
                        onSuccess={fetchTables}
                    />
                ))
            )}
        </div>
    );
};

export default ListTable;
