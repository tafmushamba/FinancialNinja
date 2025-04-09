import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string | ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
}

export default function PageHeader({ 
  title, 
  description, 
  icon, 
  actions 
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex-shrink-0 mt-2 sm:mt-0 w-full sm:w-auto">
          {actions}
        </div>
      )}
    </div>
  );
}