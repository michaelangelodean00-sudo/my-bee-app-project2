
import { cn } from "@/lib/utils";

const RightSidebar = ({ className }: { className?: string }) => {
  return (
    <div className={cn("w-80 p-4 hidden lg:block", className)}>
      {/* Intentionally left empty as per user request */}
    </div>
  );
};

export default RightSidebar;
