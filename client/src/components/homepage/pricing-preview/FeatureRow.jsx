import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const FeatureRow = ({ text, included = true }) => {
  return (
    <li className="flex items-start gap-2.5">
      <span
        className={cn(
          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
          included
            ? "bg-primary/15 text-primary"
            : "bg-muted text-muted-foreground/40",
        )}
        aria-hidden="true"
      >
        {included ? (
          <Check className="size-2.5" strokeWidth={3} />
        ) : (
          <span className="block h-px w-2 bg-current" />
        )}
      </span>
      <span
        className={cn(
          "font-sans text-[13px] leading-snug",
          included
            ? "text-foreground"
            : "text-muted-foreground/50 line-through",
        )}
      >
        {text}
      </span>
    </li>
  );
};

export default FeatureRow;
