import Image from "next/image";

export const Star = ({
  name,
  targetHours,
  spentHours,
  className = "",
}: {
  name: string;
  targetHours: number;
  spentHours: number;
  className?: string;
}) => {
  const percentage = (spentHours / targetHours) * 100;
  return (
    <div className={`bg-gray-100 shadow rounded p-4 space-y-2 ${className}`}>
      <h3 className="font-medium">{name}</h3>
      <div className="flex items-center gap-4">
        <Image
          src="/svgs/star-glow.svg"
          alt="Star Icon"
          className="size-10"
          width={40}
          height={40}
        />
        <span>
          {spentHours}h of {targetHours}h
        </span>
      </div>
      <div className="h-2 bg-red-100 rounded-full">
        <div
          style={{ width: `${percentage}%` }}
          className="h-2 bg-red-500 rounded-full"
        ></div>
      </div>
    </div>
  );
};
