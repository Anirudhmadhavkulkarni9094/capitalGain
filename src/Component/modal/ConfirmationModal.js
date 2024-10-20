import React from 'react';

const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-lg font-semibold mb-4">{title}</h2>
                <p className="mb-4">{message}</p>
                <div className="flex justify-end">
                    <button 
                        onClick={onCancel} 
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2">
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="px-4 py-2 bg-red-600 text-white rounded">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
