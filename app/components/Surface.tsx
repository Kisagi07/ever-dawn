import { ReactNode } from "react";

const Surface = ({
  level = 0,
  children,
  className = "",
}: {
  level: 0 | 1 | 2 | 3 | 4;
  children: ReactNode;
  className?: string;
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
      className={`text-on-surface rounded-2xl p-4 shadow  ${getSurfaceColor()} space-y-8 ${className}`}
    >
      {children}
    </section>
  );
};
export default Surface;
