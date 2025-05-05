import { Badge } from "@/components/ui/badge";
import clsx from "clsx";

interface SchemeIndicatorProps {
  scheme: IteratingExtended[];
  activeSchemeIndex: number;
}
const SchemeIndicator = ({ scheme }: SchemeIndicatorProps) => {
  return (
    <div className="overflow-hidden  w-full">
      <div className="flex gap-1 transition-transform delay-500" style={{ transform: `translateX(-${72 * activeSchemeIndex}px)` }}>
        {scheme.map((sc, index) => (
          <Badge
            key={sc.id}
            className={clsx("capitalize transition-all w-17 text-center", {
              "bg-blue-100 text-blue-500": sc.type === "break",
              "bg-red-100 text-red-500": sc.type === "focus",
              "bg-blue-500 text-white": sc.type === "break" && index == activeSchemeIndex,
              "bg-red-500 text-white": sc.type === "focus" && index == activeSchemeIndex,
              "animate-fade-out": index < activeSchemeIndex,
            })}
          >
            {sc.type} : {sc.time}
          </Badge>
        ))}
      </div>
    </div>
  );
};
export default SchemeIndicator;
