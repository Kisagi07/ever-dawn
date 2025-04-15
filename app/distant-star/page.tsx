"use client";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import BreadCrumb from "../components/BreadCrumb";
import Button from "../components/Button";
import FloatingText from "../components/FloatingText";
import { FormEvent } from "react";
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
    <div className="p-2 sm:p-4 md:p-8">
      <section className="max-w-7xl bg-white shadow-lg rounded-lg p-8 mx-auto space-y-8">
        <BreadCrumb />
        <p>Each hour lights the path ahead.</p>
        <form onSubmit={handleSubmit} className="sm:flex gap-4 items-center">
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
    </div>
  );
}
