import React from 'react';

const AchievementsTab = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <i className='bx bx-medal text-5xl text-gray-400 mb-3'></i>
        <p className="text-gray-600 mb-4">Complete learning tasks to earn achievements!</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto mt-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 opacity-50">
            <i className='bx bx-star text-3xl text-yellow-500 mb-2'></i>
            <p className="text-sm font-medium">First Post</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 opacity-50">
            <i className='bx bx-badge-check text-3xl text-blue-500 mb-2'></i>
            <p className="text-sm font-medium">Profile Complete</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 opacity-50">
            <i className='bx bx-like text-3xl text-green-500 mb-2'></i>
            <p className="text-sm font-medium">First Like</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsTab;
