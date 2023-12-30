// DarkModeToggle.js
import React from 'react';

const DarkModeToggle = ({ isDarkMode, toggleDarkMode }) => {
    return (
        <button
            onClick={toggleDarkMode}
            className={`px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-colors
                       ${isDarkMode ? 'bg-gray-200 text-gray-900' : 'bg-gray-800 text-gray-100'}`}
        >
            {isDarkMode ? 'Light' : 'Dark'} Mode
        </button>
    );
};

export default DarkModeToggle;
