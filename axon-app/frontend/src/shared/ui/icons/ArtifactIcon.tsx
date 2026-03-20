import React from "react";
import { cn } from "@/shared/lib/utils";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * ArtifactIcon - Custom geometric icon for Axon Artifacts.
 * Styled to match HeroUI/Lucide aesthetic: 1.5px stroke, rounded corners.
 */
export const ArtifactIcon = ({ size = 24, className, ...props }: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("lucide-custom-artifact", className)}
      {...props}
    >
      {/* Main Container - A slightly stylized box/package */}
      <path d="M21 8L12 3L3 8V16L12 21L21 16V8Z" />
      
      {/* Inner Layer detail - indicating a "stored" or "packaged" result */}
      <path d="M12 21V12" />
      <path d="M12 12L21 8" />
      <path d="M12 12L3 8" />
      
      {/* Floating internal "Artifact" indicator - a small square/diamond */}
      <path d="M12 7.5L14.5 9L12 10.5L9.5 9L12 7.5Z" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
};
