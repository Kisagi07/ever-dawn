import { get } from "http";
import { ReactNode } from "react";

const Surface = ({
  level = 0,
  children,
}: {
  level: 0 | 1 | 2 | 3 | 4;
  children: ReactNode;
}) => {
  const getSurfaceColor = () => {
    switch (level) {
      case 0:
        return "bg-surface-container-lowest";
      case 1:
        return "bg-surface-container-low";
      case 2:
        return "bg-surface-container";
      case 3:
        return "bg-surface-container-high";
      case 4:
        return "bg-surface-container-highest";
      default:
        return "bg-surface-container-low";
    }
  };

  return (
    <section
      className={`container text-on-surface mx-auto rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300" ${getSurfaceColor()} space-y-8`}
    >
      {children}
    </section>
  );
};
export default Surface;
