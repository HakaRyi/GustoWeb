import React, { useEffect, useRef, useState } from 'react';
import style from './FeedbackModal.module.scss';
import { customFetch } from '~/config/customFetch'; // chỉnh đường dẫn nếu cần
import ImageUploader from '~/components/Cloundinary/ImageUploader';

/**
 * Props:
 * - visible: boolean
 * - booking: object (has bookingId, foodReviews[])
 * - order: object (has orderId, orderDetails[])
 * - onClose: fn
 * - onSaved: fn(savedData)
 */
export default function FeedbackModal({ visible, booking, order, onClose, onSaved }) {
    const [items, setItems] = useState([]); // { itemId, name, img, rating, comment, orderDetailId }
    const [saving, setSaving] = useState(false);
    const [result, setResult] = useState({ visible: false, success: false, message: '' });

    const [isAnonymous, setIsAnonymous] = useState(false);
    const fileInputRefs = useRef([]); // để trigger chọn file
    const [uploadingIndex, setUploadingIndex] = useState(null);

    useEffect(() => {
        if (!visible) return;

        const orderDetails = Array.isArray(order?.orderDetails) ? order.orderDetails : [];

        // build items from orderDetails
        const initialItems = orderDetails.map((d) => {
            const itemId = d.foodId;
            return {
                itemId,
                orderDetailId: d.orderDetailId,
                name: d.food?.name ?? 'Món ăn',
                img: d.food?.foodUrl ?? 'https://i.pinimg.com/1200x/a6/24/d1/a624d160e5f627d98fc22a442fb0423c.jpg',
                rating: null,
                comment: '',
            };
        });

        // prefill from booking.foodReviews (if any)
        const firstOrder = booking?.orders?.[0];

        // Check if foodReviews của order đầu tiên là mảng
        const reviews = Array.isArray(firstOrder?.foodReviews) ? firstOrder.foodReviews : [];

        // Map từng món ăn trong đơn để gán rating/comment cũ
        const merged = initialItems.map((it) => {
            const r = reviews.find((rv) => rv.foodId === it.itemId);
            if (r) {
                return {
                    ...it,
                    rating: r.rating ?? null,
                    comment: r.description ?? r.comment ?? '',
                };
            }
            return it;
        });

        setItems(merged);
    }, [visible, booking, order]);

    const handleChange = (idx, key, value) => {
        setItems((prev) => {
            const next = [...prev];
            next[idx] = { ...next[idx], [key]: value };
            return next;
        });
    };

    const validate = () => {
        return { ok: true };
    };

    const handleSelectImage = (index) => {
        fileInputRefs.current[index]?.click();
    };

    // Khi chọn file xong
    const handleImageChange = async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploadingIndex(index);
            const imageUrl = await ImageUploader(file);

            // cập nhật lại items
            setItems((prev) => prev.map((item, i) => (i === index ? { ...item, img: imageUrl } : item)));
        } catch (err) {
            console.error('Upload image failed:', err);
            alert('Không thể tải ảnh lên, vui lòng thử lại.');
        } finally {
            setUploadingIndex(null);
        }
    };

    const handleSave = async () => {
        const v = validate();
        if (!v.ok) {
            setResult({ visible: true, success: false, message: v.message || 'Validation failed' });
            return;
        }
        console.log('Order', order);
        const payload = {
            feedbacks: items.map((it) => ({
                dinerId: order.dinerId,
                foodId: it.itemId,
                rating: it.rating ?? null,
                description: it.comment ?? '',
                isAnonymous: isAnonymous,
                imageUrl: it.img || 'https://i.pinimg.com/1200x/a6/24/d1/a624d160e5f627d98fc22a442fb0423c.jpg',
                orderId: order.orderId,
            })),
        };

        try {
            setSaving(true);
            // choose endpoint & method according to whether booking already had reviews
            const hasExisting = Array.isArray(order.foodReviews) && order.foodReviews.length > 0;

            console.log(hasExisting);
            const url = hasExisting ? `https://localhost:7176/api/FoodReview` : `https://localhost:7176/api/FoodReview`;
            const method = hasExisting ? 'PUT' : 'POST';

            const res = await customFetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const txt = await res.text().catch(() => '');
                setResult({ visible: true, success: false, message: 'Lưu thất bại. ' + (txt || '') });
                return;
            }

            const data = await res.json().catch(() => null);
            setResult({ visible: true, success: true, message: 'Lưu feedback thành công!' });

            if (typeof onSaved === 'function') {
                onSaved(data ?? payload);
            }

            // đóng modal sau 700ms
            setTimeout(() => {
                onClose();
            }, 700);
        } catch (err) {
            console.error(err);
            setResult({ visible: true, success: false, message: 'Có lỗi khi gửi feedback. Thử lại sau.' });
        } finally {
            setSaving(false);
        }
    };

    if (!visible) return null;

    return (
        <div className={style.feedbackModalOverlay} role="dialog" aria-modal="true">
            <div className={style.feedbackModal}>
                <div className={style.feedbackHeader}>
                    <div>
                        <h3>Feedback - {booking?.restaurant?.fullName ?? 'Nhà hàng'}</h3>
                        <div className={style.sub}>Cho từng món trong order #{order?.orderId}</div>
                    </div>
                    <button className={style.closeBtn} onClick={onClose}>
                        Đóng
                    </button>
                </div>

                <div className={style.feedbackBody}>
                    {items.length === 0 ? (
                        <div className={style.noItems}>Không có món để feedback.</div>
                    ) : (
                        items.map((it, idx) => (
                            <div className={style.feedbackItem} key={it.orderDetailId ?? it.itemId}>
                                <img
                                    className={style.foodImg}
                                    src={it.img}
                                    alt={it.name}
                                    onClick={() => handleSelectImage(idx)}
                                    style={{ cursor: 'pointer' }}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={(el) => (fileInputRefs.current[idx] = el)}
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleImageChange(e, idx)}
                                />
                                <div className={style.foodMeta}>
                                    <div className={style.foodName}>{it.name}</div>

                                    <div className={style.controlsRow}>
                                        <label className={style.ratingLabel}>Điểm:</label>
                                        <select
                                            value={it.rating ?? ''}
                                            onChange={(e) =>
                                                handleChange(
                                                    idx,
                                                    'rating',
                                                    e.target.value ? Number(e.target.value) : null,
                                                )
                                            }
                                            className={style.ratingSelect}
                                        >
                                            <option value="">-- Chọn --</option>
                                            <option value={5}>5</option>
                                            <option value={4}>4</option>
                                            <option value={3}>3</option>
                                            <option value={2}>2</option>
                                            <option value={1}>1</option>
                                        </select>
                                    </div>

                                    <textarea
                                        className={style.feedbackTextarea}
                                        placeholder="Viết nhận xét..."
                                        value={it.comment ?? ''}
                                        onChange={(e) => handleChange(idx, 'comment', e.target.value)}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* NEW: anonymous toggle row */}
                <div className={style.anonymousRow}>
                    <label className={style.anonymousLabel}>
                        <input
                            type="checkbox"
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                        />
                        <span> Ẩn danh</span>
                    </label>
                    <div className={style.anonymousHint}>Bật để gửi feedback ẩn danh (không hiển thị tên)</div>
                </div>

                <div className={style.modalActions}>
                    <button className={style.cancelBtn} onClick={onClose} disabled={saving}>
                        Hủy
                    </button>
                    <button className={style.saveBtn} onClick={handleSave} disabled={saving}>
                        {saving
                            ? 'Đang lưu...'
                            : Array.isArray(booking?.foodReviews) && booking.foodReviews.length > 0
                            ? 'Cập nhật Feedback'
                            : 'Gửi Feedback'}
                    </button>
                </div>

                {result.visible && (
                    <div className={`${style.resultMsg} ${result.success ? style.success : style.error}`}>
                        {result.message}
                    </div>
                )}
            </div>
        </div>
    );
}
