import React from 'react';

const CalendarHeader = ({ monthYear, onPrev, onNext }) => {
  return (
    <div className="flex justify-between items-center bg-blue-500 text-white py-2 px-4 rounded-md mb-4">
      <button
        onClick={onPrev}
        className="bg-blue-700 text-white py-1 px-3 rounded hover:bg-blue-800"
      >
        Prev
      </button>
      <h2>{monthYear}</h2>
      <button
        onClick={onNext}
        className="bg-blue-700 text-white py-1 px-3 rounded hover:bg-blue-800"
      >
        Next
      </button>
    </div>
  );
};

export default CalendarHeader;