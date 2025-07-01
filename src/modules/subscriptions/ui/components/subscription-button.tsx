import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";

interface SubscriptionButtonProps {
  onClick: () => void;
  disabled: boolean;
  isSubscribed?: boolean;
  className?: string;
  size?: ButtonProps["size"];
}

export const SubscriptionButton = ({
  onClick,
  disabled,
  isSubscribed,
  className,
  size,
}: SubscriptionButtonProps) => {
  return (
    <Button
      size={size}
      variant={isSubscribed ? "default" : "secondary"}
      className={cn("rounded-full", className)}
      onClick={onClick}
      disabled={disabled}
    >
      {isSubscribed ? "Subscribe" : "Unsubscribe"}
    </Button>
  );
};
