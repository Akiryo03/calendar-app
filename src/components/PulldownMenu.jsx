import React from 'react';

function PulldownMenu({ onSelect }) {
    const eventOptions = [
        "洗濯",
        "洗い物",
        "掃除",
        "買い物",
        "料理"
        // 必要に応じて選択肢を追加
    ];

    return (
        <select 
            onChange={(e) => onSelect(e.target.value)}
            className="event-select"
        >
            <option value="">予定を選択</option>
            {eventOptions.map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
}

export default PulldownMenu;