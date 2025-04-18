import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchWithTrackProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

const SwitchWithTrack = React.forwardRef<HTMLInputElement, SwitchWithTrackProps>(
  ({ className, label, description, checked, ...props }, ref) => {
    return (
      <div className="flex justify-between items-center">
        {(label || description) && (
          <div>
            {label && <p className="text-foreground text-sm">{label}</p>}
            {description && <p className="text-muted-foreground text-xs">{description}</p>}
          </div>
        )}
        <label className="flex items-center">
          <input
            type="checkbox"
            ref={ref}
            checked={checked}
            className="opacity-0 absolute h-0 w-0"
            {...props}
          />
          <div className={cn("switch-track", className)}>
            <div className="switch-thumb"></div>
          </div>
        </label>
      </div>
    );
  }
);

SwitchWithTrack.displayName = "SwitchWithTrack";

export { SwitchWithTrack };
