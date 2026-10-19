const base = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const make = (paths) =>
  function Icon({ size, ...props }) {
    return (
      <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
        {paths}
      </svg>
    );
  };

export const CapIcon = make(
  <>
    <path d="M22 9 12 4 2 9l10 5 10-5Z" />
    <path d="M6 11.5V16c0 1.2 2.7 3 6 3s6-1.8 6-3v-4.5" />
    <path d="M22 9v6" />
  </>
);
export const ChartIcon = make(
  <>
    <path d="M4 20V10" />
    <path d="M10 20V4" />
    <path d="M16 20v-7" />
    <path d="M22 20H2" />
  </>
);
export const CameraIcon = make(
  <>
    <path d="M4 8h3l1.6-2.4a1 1 0 0 1 .8-.4h5.2a1 1 0 0 1 .8.4L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
    <circle cx="12" cy="13.5" r="3.5" />
  </>
);
export const UserCheckIcon = make(
  <>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <path d="m16 11 2 2 4-4" />
  </>
);
export const ScanIcon = make(
  <>
    <path d="M4 8V5a1 1 0 0 1 1-1h3" />
    <path d="M16 4h3a1 1 0 0 1 1 1v3" />
    <path d="M20 16v3a1 1 0 0 1-1 1h-3" />
    <path d="M8 20H5a1 1 0 0 1-1-1v-3" />
    <path d="M7 12h10" />
  </>
);
export const ArrowLeftIcon = make(
  <>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </>
);
export const ChevronRightIcon = make(<path d="m9 6 6 6-6 6" />);
export const CheckIcon = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.5 2.5 2.5 4.5-5" />
  </>
);
export const AlertIcon = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4.5" />
    <path d="M12 16h.01" />
  </>
);
export const InfoIcon = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <path d="M12 8h.01" />
  </>
);
export const UploadIcon = make(
  <>
    <path d="M12 16V4" />
    <path d="m7 9 5-5 5 5" />
    <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
  </>
);
export const SearchIcon = make(
  <>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </>
);
export const LockIcon = make(
  <>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </>
);
