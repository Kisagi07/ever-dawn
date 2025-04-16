"use client";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import BreadCrumb from "../components/BreadCrumb";
import Button from "../components/Button";
import FloatingText from "../components/FloatingText";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "../components/Toast";
import redis from "../upstash";

export default function Page() {
  // const [stars, setStars] = useState<Star[]>([
  //   { name: "Photography", spentMinutes: 150, targetHours: 100 },
  //   { name: "Programming", spentMinutes: 900, targetHours: 100 },
  // ]);
  // const [containerHeight, setContainerHeight] = useState(240 * 2);
  // const [containerWidth, setContainerWidth] = useState(0);
  // const positionedStars = useRef<
  //   { x: number; y: number; size: number; style: any; color: "red" | "blue" }[]
  // >([]);
  // const starContainerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // get data
    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string).trim();
    let hour: string | number = (formData.get("hour") as string)
      .replace("Hours", "")
      .trim();
    // validate data
    if (!name) {
      toast("Even star need a name to shine", "red");
      return;
    }
    if (!hour || hour === "0") {
      toast("Set the distance -- every star needs a place in the sky.", "red");
      return;
    }
    hour = Number(hour);
    if (isNaN(hour)) {
      toast("The star awaits, but the path must be clear in numbers", "red");
      return;
    }

    // get old data
    let stars: Star[] | null = [];
    try {
      const oldStars = await redis.get<Star[]>("star");
      if (oldStars) {
        stars = oldStars;
      }
    } catch (error) {
      console.error(error);
      toast("The sky flickered -- past journeys couldn't be found.", "red");
      return;
    }
    const data: Star = {
      name,
      targetHours: hour,
      spentMinutes: 0,
      createdAt: new Date(),
    };
    stars.push(data);
    // store data to upstash
    try {
      const result = await redis.set(`star`, stars);
      toast("The sky holds one more dream now.", "blue");
    } catch (error) {
      console.error(error);
      toast("Clouds crossed your sky. Try once more.", "red");
    }
  };

  // const generatePosition = () => {
  //   // #region absolute positioning
  //   const starSize = 128;
  //   const maxXDistance = containerWidth - starSize;
  //   const maxYDistance = containerHeight - starSize;
  //   const maxXDistancePercentage = (maxXDistance / containerWidth) * 100;
  //   const maxYDistancePercentage = (maxYDistance / containerHeight) * 100;

  //   let positionFound = false;
  //   let xDistance = 0;
  //   let yDistance = 0;
  //   // Generate a non overlapping position
  //   while (!positionFound) {
  //     yDistance = Math.ceil(Math.random() * maxYDistancePercentage);
  //     xDistance = Math.ceil(Math.random() * maxXDistancePercentage);

  //     // Check for overlap with existing stars
  //     positionFound = positionedStars.current.every((star) => {
  //       const distance = Math.sqrt(
  //         Math.pow(star.x - xDistance, 2) + Math.pow(star.y - yDistance, 2)
  //       );
  //       return distance > starSize; // Ensure no overlap
  //     });
  //   }
  //   const style = {
  //     top: `${yDistance}%`,
  //     bottom: `${xDistance}%`,
  //   };
  //   const colors = ["red", "blue"];
  //   const color = colors[
  //     Math.floor(Math.random() * colors.length)
  //   ] as StarColor;
  //   // Save the new positioned
  //   positionedStars.current.push({
  //     x: xDistance,
  //     y: yDistance,
  //     size: starSize,
  //     style,
  //     color,
  //   });
  // };

  // useEffect(() => {
  //   if (starContainerRef.current) {
  //     const width = starContainerRef.current.clientWidth;
  //     setContainerWidth(width);
  //   } else {
  //     setContainerWidth(0);
  //   }
  // }, [starContainerRef.current]);

  // useEffect(() => {
  //   setContainerHeight(stars.length * 240);
  // }, [stars]);

  // useEffect(() => {
  //   stars.forEach(() => generatePosition);
  // }, [stars, containerHeight]);

  // useEffect(() => {
  //   console.log(positionedStars.current);
  // }, [positionedStars.current]);

  return (
    <div className="p-2 sm:p-4 md:p-8 space-y-4">
      <section className="max-w-7xl bg-white shadow-lg rounded-lg md:p-8 p-4 mx-auto space-y-8">
        <div className="space-y-4">
          <BreadCrumb />
          <p>Each hour lights the path ahead.</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="sm:flex gap-4 space-y-4 sm:space-y-0 items-center"
        >
          <Button className="mt-3 w-full sm:w-60 md:w-45" type="submit">
            <PlusCircleIcon className="size-6" />
            New Star
          </Button>
          <FloatingText name="name" label="Star Name" />
          <FloatingText
            name="hour"
            defaultValue="0"
            label="Distance"
            endOfValue="Hours"
          />
        </form>
      </section>
      <section className="max-w-7xl bg-white shadow-lg rounded-lg md:p-8 p-4 mx-auto space-y-8">
        <div className="space-y-4">
          <h2 className="font-bold text-xl">Your Sky</h2>
          <p className="text-sm text-neutral-500">
            Every star here marks a promise to yourself.
          </p>
        </div>
        <div
          className={`h-20 relative`}
          // ref={starContainerRef}
        >
          {/* <Star
            containerSize={240 * totalStar}
            name="Photography"
            targetHours={500}
            spentMinutes={18000}
          />
          <Star
            containerSize={240 * totalStar}
            name="Coding"
            targetHours={200}
            spentMinutes={300}
          /> */}
          {/* <CircularProgress progress={20} strokeWidth={6} />
          <CircularProgress progress={70} strokeWidth={6} /> */}
        </div>
      </section>
    </div>
  );
}

type StarColor = "red" | "blue";

function Star({
  name,
  targetHours,
  spentMinutes,
  containerSize,
}: Omit<Star, "createdAt"> & { containerSize: number }) {
  const [style, setStyle] = useState({});
  const [color, setColor] = useState<StarColor>("blue");
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    // #region absolute positioning
    const starSize = 128;
    const maxDistance = containerSize - starSize;
    const maxDistancePercentage = (maxDistance / containerSize) * 100;
    const yAxis = ["top", "bottom"];
    const xAxis = ["left", "right"];
    const yDistance = Math.ceil(Math.random() * maxDistancePercentage);
    const xDistance = Math.ceil(Math.random() * maxDistancePercentage);

    const y = Math.floor(Math.random() * yAxis.length);
    const x = Math.floor(Math.random() * xAxis.length);

    setStyle({
      [yAxis[y]]: `${yDistance}%`,
      [xAxis[x]]: `${xDistance}%`,
    });
    // #endregion
    // #region color randomizer
    const colors = ["red", "blue"];
    const color = colors[
      Math.floor(Math.random() * colors.length)
    ] as StarColor;
    setColor(color);
    // #endregion
    setDisplay(true);
  }, []); // Run only once on the client side

  const progress = (Math.floor(spentMinutes / 60) / targetHours) * 100;

  return (
    <div className="absolute" style={style}>
      <div className="relative flex items-center flex-col gap-2 aspect-square w-32">
        <CircularProgress
          color={color}
          progress={progress}
          strokeWidth={6}
          starName={name}
        />
        <p className="text-sm text-neutral-500 font-medium text-center">
          <span
            className={`font-medium ${
              color === "red"
                ? "text-red-400"
                : color === "blue"
                ? "text-blue-400"
                : "text-neutral-400"
            }`}
          >
            {Math.floor(spentMinutes / 60)}h
          </span>{" "}
          of {targetHours}h
        </p>
      </div>
    </div>
  );
}

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: "blue" | "red";
  starName: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 100,
  strokeWidth = 10,
  color = "blue",
  starName,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative">
      <div
        className={`size-27 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl ${
          color === "blue" ? "bg-blue-600" : "bg-red-600"
        }`}
      ></div>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={
            color === "blue"
              ? "oklch(88.2% 0.059 254.128)"
              : "oklch(88.5% 0.062 18.334)"
          }
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={
            color === "blue"
              ? "oklch(70.7% 0.165 254.624)"
              : "oklch(70.4% 0.191 22.216)"
          }
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <p className="bg-white/70 rounded-lg px-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {starName}
      </p>
    </div>
  );
};
