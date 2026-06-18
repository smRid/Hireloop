import { cn } from "@/lib/utils";

const FeatureItem = ({ icon: Icon, label, description }) => {
  return (
    <div className="rounded-xl border border-border/70 bg-background/55 p-5 shadow-sm shadow-black/5 transition-colors duration-200 hover:border-primary/45">
      <div
        className={cn(
          "mb-4 flex size-11 items-center justify-center rounded-lg",
          "border border-primary/20 bg-primary/8 shadow-sm shadow-black/10",
        )}
        aria-hidden="true"
      >
        <Icon className="size-5.5 text-primary" strokeWidth={1.75} />
      </div>

      <h3 className="font-heading text-[17px] font-semibold leading-snug text-foreground">
        {label}
      </h3>

      <p className="mt-2 font-sans text-[14px] leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
};

export default FeatureItem;
