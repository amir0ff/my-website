import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function Icon({ size = "1em", className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    />
  );
}

export function UserIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
    </Icon>
  );
}

export function EnvelopeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5Z" />
    </Icon>
  );
}

export function BarsIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z" />
    </Icon>
  );
}

export function TimesIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3 1.4 1.4Z" />
    </Icon>
  );
}

export function ChevronUpIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7.4 15.4 12 10.8l4.6 4.6 1.4-1.4-6-6-6 6 1.4 1.4Z" />
    </Icon>
  );
}

export function KeyIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12.65 10A5.99 5.99 0 0 0 7 4a6 6 0 1 0 1.88 11.7L10 17h2v2h2v2h4v-4.46l-3.12-3.12A6 6 0 0 0 12.65 10ZM7 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
    </Icon>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 11h-4V7h2v4h2v2Z" />
    </Icon>
  );
}

export function BookOpenIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M21 4H12a3 3 0 0 0-3 3v12.5a1.5 1.5 0 0 1 2.45 1.16A3 3 0 0 1 12 20h9V4ZM3 4h9a3 3 0 0 1 3 3v12.5a1.5 1.5 0 0 0-2.45 1.16A3 3 0 0 0 12 20H3V4Z" />
    </Icon>
  );
}

export function SyncIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 6V3L8 7l4 4V8a4 4 0 1 1-4 4H6a6 6 0 1 0 6-6Zm7.5 3.5A6 6 0 0 0 12 6v2a4 4 0 0 1 3.46 6H13l4 4 4-4h-2.54a6 6 0 0 0 1.04-4.5Z" />
    </Icon>
  );
}

export function MediumIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.29 7.2c.04-.38-.12-.76-.42-1.01L2.2 4.2v-.3h6.1l4.72 10.35L17.2 3.9h5.8v.3l-1.55 1.48a.86.86 0 0 0-.33.73v9.28c.05.3.17.58.36.8l1.52 1.85v.3h-7.64v-.3l1.58-1.93c.16-.16.23-.39.2-.61V8.5L11.3 19.7h-.64L5.4 8.5v7.5c-.05.4.08.8.35 1.09l1.8 2.18v.3H2v-.3l1.8-2.18c.27-.29.39-.7.32-1.1V7.2Z" />
    </Icon>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.98 3.5A2.5 2.5 0 1 1 2.5 6a2.5 2.5 0 0 1 2.48-2.5ZM3 8.75h3.96V21H3V8.75ZM9.34 8.75H13.1v1.67h.05c.52-.98 1.8-2.01 3.71-2.01 3.97 0 4.7 2.61 4.7 6.01V21H17.9v-5.55c0-1.32-.02-3.02-1.84-3.02-1.84 0-2.12 1.44-2.12 2.92V21H9.34V8.75Z" />
    </Icon>
  );
}

export function YouTubeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M23.5 6.2a3 3 0 0 0-2.12-2.13C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.57A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.12C4.5 20.5 12 20.5 12 20.5s7.5 0 9.38-.58a3 3 0 0 0 2.12-2.12A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8ZM9.75 15.5v-7l6.5 3.5-6.5 3.5Z" />
    </Icon>
  );
}

export function GitHubIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12.3c0 5.2 3.36 9.6 8.03 11.15.59.12.8-.26.8-.57v-2.02c-3.26.72-3.95-1.4-3.95-1.4-.53-1.37-1.3-1.74-1.3-1.74-1.06-.74.08-.72.08-.72 1.17.08 1.78 1.22 1.78 1.22 1.04 1.8 2.73 1.28 3.4.98.1-.77.41-1.28.74-1.57-2.6-.3-5.34-1.33-5.34-5.92 0-1.31.46-2.38 1.22-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.33 3.3 1.23a11.2 11.2 0 0 1 6 0c2.28-1.56 3.28-1.23 3.28-1.23.66 1.65.25 2.87.13 3.17.76.84 1.22 1.91 1.22 3.22 0 4.6-2.75 5.61-5.37 5.9.42.37.8 1.1.8 2.22v3.29c0 .32.21.7.81.57A11.5 11.5 0 0 0 23.5 12.3 11.5 11.5 0 0 0 12 .5Z" />
    </Icon>
  );
}
