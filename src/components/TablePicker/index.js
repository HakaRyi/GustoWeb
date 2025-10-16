import { useState, useEffect } from 'react';
import style from './TablePicker.module.css';
import dayjs from 'dayjs';
import LoadingModal from '../Modals/LoadingModal';
import ResultModal from '../Modals/ResultModal';
import { customFetch } from '~/config/customFetch';

function TablePicker({ restaurantId }) {
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [result, setResult] = useState({ visible: false, success: false, message: '' });

    const [tables, setTables] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [bookings, setBookings] = useState([]);

    // Lấy danh sách bàn
    useEffect(() => {
        const fetchTables = async () => {
            try {
                setLoadingVisible(true);
                const response = await customFetch(
                    `https://localhost:7176/api/RestaurantTable/getByRestaurant/${restaurantId}`,
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    },
                );
                if (!response.ok) setResult({ visible: true, success: false, message: 'Lấy dữ liệu không thành công' });
                const data = await response.json();
                setTables(data);
            } catch (error) {
                setResult({ visible: true, success: false, message: 'Không thể tải thông tin người dùng 😢' });
            } finally {
                setLoadingVisible(false);
            }
        };
        fetchTables();
    }, [restaurantId]);

    // Lấy danh sách booking của ngày đã chọn
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoadingVisible(true);
                const response = await customFetch(
                    `https://localhost:7176/api/Booking/bookings?restaurantId=${restaurantId}&date=${selectedDate}`,
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    },
                );
                if (!response.ok) setResult({ visible: true, success: false, message: 'Lấy dữ liệu không thành công' });
                const data = await response.json();
                setBookings(data);
            } catch (error) {
                setResult({ visible: true, success: false, message: 'Không thể tải thông tin người dùng 😢' });
            } finally {
                setLoadingVisible(false);
            }
        };
        fetchBookings();
    }, [restaurantId, selectedDate]);

    // Nhóm booking theo bàn
    const bookingsByTable = tables.map((table) => ({
        ...table,
        reservedSlots: bookings
            .filter((b) => b.tableId === table.tableId)
            .map((b) => ({
                start: dayjs(b.start_time).format('HH:mm'),
                end: dayjs(b.end_time).format('HH:mm'),
            })),
    }));

    return (
        <div className={style.container}>
            {/* Chọn ngày */}
            <div className={style.datePicker}>
                <label>Chọn ngày đặt bàn:</label>
                <input
                    type="date"
                    value={selectedDate}
                    min={dayjs().format('YYYY-MM-DD')}
                    max={dayjs().add(7, 'day').format('YYYY-MM-DD')}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>

            {/* Danh sách bàn */}
            <div className={style.wrapper}>
                {bookingsByTable.map((table, index) => (
                    <div key={index} className={style.tableItem}>
                        <div className={style.tableName}>Bàn {table.tableCode}</div>
                        <div className={style.tableDesc}>{table.description}</div>
                        <div className={style.tablePerson}>👑 {table.capacity} người</div>

                        <div className={style.tableOption}>
                            <span>Các khung giờ đã được đặt:</span>
                            {table.reservedSlots.length === 0 ? (
                                <p className={style.free}>Tất cả khung giờ trống</p>
                            ) : (
                                table.reservedSlots.map((slot, i) => (
                                    <div key={i} className={style.slot}>
                                        {slot.start} - {slot.end}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <LoadingModal visible={loadingVisible} message="Bếp đang nấu, vui lòng chờ..." />
            <ResultModal
                visible={result.visible}
                success={result.success}
                message={result.message}
                onClose={() => setResult((s) => ({ ...s, visible: false }))}
            />
        </div>
    );
}

export default TablePicker;
