interface StatusChipProps {
  icon: string;
  label: string;
  value: string;
  variant: "danger" | "warning" | "info" | "success";
}

const variantStyles = {
  danger: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-orange-50 border-orange-200 text-orange-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
  success: "bg-green-50 border-green-200 text-green-800",
};

const dotStyles = {
  danger: "bg-red-500",
  warning: "bg-orange-500",
  info: "bg-blue-500",
  success: "bg-green-500",
};

export function StatusChip({ icon, label, value, variant }: StatusChipProps) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${variantStyles[variant]}`}>
      <span className="text-sm" role="img" aria-label={label}>{icon}</span>
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] opacity-70 leading-none">{label}</span>
        <span className="text-xs font-semibold leading-tight truncate">{value}</span>
      </div>
      <span className={`w-2 h-2 rounded-full ml-auto flex-shrink-0 ${dotStyles[variant]}`} aria-hidden="true" />
    </div>
  );
}
