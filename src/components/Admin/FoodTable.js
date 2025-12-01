import React from "react";
import styles from "./FoodTable.module.scss";

// 👇 Nhận prop 'data' (danh sách món ăn)
const FoodTable = ({ data }) => {
    if (!data || data.length === 0) {
        return <p style={{ textAlign: 'center', color: '#888' }}>Chưa có dữ liệu món ăn bán chạy.</p>;
    }

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tên Món</th>
                        <th>Nhà Hàng</th>
                        <th>Đã Bán</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((food, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td style={{ fontWeight: 'bold' }}>{food.foodName}</td>
                            <td>{food.restaurantName}</td>
                            <td>
                                <span style={{
                                    backgroundColor: '#e7f1ff',
                                    color: '#0d6efd',
                                    padding: '4px 10px',
                                    borderRadius: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    {food.soldCount}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FoodTable;