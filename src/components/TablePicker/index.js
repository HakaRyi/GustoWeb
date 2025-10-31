import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // ✅ added: lấy user hiện tại
import style from './TablePicker.module.scss';
import dayjs from 'dayjs';
import LoadingModal from '../Modals/LoadingModal';
import ResultModal from '../Modals/ResultModal';
import { customFetch } from '~/config/customFetch';
import { X } from 'lucide-react'; // biểu tượng đóng
import { motion, AnimatePresence } from 'framer-motion'; // hiệu ứng mềm mại

/**
 * TablePicker
 * Props:
 *  - restaurantId
 *  - visible
 *  - onClose
 *  - onSelectTable(info) => info: { table, date, startTime, endTime }
 *  - usageTime (minutes) default 90
 *  - currentBooking (optional) => booking object from order (so we can mark user's booking)
 *
 * Behavior:
 *  - choose date first, then choose time
 *  - show reserved slots for each table (from bookings)
 *  - mark user's current booking slot in green (from currentBooking)
 *  - allow selecting even if overlaps user's current booking (because it's an update)
 *  - block selecting if overlaps booking of other users (considering buffer usageTime)
 */

function TablePicker({ restaurantId, visible, onClose, onSelectTable, usageTime = 90, currentBooking = null }) {
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [result, setResult] = useState({ visible: false, success: false, message: '' });

    const [tables, setTables] = useState([]);
    const [selectedDate, setSelectedDate] = useState(
        currentBooking ? dayjs(currentBooking.startTime).format('YYYY-MM-DD') : '',
    );
    const [bookings, setBookings] = useState([]);
    const currentUser = useSelector((state) => state.auth?.user || null);
    const currentUserId = currentUser?.id ?? currentUser?.userId ?? null;

    const [selectedTime, setSelectedTime] = useState(
        currentBooking ? dayjs(currentBooking.startTime).format('HH:mm') : '',
    );

    // -------------------------
    // Fetch tables when modal opens
    // -------------------------
    useEffect(() => {
        if (!visible) return;
        const fetchTables = async () => {
            try {
                setLoadingVisible(true);
                const res = await customFetch(
                    `https://gustoweb.onrender.com/api/RestaurantTable/getByRestaurant/${restaurantId}`,
                    { method: 'GET', headers: { 'Content-Type': 'application/json' } },
                );
                if (!res.ok) {
                    setResult({ visible: true, success: false, message: 'Lấy danh sách bàn không thành công' });
                    return;
                }
                const data = await res.json();
                // normalize: ensure each table has tableId and name (some APIs use id/name)
                setTables(Array.isArray(data) ? data : []);
            } catch (err) {
                setResult({ visible: true, success: false, message: 'Không thể tải danh sách bàn 😢' });
            } finally {
                setLoadingVisible(false);
            }
        };
        fetchTables();
    }, [restaurantId, visible]);

    // -------------------------
    // Fetch bookings for selectedDate
    // -------------------------
    useEffect(() => {
        if (!visible) return;
        if (!selectedDate) {
            setBookings([]);
            return;
        }
        const fetchBookings = async () => {
            try {
                setLoadingVisible(true);
                const res = await customFetch(
                    `https://gustoweb.onrender.com/api/Booking/bookings?restaurantId=${restaurantId}&date=${selectedDate}`,
                    { method: 'GET', headers: { 'Content-Type': 'application/json' } },
                );
                if (!res.ok) {
                    setResult({ visible: true, success: false, message: 'Lấy booking không thành công' });
                    return;
                }
                const data = await res.json();
                // expect data = array of bookings
                setBookings(Array.isArray(data) ? data : []);
            } catch (err) {
                setResult({ visible: true, success: false, message: 'Không thể tải thông tin booking 😢' });
            } finally {
                setLoadingVisible(false);
            }
        };
        fetchBookings();
    }, [restaurantId, selectedDate, visible]);

    // -------------------------
    // Build reservedSlots per table with normalized fields
    // reservedSlots: [{ start, end, rawStart, rawEnd, bookingId, userId }]
    // -------------------------
    const bookingsByTable = tables.map((t) => {
        const tableBookings = bookings
            .filter((b) => {
                // some API fields: b.tableId or b.table?.tableId
                const bTableId = b.tableId ?? b.table?.tableId ?? null;
                return bTableId === (t.tableId ?? t.id ?? null);
            })
            .map((b) => {
                // normalize start/end fields: try common variants
                const rawStart = b.startTime ?? b.start_time ?? b.start ?? b.bookingStart ?? null;
                const rawEnd = b.endTime ?? b.end_time ?? b.end ?? b.bookingEnd ?? null;
                const bookingId = b.bookingId ?? b.id ?? b.booking_id ?? null;
                const userId = b.dinerId ?? b.userId ?? b.customerId ?? b.createdById ?? null;
                return {
                    start: rawStart ? dayjs(rawStart).format('HH:mm') : null,
                    end: rawEnd ? dayjs(rawEnd).format('HH:mm') : null,
                    rawStart,
                    rawEnd,
                    bookingId,
                    userId,
                };
            })
            .filter((s) => s.rawStart && s.rawEnd) // keep only valid
            .sort((a, b) => (a.rawStart > b.rawStart ? 1 : -1));
        return {
            ...t,
            reservedSlots: tableBookings,
        };
    });

    // -------------------------
    // helpers
    // -------------------------
    const formatEndFromStart = (start, minutes) =>
        dayjs(`${selectedDate}T${start}`).add(minutes, 'minute').format('HH:mm');

    const rangeOverlaps = (aStart, aEnd, bStart, bEnd) => aStart.isBefore(bEnd) && aEnd.isAfter(bStart);

    // check overlap considering buffer (we expand existing booking by buffer minutes before/after)
    const overlapsExisting = (desiredStart, desiredEnd, existingRawStart, existingRawEnd, bufferMinutes) => {
        const bStart = dayjs(existingRawStart).subtract(bufferMinutes, 'minute');
        const bEnd = dayjs(existingRawEnd).add(bufferMinutes, 'minute');
        return rangeOverlaps(desiredStart, desiredEnd, bStart, bEnd);
    };

    // -------------------------
    // handle select
    // -------------------------
    const handleSelectTable = (table) => {
        // require date & time
        if (!selectedDate) {
            setResult({ visible: true, success: false, message: 'Vui lòng chọn ngày trước.' });
            return;
        }
        if (!selectedTime) {
            setResult({ visible: true, success: false, message: 'Vui lòng chọn giờ bắt đầu.' });
            return;
        }

        const desiredStart = dayjs(`${selectedDate}T${selectedTime}`);
        const desiredEnd = desiredStart.add(usageTime, 'minute');

        // bookings for this table (normalized)
        const tableObj = bookingsByTable.find(
            (tb) => (tb.tableId ?? tb.id ?? null) === (table.tableId ?? table.id ?? null),
        );
        const tableBookings = tableObj?.reservedSlots ?? [];

        // check conflicts: skip currentBooking (by bookingId) or skip booking that belongs to current user if it's the same bookingId?
        // We should allow update if the conflicting booking is the same booking (currentBooking.bookingId),
        // and allow update if the conflicting booking belongs to current user (because user may have multiple bookings?) — per your rule, treat user's own booking as allowed
        let conflictOther = null;
        for (const b of tableBookings) {
            // if this booking is the same booking we're updating, ignore it
            if (
                currentBooking &&
                b.bookingId &&
                currentBooking.bookingId &&
                String(b.bookingId) === String(currentBooking.bookingId)
            ) {
                continue;
            }
            // if booking belongs to current user, ignore (allow update)
            if (currentUserId && b.userId && String(b.userId) === String(currentUserId)) {
                continue;
            }
            // check overlap with buffer usageTime
            if (overlapsExisting(desiredStart, desiredEnd, b.rawStart, b.rawEnd, usageTime)) {
                conflictOther = b;
                break;
            }
        }

        if (conflictOther) {
            const start = dayjs(conflictOther.rawStart).format('HH:mm');
            const end = dayjs(conflictOther.rawEnd).format('HH:mm');
            setResult({
                visible: true,
                success: false,
                message: `Bàn ${
                    table.name ?? table.tableCode ?? ''
                } đã bị đặt ${start} - ${end} (kèm buffer). Vui lòng chọn khung khác hoặc bàn khác.`,
            });
            return;
        }

        // ok -> return selected info (table object and computed times)
        const start = selectedTime;
        const end = formatEndFromStart(selectedTime, usageTime);
        const info = {
            table,
            date: selectedDate,
            startTime: start,
            endTime: end,
        };

        onSelectTable && onSelectTable(info);
        setResult({
            visible: true,
            success: true,
            message: `Đã chọn bàn ${table.name ?? table.tableCode ?? ''} ${start} - ${end}`,
        });
        // close shortly
        setTimeout(() => {
            setResult((s) => ({ ...s, visible: false }));
            onClose && onClose();
        }, 1000);
    };

    // -------------------------
    // quick badge logic for UI (per-table) : returns { type: 'self'|'other'|'none', booking }
    // -------------------------
    const getTableBadge = (table) => {
        if (!selectedDate || !selectedTime) return { type: 'none', booking: null };
        const desiredStart = dayjs(`${selectedDate}T${selectedTime}`);
        const desiredEnd = desiredStart.add(usageTime, 'minute');
        const tableObj = bookingsByTable.find(
            (tb) => (tb.tableId ?? tb.id ?? null) === (table.tableId ?? table.id ?? null),
        );
        const tableBookings = tableObj?.reservedSlots ?? [];

        for (const b of tableBookings) {
            // same booking as currentBooking => mark self
            if (
                currentBooking &&
                b.bookingId &&
                currentBooking.bookingId &&
                String(b.bookingId) === String(currentBooking.bookingId)
            ) {
                // check overlap (without buffer) to indicate the exact booked slot
                const isOverlap = rangeOverlaps(desiredStart, desiredEnd, dayjs(b.rawStart), dayjs(b.rawEnd));
                if (isOverlap) return { type: 'self', booking: b };
            }
            // booking belongs to current user => mark self
            if (currentUserId && b.userId && String(b.userId) === String(currentUserId)) {
                const isOverlap = rangeOverlaps(desiredStart, desiredEnd, dayjs(b.rawStart), dayjs(b.rawEnd));
                if (isOverlap) return { type: 'self', booking: b };
            }
            // booking of other => if overlaps with buffer show other
            if (overlapsExisting(desiredStart, desiredEnd, b.rawStart, b.rawEnd, usageTime)) {
                // if b belongs to other user
                if (!currentUserId || !b.userId || String(b.userId) !== String(currentUserId)) {
                    return { type: 'other', booking: b };
                }
            }
        }
        return { type: 'none', booking: null };
    };

    if (!visible) return null;

    return (
        <div className={style.overlay}>
            {/* ✅ sửa lại modal: thêm motion & header đẹp hơn */}
            <motion.div
                className={style.modal}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
            >
                {/* === Header mới === */}
                <div className={style.header}>
                    <h2 className={style.title}>🪄 Chọn bàn yêu thích của bạn</h2>

                    {/* ✅ nút đóng chuyển sang góc phải, icon tròn */}
                    <button className={style.closeBtn} onClick={onClose}>
                        <X size={22} />
                    </button>
                </div>

                {/* === Date + Time Picker === */}
                <div className={style.dateTimeBox}>
                    <div className={style.datePicker}>
                        <label>📅 Ngày đặt:</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                setSelectedTime('');
                            }}
                            min={dayjs().format('YYYY-MM-DD')}
                            max={dayjs().add(30, 'day').format('YYYY-MM-DD')}
                        />
                    </div>

                    <div className={style.datePicker}>
                        <label>🕒 Giờ bắt đầu:</label>
                        <input
                            type="time"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            step="1800"
                            disabled={!selectedDate}
                        />
                    </div>
                </div>

                {/* ✅ Thêm nhắc nhỏ dễ thương */}
                {!selectedDate && (
                    <div className={style.hintText}>
                        🌸 Bạn vui lòng chọn <b>ngày</b> trước khi chọn bàn nhé!
                    </div>
                )}

                {/* === Danh sách bàn === */}
                <div className={style.wrapper} style={{ marginTop: 16 }}>
                    {bookingsByTable.map((table) => {
                        const badge = getTableBadge(table);
                        return (
                            <motion.div
                                key={table.tableId ?? table.id}
                                className={`${style.tableItem} ${badge.type === 'self' ? style.selectedTable : ''}`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSelectTable(table)}
                            >
                                <div className={style.tableHeader}>
                                    <div className={style.tableName}>
                                        {table.name ?? `Bàn ${table.tableId}`}
                                        {badge.type === 'self' && (
                                            <span className={style.greenTag}> (bạn đã chọn)</span>
                                        )}
                                    </div>
                                    {badge.type === 'other' && <span className={style.badgeRed}>Đã có người đặt</span>}
                                    {badge.type === 'self' && <span className={style.badgeGreen}>Của bạn</span>}
                                </div>

                                <div className={style.tableDesc}>{table.position ?? table.description}</div>
                                <div className={style.tablePerson}>👥 {table.personNumber ?? table.capacity} người</div>

                                {/* Slot thời gian */}
                                <div className={style.tableOption}>
                                    <span>Khung giờ đã đặt:</span>
                                    <div className={style.slotBox}>
                                        {table.reservedSlots.length === 0 ? (
                                            <div className={style.free}>Tất cả khung giờ trống 🌿</div>
                                        ) : (
                                            table.reservedSlots.map((s, i) => {
                                                const isSelf =
                                                    (currentBooking &&
                                                        s.bookingId &&
                                                        currentBooking.bookingId &&
                                                        String(s.bookingId) === String(currentBooking.bookingId)) ||
                                                    (currentUserId &&
                                                        s.userId &&
                                                        String(s.userId) === String(currentUserId));
                                                return (
                                                    <div
                                                        key={i}
                                                        className={`${style.slot} ${
                                                            isSelf ? style.selfSlot : style.otherSlot
                                                        }`}
                                                    >
                                                        {s.start} - {s.end}
                                                        {isSelf && <span style={{ marginLeft: 6 }}>(của bạn)</span>}
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <LoadingModal visible={loadingVisible} message="Đang tải..." />
                <ResultModal
                    visible={result.visible}
                    success={result.success}
                    message={result.message}
                    onClose={() => setResult((s) => ({ ...s, visible: false }))}
                />
            </motion.div>
        </div>
    );
}

export default TablePicker;
