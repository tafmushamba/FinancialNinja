import React from "react";
import { Separator } from "@/components/ui/separator";

interface PageHeaderProps {
  title: string;
  description?: string;
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
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">{icon}</div>}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
      <Separator />
    </div>
  );
}