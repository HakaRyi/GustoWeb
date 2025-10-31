import React, { useEffect, useState } from 'react';
import styles from '../styles/Contact.module.scss';
import { customFetch } from '../config/customFetch';

const Contact = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        content: '',
    });

    const [message, setMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false); // 👉 trạng thái popup

    useEffect(() => {
        const allElements = document.querySelectorAll('*');
        const fadeSections = Array.from(allElements).filter((el) => el.className?.toString().includes('fadeSection'));

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(styles.visible);
                    } else {
                        entry.target.classList.remove(styles.visible);
                    }
                });
            },
            { threshold: 0.2 },
        );

        fadeSections.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const res = await customFetch('https://gustoweb.onrender.com/api/Contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setFormData({ fullName: '', email: '', content: '' });
                setShowPopup(true); // 👉 bật popup thành công
                setTimeout(() => setShowPopup(false), 3000); // 👉 tự ẩn sau 3s
            } else {
                const errorText = await res.text();
                setMessage('❌ Gửi thất bại: ' + errorText);
            }
        } catch (error) {
            console.error('Error sending contact:', error);
            setMessage('❌ Có lỗi xảy ra khi gửi liên hệ!');
        }
    };

    return (
        <div className={styles.contactPage_container}>
            <div className={styles.contactPage_overlay}></div>

            <div className={`${styles.contactPage_content} ${styles.fadeSection}`}>
                <h1>Liên Hệ Với GUSTO</h1>
                <p>
                    Chúng tôi luôn sẵn sàng lắng nghe mọi ý kiến, phản hồi và câu hỏi của bạn. Hãy liên hệ với GUSTO để
                    cùng nhau xây dựng một nền tảng đặt món ăn tốt hơn mỗi ngày.
                </p>

                <div className={`${styles.contactPage_grid} ${styles.fadeSection}`}>
                    <div className={`${styles.contactPage_info} ${styles.fadeSection}`}>
                        <h2>Thông Tin Liên Hệ</h2>
                        <ul>
                            <li>
                                <strong>Địa chỉ:</strong> FPT University, TP. Hồ Chí Minh
                            </li>
                            <li>
                                <strong>Email:</strong> gusto.cpn@gmail.com
                            </li>
                            <li>
                                <strong>Hotline:</strong> 035 773 2955
                            </li>
                            <li>
                                <strong>Giờ làm việc:</strong> 8:00 - 18:00 (Thứ 2 - Thứ 7)
                            </li>
                        </ul>
                    </div>

                    <form className={`${styles.contactPage_form} ${styles.fadeSection}`} onSubmit={handleSubmit}>
                        <h2>Gửi Tin Nhắn Cho Chúng Tôi</h2>
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Họ và tên"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email của bạn"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <textarea
                                name="content"
                                rows="5"
                                placeholder="Nội dung tin nhắn..."
                                value={formData.content}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className={styles.contactPage_btn}>
                            Gửi Tin Nhắn
                        </button>
                        {message && <p className={styles.message}>{message}</p>}
                    </form>
                </div>
            </div>

            {/* 👉 Popup thông báo */}
            {showPopup && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popupBox}>
                        <h3>🎉 Gửi thành công!</h3>
                        <p>Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
                        <button onClick={() => setShowPopup(false)} className={styles.closeBtn}>
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contact;
