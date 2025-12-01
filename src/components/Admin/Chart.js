import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Chart = ({ data }) => {
    // Nếu chưa có dữ liệu thì hiện thông báo hoặc loading
    if (!data || data.length === 0) {
        return <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>Chưa có dữ liệu biểu đồ</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                    // Format số tiền cho đẹp (VD: 1.000k)
                    tickFormatter={(value) => new Intl.NumberFormat('vi-VN', { notation: "compact" }).format(value)}
                />
                <Tooltip
                    formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
                />
                <Line type="monotone" dataKey="total" stroke="#EF476F" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default Chart;