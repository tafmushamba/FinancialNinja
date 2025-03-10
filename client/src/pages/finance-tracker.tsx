import React from 'react';
import Header from '@/components/layout/header';

const FinanceTracker: React.FC = () => {
  return (
    <>
      <Header title="Finance Tracker" />
      <div className="px-4 py-4">
        <h2 className="text-2xl font-bold mb-4">Finance Tracker</h2>
        <p className="text-muted-foreground">
          Your financial tracking and management dashboard will appear here. This page is under construction.
        </p>
      </div>
    </>
  );
};

export default FinanceTracker;