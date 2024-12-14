import React from 'react';

function PulldownMenu({ onSelect }) {
    const eventOptions = [
        "user1",
        "user2",
        // 必要に応じて選択肢を追加
    ];

    return (
        <select 
            onChange={(e) => onSelect(e.target.value)}
            className="event-select"
        >
            <option value="">担当者を選択</option>
            {eventOptions.map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
}

export default PulldownMenu;