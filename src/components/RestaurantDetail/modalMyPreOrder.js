import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { customFetch } from '~/config/customFetch';
import CardItem from './CardItem';
import styles from './modalMyPreOrder.module.scss';
import TablePicker from '../TablePicker';
import ResultModal from '../Modals/ResultModal';
import dayjs from 'dayjs';

function ModalMyPreOrder({ isOpen, onClose, restaurantId }) {
    const [numPeople, setNumPeople] = useState(1);
    const [note, setNote] = useState('');
    const [selectedTable, setSelectedTable] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [orders, setOrders] = useState([]);
    const [restaurantName, setRestaurantName] = useState('Cơm Tấm Sà Bì Chưởng');
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pendingOrderId, setPendingOrderId] = useState(null); // ✅ Thêm state để lưu orderId
    const [tablePickerVisible, setTablePickerVisible] = useState(false);
    const [selectedTableInfo, setSelectedTableInfo] = useState(null);
    const [result, setResult] = useState({ visible: false, success: false, message: '' });
    const [booking, setBooking] = useState(null);

    const { isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    //Xử lý chọn bàn:
    const handleSelectTable = (info) => {
        setSelectedTableInfo(info); // lưu lại toàn bộ thông tin (table + time)
        setTablePickerVisible(false); // đóng modal chọn bàn
    };

    // Tính tổng tiền
    const total = orders.reduce((sum, item) => sum + item.price * item.quantity, 0);
    useEffect(() => {
        console.log('Selected Table Info:', selectedTableInfo);
    }, [selectedTableInfo]);

    // Gọi API để lấy dữ liệu đơn hàng và danh sách bàn
    useEffect(() => {
        if (!isOpen || !isAuthenticated || !restaurantId) {
            if (!restaurantId) {
                setError('Không tìm thấy ID nhà hàng. Vui lòng thử lại.');
            }
            return;
        }

        //Lấy đơn hàn đang chờ
        const fetchPendingOrder = async () => {
            try {
                setLoading(true);
                setError(null);

                const orderResponse = await customFetch(
                    `https://gustoweb.onrender.com/api/Order/getMyOrderPending/${restaurantId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                );

                if (!orderResponse.ok) {
                    const errorData = await orderResponse.json();
                    throw new Error(errorData.message || `Lỗi tải đơn hàng (mã lỗi: ${orderResponse.status})`);
                }

                const orderData = await orderResponse.json();

                if (orderData.exists && orderData.data) {
                    const orderDetails = orderData.data.orderDetails || [];
                    const formattedOrders = orderDetails
                        .filter((detail) => detail !== null)
                        .map((detail) => {
                            // ✅ FIXED: Tính price CHÍNH XÁC - giá của MỖI món
                            const basePrice = detail.food?.price || 0;
                            const optionalPrice = detail.optionals?.reduce((sum, opt) => sum + opt.price, 0) || 0;
                            const pricePerItem = basePrice + optionalPrice;

                            return {
                                id: detail.orderDetailId,
                                name: detail.food?.name || 'Unknown Food',
                                taste: detail.tastes?.length > 0 ? detail.tastes[0].taste1 : '',
                                optionals: detail.optionals?.map((opt) => opt.title) || [],
                                price: pricePerItem,
                                quantity: detail.numberOfFood,
                                image: detail.food?.foodUrl || process.env.PUBLIC_URL + '/LOGOGUSTO2.png',
                            };
                        });

                    setOrders(formattedOrders);
                    setNumPeople(orderData.data.numOfPeople || 1);
                    setNote(orderData.data.note || '');
                    setSelectedTable(orderData.data.booking.tableId || '');
                    setStartTime(
                        orderData.data.booking?.startTime ? orderData.data.booking.startTime.slice(0, 16) : '',
                    );
                    setEndTime(orderData.data.booking?.endTime ? orderData.data.booking.endTime.slice(0, 16) : '');
                    setRestaurantName(orderData.data.booking?.restaurant?.fullName || 'Unknown Restaurant');
                    setPendingOrderId(orderData.data.orderId); // ✅ Lưu orderId
                    setSelectedTableInfo({
                        table: orderData.data.booking.table,
                        date: orderData.data.booking.startTime
                            ? dayjs(orderData.data.booking.startTime).format('YYYY-MM-DD')
                            : '',
                        startTime: orderData.data.booking.startTime
                            ? dayjs(orderData.data.booking.startTime).format('HH:mm')
                            : 'bắt đầu',
                        endTime: orderData.data.booking.endTime
                            ? dayjs(orderData.data.booking.endTime).format('HH:mm')
                            : 'kết thúc',
                    });
                    setBooking(orderData.data.booking);
                } else {
                    setOrders([]);
                    setNumPeople(1);
                    setNote('');
                    setSelectedTable('');
                    setStartTime('');
                    setEndTime('');
                    setRestaurantName('Unknown Restaurant');
                    setPendingOrderId(null);
                }
            } catch (err) {
                console.error('Error fetching pending order:', err);
                setError(err.message || 'Không thể tải đơn hàng. Vui lòng thử lại.');
                setOrders([]);
                setPendingOrderId(null);
            }
        };

        // const fetchAvailableTables = async () => {
        //     try {
        //         const tableResponse = await customFetch(
        //             `https://gustoweb.onrender.com/api/RestaurantTable/getByRestaurantIdAndAvailable/${restaurantId}`,
        //             {
        //                 method: 'GET',
        //                 headers: {
        //                     'Content-Type': 'application/json',
        //                 },
        //             },
        //         );

        //         if (!tableResponse.ok) {
        //             const errorData = await tableResponse.json();
        //             throw new Error(errorData.message || `Lỗi tải danh sách bàn (mã lỗi: ${tableResponse.status})`);
        //         }

        //         const tableData = await tableResponse.json();

        //         const formattedTables = tableData
        //             .filter((table) => table.status === 'Available')
        //             .map((table) => ({
        //                 id: table.tableId,
        //                 name: table.name,
        //                 personNumber: table.personNumber ?? 'Không xác định',
        //                 position: table.position ?? 'Không xác định',
        //                 isVip: table.isVip,
        //                 minCharge: table.minCharge,
        //                 deposit: table.deposit,
        //             }));

        //         setTables(formattedTables);
        //     } catch (err) {
        //         console.error('Error fetching available tables:', err);
        //         setError(err.message || 'Không thể tải danh sách bàn. Vui lòng thử lại.');
        //         setTables([]);
        //     }
        // };

        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchPendingOrder() /*fetchAvailableTables()*/]);
            setLoading(false);
        };

        fetchData();
    }, [isOpen, restaurantId, isAuthenticated]);

    // ✅ Hàm gọi API update order
    const handleUpdateOrder = async () => {
        if (!selectedTableInfo) {
            setResult({
                visible: true,
                success: false,
                message: 'Vui lòng chọn bàn trước khi xác nhận!',
            });
            return;
        }

        if (!pendingOrderId) {
            // ✅ added: kiểm tra order hợp lệ
            setResult({
                visible: true,
                success: false,
                message: 'Không tìm thấy đơn hàng để cập nhật.',
            });
            return;
        }

        try {
            // ✅ Chuẩn bị dữ liệu để gửi API
            const updateData = {
                startTime: `${selectedTableInfo.date}T${selectedTableInfo.startTime}`,
                endTime: `${selectedTableInfo.date}T${selectedTableInfo.endTime}`,
                tableId: selectedTableInfo.table.tableId,
                numberOfPeople: selectedTableInfo.table.capacity || null,
                discountAmount: null,
                note: note,
                promotionId: null,
            };

            console.log('Updating order with data:', updateData);

            const response = await customFetch(
                `https://gustoweb.onrender.com/api/Order/updateOrder/${pendingOrderId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updateData),
                },
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Lỗi cập nhật đơn hàng (mã lỗi: ${response.status})`);
            }
            setResult({
                visible: true,
                success: true,
                message: 'Cập nhật đơn hàng thành công 🎉',
            });
            setSelectedTableInfo(null);
            onClose();
            console.log('Order updated successfully');
            return true;
        } catch (err) {
            console.error('Error updating order:', err);
            setError(`Không thể cập nhật đơn hàng: ${err.message}`);
            setResult({
                visible: true,
                success: false,
                message: error.message || 'Không thể cập nhật đơn hàng 😢',
            });
            return false;
        }
    };

    // ✅ Xử lý khi nhấn nút "Đi đến thanh toán"
    const handleNavigateToPayment = async () => {
        // ✅ Validate dữ liệu trước khi tiếp tục
        if (!startTime || !endTime) {
            setError('Vui lòng chọn thời gian bắt đầu và kết thúc.');
            return;
        }

        if (!selectedTable) {
            setError('Vui lòng chọn bàn.');
            return;
        }

        if (orders.length === 0) {
            setError('Vui lòng thêm ít nhất một món vào đơn hàng.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // ✅ Gọi API update order trước
            const updateSuccess = await handleUpdateOrder();

            if (updateSuccess) {
                // ✅ Nếu update thành công, điều hướng đến trang thanh toán
                navigate('/preview-before-pay', {
                    state: {
                        orders,
                        restaurantName,
                        total,
                        restaurantId,
                        startTime,
                        endTime,
                        numPeople,
                        note,
                        selectedTable,
                        orderId: pendingOrderId, // ✅ Truyền orderId sang trang thanh toán
                    },
                });
            }
        } catch (err) {
            console.error('Error in navigation process:', err);
            setError('Có lỗi xảy ra khi xử lý đơn hàng.');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Xử lý cập nhật số lượng
    const handleUpdateQuantity = (itemId, newQty, isOptimistic = false) => {
        setOrders((prevOrders) =>
            prevOrders.map((item) => {
                if (item.id === itemId) {
                    return { ...item, quantity: newQty };
                }
                return item;
            }),
        );
    };

    // Xử lý xóa orderDetail
    const handleRemoveItem = async (orderDetailId) => {
        try {
            const response = await customFetch(
                `https://gustoweb.onrender.com/api/OrderDetail/deleteOrderDetail/${orderDetailId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể xóa món ăn.');
            }

            setOrders((prevOrders) => prevOrders.filter((item) => item.id !== orderDetailId));
        } catch (err) {
            console.error('Error deleting orderDetail:', err);
            setError(err.message || 'Không thể xóa món ăn. Vui lòng thử lại.');
        }
    };

    // Kiểm tra startTime <= endTime
    const handleStartTimeChange = (e) => {
        const newStartTime = e.target.value;
        setStartTime(newStartTime);
        if (endTime && new Date(newStartTime) > new Date(endTime)) {
            setError('Thời gian bắt đầu phải nhỏ hơn hoặc bằng thời gian kết thúc.');
        } else {
            setError(null);
        }
    };

    const handleEndTimeChange = (e) => {
        const newEndTime = e.target.value;
        setEndTime(newEndTime);
        if (startTime && new Date(startTime) > new Date(newEndTime)) {
            setError('Thời gian kết thúc phải lớn hơn hoặc bằng thời gian bắt đầu.');
        } else {
            setError(null);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains(styles.overlay)) {
            onClose();
        }
    };

    if (!isOpen) return null;

    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    if (!restaurantId) {
        return (
            <div className={styles.overlay} onClick={handleOverlayClick}>
                <div className={styles.modal}>
                    <div className={styles.header}>
                        <h2>ĐƠN HÀNG ĐẶT TRƯỚC CỦA BẠN</h2>
                        <button onClick={onClose} className={styles.exitBtn}>
                            X
                        </button>
                    </div>
                    <p className={styles.error}>Không tìm thấy ID nhà hàng. Vui lòng thử lại.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>ĐƠN HÀNG ĐẶT TRƯỚC CỦA BẠN</h2>
                    <button onClick={onClose} className={styles.exitBtn}>
                        X
                    </button>
                </div>

                <h3 className={styles.restaurantName}>{restaurantName}</h3>

                {loading && <p className={styles.loading}>Đang tải dữ liệu...</p>}
                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.timeAndTable}>
                    <div className={styles.timeGroup}>
                        <span>Thời gian bắt đầu</span>
                        <input
                            type="datetime-local"
                            value={startTime}
                            onChange={handleStartTimeChange}
                            className={styles.timeInput}
                            readOnly
                        />
                    </div>
                    <div className={styles.timeGroup}>
                        <span>Thời gian kết thúc</span>
                        <input
                            type="datetime-local"
                            value={endTime}
                            onChange={handleEndTimeChange}
                            className={styles.timeInput}
                            readOnly
                        />
                    </div>
                    <div className={styles.tableSelectWrapper}>
                        <button className={styles.selectTableBtn} onClick={() => setTablePickerVisible(true)}>
                            {selectedTableInfo
                                ? `Đổi bàn (Đang chọn: ${selectedTableInfo.table?.name || 'Chưa chọn'} - ${
                                      selectedTableInfo.startTime
                                  } → ${selectedTableInfo.endTime})`
                                : 'Chọn bàn'}
                        </button>

                        {/* ✅ Nếu đã chọn bàn thì hiển thị thông tin tóm tắt */}
                        {selectedTableInfo && (
                            <div className={styles.selectedTableInfo}>
                                <p>
                                    <strong>Bàn:</strong> {selectedTableInfo.table?.name || 'Chưa có'}
                                </p>
                                <p>
                                    <strong>Sức chứa:</strong> {selectedTableInfo.table?.personNumber || 'Chưa có'}{' '}
                                    người
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.itemContainer}>
                    <div className={styles.itemList}>
                        {orders.length === 0 && !loading ? (
                            <p className={styles.noItems}>Chưa có món nào trong đơn hàng.</p>
                        ) : (
                            orders.map((item) => (
                                <CardItem
                                    key={item.id}
                                    item={item}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemoveItem={handleRemoveItem}
                                />
                            ))
                        )}
                    </div>
                </div>

                <div className={styles.footer}>
                    <div className={styles.left}>
                        <div className={styles.inputGroupWrapper}>
                            {' '}
                            {/* Thêm wrapper để chứa số người và ghi chú */}
                            <div className={styles.inputGroup}>
                                <label>Số người</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={numPeople}
                                    onChange={(e) => setNumPeople(Number(e.target.value))}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Ghi chú</label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Thêm ghi chú..."
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.right}>
                        <p className={styles.total}>
                            Tạm tính: <span>{total.toLocaleString()}đ</span>
                        </p>
                        {selectedTable ? (
                            <button onClick={handleNavigateToPayment} className={styles.payBtn} disabled={loading}>
                                {loading ? 'Đang xử lý...' : 'Đi đến thanh toán'}
                            </button>
                        ) : (
                            <button onClick={() => setTablePickerVisible(true)} className={styles.selectTableBtn}>
                                Chọn bàn
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <TablePicker
                visible={tablePickerVisible}
                restaurantId={restaurantId}
                onClose={() => setTablePickerVisible(false)}
                onSelectTable={(info) => {
                    setSelectedTableInfo(info);
                    setSelectedTable(info.table.tableId);
                    setStartTime(`${info.date}T${info.startTime}`);
                    setEndTime(`${info.date}T${info.endTime}`);
                    setTablePickerVisible(false);
                }}
                currentBooking={booking}
            />
            <ResultModal
                visible={result.visible}
                success={result.success}
                message={result.message}
                onClose={() => setResult((s) => ({ ...s, visible: false }))}
            />
        </div>
    );
}

export default ModalMyPreOrder;
