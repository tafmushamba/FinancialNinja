import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full backdrop-blur-md",
  {
    variants: {
      variant: {
        default: "border bg-background/90 text-foreground",
        destructive: "border-red-500/50 bg-red-950/90 text-red-50",
        success: "border-[#9FEF00]/50 bg-[#9FEF00]/10 text-[#9FEF00]",
        warning: "border-yellow-500/50 bg-yellow-900/90 text-yellow-50",
        info: "border-blue-500/50 bg-blue-950/90 text-blue-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border px-3 text-sm font-medium ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      "bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary",
      "group-[.destructive]:border-red-300/40 group-[.destructive]:hover:border-red-300/30 group-[.destructive]:hover:bg-red-800 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400",
      "group-[.success]:border-[#9FEF00]/40 group-[.success]:hover:border-[#9FEF00]/30 group-[.success]:hover:bg-[#9FEF00]/20 group-[.success]:hover:text-[#9FEF00] group-[.success]:focus:ring-[#9FEF00]",
      "group-[.warning]:border-yellow-300/40 group-[.warning]:hover:border-yellow-300/30 group-[.warning]:hover:bg-yellow-800 group-[.warning]:hover:text-yellow-50 group-[.warning]:focus:ring-yellow-400",
      "group-[.info]:border-blue-300/40 group-[.info]:hover:border-blue-300/30 group-[.info]:hover:bg-blue-800 group-[.info]:hover:text-blue-50 group-[.info]:focus:ring-blue-400",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
      "group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      "group-[.success]:text-[#9FEF00]/70 group-[.success]:hover:text-[#9FEF00] group-[.success]:focus:ring-[#9FEF00] group-[.success]:focus:ring-offset-[#9FEF00]/50",
      "group-[.warning]:text-yellow-300 group-[.warning]:hover:text-yellow-50 group-[.warning]:focus:ring-yellow-400 group-[.warning]:focus:ring-offset-yellow-600",
      "group-[.info]:text-blue-300 group-[.info]:hover:text-blue-50 group-[.info]:focus:ring-blue-400 group-[.info]:focus:ring-offset-blue-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

// Status icons for different toast types
const ToastIcon = ({ variant }: { variant?: "default" | "destructive" | "success" | "warning" | "info" }) => {
  switch (variant) {
    case "destructive":
      return <AlertCircle className="h-5 w-5 text-red-400 mr-2" />;
    case "success":
      return <CheckCircle className="h-5 w-5 text-[#9FEF00] mr-2" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />;
    case "info":
      return <Info className="h-5 w-5 text-blue-400 mr-2" />;
    default:
      return null;
  }
};

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast> & {
  showIcon?: boolean;
};

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastIcon,
}
