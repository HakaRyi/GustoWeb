import React, { useState, useRef, useEffect } from 'react';
import './FoodChatBox.css';
import gusbieAvatar from '~/assets/imgs/RabbitGusto.png';

const FoodChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: 'Xin chào! 👋 Gusbie đây. Bạn muốn mình gợi ý món ăn hôm nay không?',
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');

    // Tự động cuộn xuống tin nhắn mới nhất
    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const suggestions = [
        {
            label: '☀️ Trời nóng, muốn giải nhiệt',
            payload: {
                weather: 'Nắng nóng 35 độ',
                mood: 'Hơi mệt, khát nước',
                context: 'Ăn trưa nhanh',
                preferences: 'Thích đồ mát, nhiều rau',
            },
        },
        {
            label: '🌧️ Mưa buồn, cần chill',
            payload: {
                weather: 'Mưa to, se lạnh',
                mood: 'Buồn, muốn thư giãn',
                context: 'Ăn tối một mình',
                preferences: 'Thích đồ nóng, cay nồng ấm bụng',
            },
        },
    ];

    const callApiRecommendation = async (payload) => {
        setIsLoading(true);
        try {
            const response = await fetch('https://gustoweb.onrender.com/api/FoodRecomend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Lỗi kết nối server');

            const data = await response.json();

            const botResponse = {
                id: Date.now() + 1,
                type: 'bot',
                isRecommendation: true,
                data: data.recommendations,
            };
            setMessages((prev) => [...prev, botResponse]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    type: 'bot',
                    text: 'Xin lỗi, server đang bận. Bạn thử lại sau nhé!',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        const userMsg = { id: Date.now(), type: 'user', text: suggestion.label };
        setMessages((prev) => [...prev, userMsg]);
        callApiRecommendation(suggestion.payload);
    };

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const text = inputValue;
        const userMsg = { id: Date.now(), type: 'user', text: text };
        setMessages((prev) => [...prev, userMsg]);
        setInputValue('');

        const payload = {
            weather: '',
            mood: '',
            context: '',
            preferences: text,
        };

        callApiRecommendation(payload);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <>
            <button className="chatbot-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                ) : (
                    <img src={gusbieAvatar} alt="Open Chatbot" style={{ width: '58px', height: '58px' }} />
                )}
            </button>

            {isOpen && (
                <div className="chatbot-container">
                    <div className="chatbot-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    background: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <img
                                    src={gusbieAvatar}
                                    alt="Chatbot Avatar"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <h3>Gusbie Say Hi</h3>
                        </div>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>
                            ×
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`message ${msg.type}`}>
                                {msg.text && <div>{msg.text}</div>}

                                {msg.isRecommendation && msg.data && (
                                    <div className="recommendation-list">
                                        <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>
                                            Mình gợi ý cho bạn nè:
                                        </div>
                                        {msg.data.map((item, index) => (
                                            <div key={index} className="dish-card">
                                                <div className="dish-name">🍽️ {item.dish}</div>
                                                <div className="dish-reason">{item.reason}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {isLoading && (
                            <div className="message bot">
                                <div className="loading-dots">
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="suggestion-area">
                        {!isLoading &&
                            suggestions.map((s, index) => (
                                <button
                                    key={index}
                                    className="suggestion-chip"
                                    onClick={() => handleSuggestionClick(s)}
                                >
                                    {s.label}
                                </button>
                            ))}
                    </div>

                    <div className="chat-input-area">
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Bạn muốn ăn gì? (ví dụ: Đang ốm, muốn ăn cháo)"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                        />
                        <button
                            className="send-btn"
                            onClick={handleSendMessage}
                            disabled={isLoading || !inputValue.trim()}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default FoodChatBot;
