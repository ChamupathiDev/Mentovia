import React from 'react';

const LearningTab = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <i className='bx bx-book text-5xl text-gray-400 mb-3'></i>
        <p className="text-gray-600 mb-4">You haven't started any learning plans yet.</p>
        <button className="px-5 py-2 bg-DarkColor text-white rounded-md hover:bg-ExtraDarkColor transition-colors shadow-sm inline-flex items-center">
          <i className='bx bx-plus mr-2'></i> Browse Learning Plans
        </button>
      </div>
    </div>
  );
};

export default LearningTab;
