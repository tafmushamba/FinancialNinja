import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const skeletonVariants = cva(
  "animate-pulse rounded-md",
  {
    variants: {
      variant: {
        default: "bg-white/10",
        terminal: "bg-[#9FEF00]/5 border border-[#9FEF00]/10",
        card: "bg-black/40 border border-white/5",
        dark: "bg-black/60",
      },
      animation: {
        pulse: "animate-pulse",
        shimmer: "animate-shimmer",
        none: "",
      }
    },
    defaultVariants: {
      variant: "default",
      animation: "pulse",
    },
  }
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

function Skeleton({
  className,
  variant,
  animation,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant, animation }), className)}
      {...props}
    />
  );
}

// Skeleton text for paragraphs and text content
interface SkeletonTextProps extends SkeletonProps {
  lines?: number;
  lastLineWidth?: "full" | "3/4" | "1/2" | "1/4";
}

function SkeletonText({
  className,
  variant,
  animation,
  lines = 3,
  lastLineWidth = "3/4",
  ...props
}: SkeletonTextProps) {
  const widthMap = {
    full: "w-full",
    "3/4": "w-3/4",
    "1/2": "w-1/2",
    "1/4": "w-1/4",
  };

  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant={variant}
          animation={animation}
          className={cn(
            "h-4",
            index === lines - 1 ? widthMap[lastLineWidth] : "w-full"
          )}
        />
      ))}
    </div>
  );
}

// Skeleton for cards and content blocks
interface SkeletonCardProps extends SkeletonProps {
  header?: boolean;
  footer?: boolean;
}

function SkeletonCard({
  className,
  variant,
  animation,
  header = true,
  footer = false,
  ...props
}: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/10 overflow-hidden",
        className
      )}
      {...props}
    >
      {header && (
        <div className="p-4 border-b border-white/10">
          <Skeleton
            variant={variant}
            animation={animation}
            className="h-6 w-1/3"
          />
        </div>
      )}

      <div className="p-4 space-y-4">
        <SkeletonText
          variant={variant}
          animation={animation}
          lines={2}
        />

        <div className="grid grid-cols-2 gap-4 pt-2">
          <Skeleton
            variant={variant}
            animation={animation}
            className="h-24"
          />
          <Skeleton
            variant={variant}
            animation={animation}
            className="h-24"
          />
        </div>
      </div>

      {footer && (
        <div className="p-4 border-t border-white/10 flex justify-between">
          <Skeleton
            variant={variant}
            animation={animation}
            className="h-6 w-24"
          />
          <Skeleton
            variant={variant}
            animation={animation}
            className="h-6 w-16"
          />
        </div>
      )}
    </div>
  );
}

// Skeleton for profile or avatar
function SkeletonAvatar({
  className,
  variant,
  animation,
  ...props
}: SkeletonProps) {
  return (
    <Skeleton
      variant={variant}
      animation={animation}
      className={cn("h-12 w-12 rounded-full", className)}
      {...props}
    />
  );
}

// Skeleton for tables
interface SkeletonTableProps extends SkeletonProps {
  rows?: number;
  columns?: number;
}

function SkeletonTable({
  className,
  variant,
  animation,
  rows = 5,
  columns = 4,
  ...props
}: SkeletonTableProps) {
  return (
    <div
      className={cn("rounded-md border border-white/10 overflow-hidden", className)}
      {...props}
    >
      {/* Header */}
      <div className="grid border-b border-white/10 bg-black/40" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <div key={`header-${index}`} className="p-3">
            <Skeleton
              variant={variant}
              animation={animation}
              className="h-6"
            />
          </div>
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className={cn(
            "grid border-b border-white/10",
            rowIndex % 2 === 0 ? "bg-black/20" : "bg-black/10"
          )}
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={`cell-${rowIndex}-${colIndex}`} className="p-3">
              <Skeleton
                variant={variant}
                animation={animation}
                className="h-4"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonTable,
  skeletonVariants
};
