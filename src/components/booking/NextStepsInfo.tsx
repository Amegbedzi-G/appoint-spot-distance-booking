
import React from 'react';

const NextStepsInfo = () => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <p className="text-sm text-yellow-800">
        <span className="font-medium">What's next?</span> Your booking is now pending approval from our administrators. 
        You will receive an email notification once your appointment is approved or declined. 
        You can also check the status of your appointment on your dashboard.
      </p>
    </div>
  );
};

export default NextStepsInfo;
