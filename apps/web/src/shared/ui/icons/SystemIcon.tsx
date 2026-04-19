import type { HomeIconName } from "@/entities/home/model/types";

type IconProps = {
  name: HomeIconName;
  className?: string;
};

export function SystemIcon({ name, className }: IconProps) {
  const commonProps = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.9
  };

  switch (name) {
    case "home":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="m3 11 9-7 9 7" />
          <path {...commonProps} d="M6 10.5V20h12v-9.5" />
        </svg>
      );
    case "map-pin":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="M12 21s6-5.6 6-11a6 6 0 1 0-12 0c0 5.4 6 11 6 11Z" />
          <circle {...commonProps} cx="12" cy="10" r="2.5" />
        </svg>
      );
    case "building":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="M4 20V7l7-3v16M13 20V10l7-3v13M8 9h1M8 13h1M17 12h1M17 16h1" />
        </svg>
      );
    case "user-plus":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <circle {...commonProps} cx="10" cy="8" r="3.2" />
          <path {...commonProps} d="M4.5 20c1.2-3.3 3.5-5 5.5-5s4.3 1.7 5.5 5M18 8v6M15 11h6" />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path
            {...commonProps}
            d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"
          />
        </svg>
      );
    case "stethoscope":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="M7 4v5a4 4 0 0 0 8 0V4M12 13v2.5A3.5 3.5 0 0 0 15.5 19H17" />
          <circle {...commonProps} cx="18" cy="18" r="2" />
        </svg>
      );
    case "bed":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="M4 18v-8h16v8M4 14h16M7 10V7h4a2 2 0 0 1 2 2v1" />
        </svg>
      );
    case "plus":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="M12 5v14M5 12h14" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="M6 4v4M18 4v4M4 9h16M5 6h14a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a1 1 0 0 1 1-1Z" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" />
          <path {...commonProps} d="m9.5 12 1.6 1.8L14.8 10" />
        </svg>
      );
    case "search":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <circle {...commonProps} cx="11" cy="11" r="6" />
          <path {...commonProps} d="m20 20-4.2-4.2" />
        </svg>
      );
    case "arrow-left":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="m14 6-6 6 6 6" />
        </svg>
      );
    case "arrow-right":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="m10 6 6 6-6 6" />
        </svg>
      );
    case "play":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="m9 7 8 5-8 5V7Z" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="m12 4 2.2 4.8 5.3.6-3.9 3.6 1 5.2L12 15.8l-4.6 2.4 1-5.2L4.5 9.4l5.3-.6L12 4Z" />
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="M5 18V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H10l-5 4v-2Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <rect {...commonProps} x="3.5" y="6.5" width="17" height="11" rx="3" />
          <path {...commonProps} d="m10 10 5 2-5 2v-4Z" />
        </svg>
      );
    case "blog":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="M7 5h6a3 3 0 0 1 0 6H7V5Zm0 6h8a3.5 3.5 0 1 1 0 7H7v-7Z" />
        </svg>
      );
    default:
      return null;
  }
}

