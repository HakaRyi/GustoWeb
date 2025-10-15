import React, { useState } from 'react';
import CardItem from './CardItem';
import styles from './modalMyPreOrder.module.scss';

function ModalMyPreOrder({ isOpen, onClose, orders, onUpdateQuantity, onRemoveItem }) {
    const [numPeople, setNumPeople] = useState(1);
    const [note, setNote] = useState('');
    const [selectedTable, setSelectedTable] = useState('');

    // Mock data for table selection
    const tables = [
        { id: 1, name: 'Table 1' },
        { id: 2, name: 'Table 2' },
        { id: 3, name: 'Table 3' },
        { id: 4, name: 'Table 4' },
        { id: 5, name: 'Table 5' },
        { id: 6, name: 'Table 6' },
        { id: 7, name: 'Table 7' },
        { id: 8, name: 'Table 8' },
        { id: 9, name: 'Table 9' },
        { id: 10, name: 'Table 10' },
    ];

    const total = orders.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains(styles.overlay)) {
            onClose();
        }
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>MY PRE-ORDER</h2>
                    <button onClick={onClose} className={styles.exitBtn}>
                        X
                    </button>
                </div>

                <h3 className={styles.restaurantName}>Cơm Tấm Sà Bì Chưởng</h3>

                <div className={styles.pickTime}>
                    <span>Pick time</span>
                    <input type="datetime-local" className={styles.pickInput} />
                    <select
                        value={selectedTable}
                        onChange={(e) => setSelectedTable(e.target.value)}
                        className={styles.tableSelect}
                    >
                        <option value="" disabled>
                            Select table
                        </option>
                        {tables.map((table) => (
                            <option key={table.id} value={table.id}>
                                {table.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.itemContainer}>
                    <div className={styles.itemList}>
                        {orders.map((item) => (
                            <CardItem
                                key={item.id}
                                item={item}
                                onUpdateQuantity={onUpdateQuantity}
                                onRemoveItem={onRemoveItem}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.footer}>
                    <div className={styles.left}>
                        <div className={styles.inputGroup}>
                            <label>Number of people</label>
                            <input
                                type="number"
                                min="1"
                                value={numPeople}
                                onChange={(e) => setNumPeople(e.target.value)}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Note</label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Thêm ghi chú..."
                            />
                        </div>
                    </div>

                    <div className={styles.right}>
                        <p className={styles.total}>
                            Provisional fee: <span>{total.toLocaleString()}đ</span>
                        </p>
                        <button className={styles.payBtn}>Go to payment</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalMyPreOrder;
