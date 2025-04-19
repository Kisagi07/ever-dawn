import { ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  text: string;
}
const Tooltip = ({ children, text }: TooltipProps) => {
  return (
    <div className="relative group">
      <span className="bg-white pointer-events-none absolute whitespace-nowrap text-xs left-1/2 -translate-x-1/2 -top-2 -translate-y-full ring ring-neutral-300 p-1 rounded-lg opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all">
        {text}
      </span>
      {children}
    </div>
  );
};
export default Tooltip;
