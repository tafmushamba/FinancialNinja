import React from "react";

interface PageHeaderProps {
  title: string;
  description: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export default function PageHeader({ 
  title, 
  description, 
  icon, 
  action 
}: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="mt-1">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <div className="text-muted-foreground mt-1">
            {description}
          </div>
        </div>
      </div>
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
}