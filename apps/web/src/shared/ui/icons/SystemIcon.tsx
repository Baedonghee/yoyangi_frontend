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
    strokeWidth: 1.9,
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
          <path
            {...commonProps}
            d="M12 21s6-5.6 6-11a6 6 0 1 0-12 0c0 5.4 6 11 6 11Z"
          />
          <circle {...commonProps} cx="12" cy="10" r="2.5" />
        </svg>
      );
    case "building":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path
            {...commonProps}
            d="M4 20V7l7-3v16M13 20V10l7-3v13M8 9h1M8 13h1M17 12h1M17 16h1"
          />
        </svg>
      );
    case "user-plus":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <circle {...commonProps} cx="10" cy="8" r="3.2" />
          <path
            {...commonProps}
            d="M4.5 20c1.2-3.3 3.5-5 5.5-5s4.3 1.7 5.5 5M18 8v6M15 11h6"
          />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path
            {...commonProps}
            d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
          />
        </svg>
      );
    case "stethoscope":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path
            {...commonProps}
            d="M7 4v5a4 4 0 0 0 8 0V4M12 13v2.5A3.5 3.5 0 0 0 15.5 19H17"
          />
          <circle {...commonProps} cx="18" cy="18" r="2" />
        </svg>
      );
    case "bed":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path
            {...commonProps}
            d="M4 18v-8h16v8M4 14h16M7 10V7h4a2 2 0 0 1 2 2v1"
          />
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
          <path
            {...commonProps}
            d="M6 4v4M18 4v4M4 9h16M5 6h14a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a1 1 0 0 1 1-1Z"
          />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path
            {...commonProps}
            d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z"
          />
          <path {...commonProps} d="m9.5 12 1.6 1.8L14.8 10" />
        </svg>
      );
    case "RE":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="M5 20V9.5L12 5l7 4.5V20" />
          <path {...commonProps} d="M9 20v-6h6v6M12 3v5M9.7 5.4h4.6" />
        </svg>
      );
    case "PR":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="M5 9h14l-2 11H7L5 9Z" />
          <path {...commonProps} d="m7 9 2.2-4 2.8 4 2.8-4L17 9M9 14h6" />
        </svg>
      );
    case "EC":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <circle {...commonProps} cx="12" cy="12" r="8" />
          <path {...commonProps} d="M8.5 9.2h7M8.5 12h6M11 8v8M13.8 8v8" />
        </svg>
      );
    case "NU":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="M7 4v5a5 5 0 0 0 10 0V4" />
          <path {...commonProps} d="M12 14v5M9.5 16.5h5" />
          <circle {...commonProps} cx="18" cy="18" r="2" />
        </svg>
      );
    case "CK":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="M7 4v7M10 4v7M7 8h3M8.5 11v9" />
          <path
            {...commonProps}
            d="M16 4v16M16 4c2 1.2 3 3 3 5.5S18 14 16 15"
          />
        </svg>
      );
    case "RH":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="M5 15h3l2.4-6 3.2 9 2.4-6h3" />
          <path {...commonProps} d="M6 20h12M8 5h8" />
        </svg>
      );
    case "LA":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <circle {...commonProps} cx="9" cy="8" r="3" />
          <path
            {...commonProps}
            d="M3.8 19c1-3 3-4.5 5.2-4.5S13.2 16 14.2 19"
          />
          <path
            {...commonProps}
            d="M16 8h4M18 6v4M15.5 15.5c1.6.4 2.8 1.5 3.5 3.5"
          />
        </svg>
      );
    case "PG":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path
            {...commonProps}
            d="M6 4v4M18 4v4M4 9h16M5 6h14a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a1 1 0 0 1 1-1Z"
          />
          <path {...commonProps} d="m8.5 14 2 2 4.5-4" />
        </svg>
      );
    case "DT":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="M4 20V8l6-3v15M12 20V6h8v14" />
          <path {...commonProps} d="M7 10h1M7 14h1M15 9h2M15 13h2M15 17h2" />
        </svg>
      );
    case "WK":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="M5 19c4.5-1.8 8-5.2 10-10" />
          <path
            {...commonProps}
            d="M9 15C6.5 12.5 6.5 8.8 9 6c3 1 4.8 3.4 4.8 6"
          />
          <path
            {...commonProps}
            d="M15 9c2.5-.4 4.2.4 5 2.5-1.8 2.2-4.4 2.8-6.6 1.5"
          />
        </svg>
      );
    case "search":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <circle {...commonProps} cx="11" cy="11" r="6" />
          <path {...commonProps} d="m20 20-4.2-4.2" />
        </svg>
      );
    case "grid":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <rect
            {...commonProps}
            x="4"
            y="4"
            width="6.5"
            height="6.5"
            rx="1.6"
          />
          <rect
            {...commonProps}
            x="13.5"
            y="4"
            width="6.5"
            height="6.5"
            rx="1.6"
          />
          <rect
            {...commonProps}
            x="4"
            y="13.5"
            width="6.5"
            height="6.5"
            rx="1.6"
          />
          <rect
            {...commonProps}
            x="13.5"
            y="13.5"
            width="6.5"
            height="6.5"
            rx="1.6"
          />
        </svg>
      );
    case "list":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="M9 6h11M9 12h11M9 18h11" />
          <circle {...commonProps} cx="5" cy="6" r="1.2" />
          <circle {...commonProps} cx="5" cy="12" r="1.2" />
          <circle {...commonProps} cx="5" cy="18" r="1.2" />
        </svg>
      );
    case "chevron-down":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="m7 10 5 5 5-5" />
        </svg>
      );
    case "chevron-up":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="m7 14 5-5 5 5" />
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
          <path
            {...commonProps}
            d="m12 4 2.2 4.8 5.3.6-3.9 3.6 1 5.2L12 15.8l-4.6 2.4 1-5.2L4.5 9.4l5.3-.6L12 4Z"
          />
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path
            {...commonProps}
            d="M5 18V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H10l-5 4v-2Z"
          />
        </svg>
      );
    case "phone":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path
            {...commonProps}
            d="M7 4h3l1.5 4-2 1.3a11 11 0 0 0 5.2 5.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 5 6.2 2 2 0 0 1 7 4Z"
          />
        </svg>
      );
    case "users":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <circle {...commonProps} cx="9" cy="8" r="3" />
          <path
            {...commonProps}
            d="M3.5 19c1.2-3.2 3.2-4.8 5.5-4.8s4.3 1.6 5.5 4.8"
          />
          <path
            {...commonProps}
            d="M16 11a2.6 2.6 0 1 0 0-5M17 14.5c1.6.6 2.8 2 3.5 4.5"
          />
        </svg>
      );
    case "check":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="m5 12.5 4.2 4.2L19 7" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="m6 6 12 12M18 6 6 18" />
        </svg>
      );
    case "upload":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="M12 16V4M7.5 8.5 12 4l4.5 4.5" />
          <path
            {...commonProps}
            d="M5 16v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"
          />
        </svg>
      );
    case "tree":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="m12 3 5 6h-3l4 5h-4v6h-4v-6H6l4-5H7l5-6Z" />
        </svg>
      );
    case "chef":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path
            {...commonProps}
            d="M7 11a4 4 0 1 1 2.5-7 4 4 0 0 1 5 0A4 4 0 1 1 17 11v7a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-7Z"
          />
          <path {...commonProps} d="M7 14h10" />
        </svg>
      );
    case "droplets":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path
            {...commonProps}
            d="M8 14.5C8 17 10 19 12 19s4-2 4-4.5C16 12 12 6 12 6s-4 6-4 8.5Z"
          />
          <path
            {...commonProps}
            d="M17.5 12.5C19 11 20 8 20 8s2 3 2 4.7a2.7 2.7 0 0 1-4.5 2"
          />
          <path
            {...commonProps}
            d="M6.5 12.5C5 11 4 8 4 8s-2 3-2 4.7a2.7 2.7 0 0 0 4.5 2"
          />
        </svg>
      );
    case "bath":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path
            {...commonProps}
            d="M5 11h14v3a5 5 0 0 1-5 5h-4a5 5 0 0 1-5-5v-3Z"
          />
          <path {...commonProps} d="M7 11V6a2 2 0 0 1 2-2h1M4 21h16" />
        </svg>
      );
    case "wind":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...commonProps} d="M4 8h11a3 3 0 1 0-3-3" />
          <path {...commonProps} d="M4 12h15" />
          <path {...commonProps} d="M4 16h10a3 3 0 1 1-3 3" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <rect
            {...commonProps}
            x="3.5"
            y="6.5"
            width="17"
            height="11"
            rx="3"
          />
          <path {...commonProps} d="m10 10 5 2-5 2v-4Z" />
        </svg>
      );
    case "blog":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path
            {...commonProps}
            d="M7 5h6a3 3 0 0 1 0 6H7V5Zm0 6h8a3.5 3.5 0 1 1 0 7H7v-7Z"
          />
        </svg>
      );
    default:
      return null;
  }
}
