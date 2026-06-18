import { cn } from "@/lib/utils";

const FeatureItem = ({ icon: Icon, label, description }) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Icon container */}
      <div
        className={cn(
          "flex size-12 items-center justify-center rounded-lg",
          "border border-primary/20 bg-primary/8",
        )}
        aria-hidden="true"
      >
        <Icon className="size-5.5 text-primary" strokeWidth={1.75} />
      </div>

      {/* Label */}
      <h3 className="font-heading text-[17px] font-semibold leading-snug text-foreground">
        {label}
      </h3>

      {/* Description */}
      <p className="font-sans text-[14px] leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
};

export default FeatureItem;
