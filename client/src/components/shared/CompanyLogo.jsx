import { cn } from "@/lib/utils";

const initialsFromName = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const source = parts.length > 1 ? [parts[0], parts[1]] : [name.slice(0, 2)];

  return source
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export default function CompanyLogo({
  name,
  src,
  size = "md",
  className,
}) {
  const sizeMap = {
    sm: "size-8 text-[11px]",
    md: "size-11 text-[13px]",
    lg: "size-14 text-[16px]",
  };

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-lg",
        "border border-border bg-popover",
        "font-heading font-semibold leading-none text-primary",
        sizeMap[size],
        className,
      )}
      aria-hidden="true"
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-contain p-1" />
      ) : (
        initialsFromName(name)
      )}
    </div>
  );
}
