import React from 'react';
import Header from '@/components/layout/header';

const Achievements: React.FC = () => {
  return (
    <>
      <Header title="Achievements" />
      <div className="px-4 py-4">
        <h2 className="text-2xl font-bold mb-4">Achievements</h2>
        <p className="text-muted-foreground">
          Your achievements and badges will appear here. This page is under construction.
        </p>
      </div>
    </>
  );
};

export default Achievements;