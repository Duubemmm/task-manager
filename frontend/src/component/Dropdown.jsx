import React, { useState } from 'react';

const Dropdown = ({ options, value, setValue }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative w-full">
            <button
                className="w-full border p-2 flex justify-between bg-white"
                onClick={() => setOpen(!open)}
            >
                <span>{value || "Select"}</span>
                <span>▼</span>
            </button>

            {open && (
                <ul className="absolute w-full bg-white border mt-1 z-50 max-h-32 overflow-y-auto shadow-md">
                    {options.map((item, index) => (
                        <li
                            key={index}
                            className="p-2 cursor-pointer hover:bg-gray-200"
                            onClick={() => {
                                setValue(item);
                                setOpen(false);
                            }}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;