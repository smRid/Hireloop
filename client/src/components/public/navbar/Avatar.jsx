import { cn } from "@/lib/utils";
import Image from "next/image";

/* ── Derive initials from a full name ───────────────────────────── */
function nameInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const Avatar = ({ name, image, size = 36 }) => {
  const initials = nameInitials(name);
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        "bg-secondary",
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {image ? (
        <Image
          src={image}
          alt={name}
          width={size}
          height={size}
          className="size-full object-cover"
        />
      ) : (
        <span className="font-heading text-[13px] font-semibold leading-none text-foreground">
          {initials}
        </span>
      )}
    </span>
  );
};

export default Avatar;
