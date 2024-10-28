import React from 'react';

const CalendarHeader = ({ monthYear, onPrev, onNext }) => {
  return (
    <div className="flex justify-between items-center bg-blue-500 text-white py-2 px-4 rounded-md mb-4">
      
      <h2 className='font-semibold text-center'>{monthYear}</h2>
      
    </div>
  );
};

export default CalendarHeader;