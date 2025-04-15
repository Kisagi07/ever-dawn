"use client";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import BreadCrumb from "../components/BreadCrumb";
import Button from "../components/Button";
import FloatingText from "../components/FloatingText";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "../components/Toast";
import redis from "../upstash";

export default function Page() {
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
      hour,
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
          <Button className="mt-3 w-full sm:w-60 md:w-40" type="submit">
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
        <div className="grid grid-rows-[10rem] grid-cols-[10rem] justify-center">
          <Star name="Photography" hour={500} />
        </div>
      </section>
    </div>
  );
}

type StarColor = "red" | "blue" | "neutral";

function Star({ name, hour }: Star) {
  const [style, setStyle] = useState({});
  const [color, setColor] = useState<StarColor>("neutral");
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    // #region absolute positioning
    const containerSize = 160;
    const starSize = 80;
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

  return (
    <div className="relative">
      <div
        style={style}
        className={`absolute transition-opacity ${
          display ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`relative flex justify-center z-10 items-center size-24 border-6 rounded-full ${
            color === "red"
              ? "border-red-200"
              : color === "blue"
              ? "border-blue-200"
              : "border-neutral-200"
          }`}
        >
          <h3 className="bg-white">{name}</h3>
          <div
            className={`size-28absolute rounded-full opacity-30 blur-2xl ${
              color === "red"
                ? "bg-red-500"
                : color === "blue"
                ? "bg-blue-500"
                : "bg-neutral-500"
            }`}
          ></div>
        </div>
        <p className="text-sm text-neutral-500 font-medium">
          <span
            className={`font-medium ${
              color === "red"
                ? "text-red-400"
                : color === "blue"
                ? "text-blue-400"
                : "text-neutral-400"
            }`}
          >
            480h
          </span>{" "}
          of {hour}h
        </p>
      </div>
    </div>
  );
}
