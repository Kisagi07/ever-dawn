"use client";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import BreadCrumb from "../components/BreadCrumb";
import Button from "../components/Button";
import FloatingText from "../components/FloatingText";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "../components/Toast";
import redis from "../upstash";
import ActionFloatingMenu from "../components/ActionFloatingMenu";
import Modal from "../components/Modal";

export default function Page() {
  const [stars, setStars] = useState<Star[]>([]);
  const [openAddTimeModal, setOpenAddTimeModal] = useState(false);
  const [addingTimeStar, setAddingTimeStar] = useState("");

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
      const oldStars = await redis.get<Star[]>("stars");
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
    setStars((prev) => [...prev, data]);
    // store data to upstash
    try {
      const result = await redis.set(`stars`, stars);
      toast("The sky holds one more dream now.", "blue");
    } catch (error) {
      console.error(error);
      toast("Clouds crossed your sky. Try once more.", "red");
    }
  };

  const getStars = async () => {
    try {
      const stars = await redis.get<Star[]>("stars");
      if (stars) {
        setStars(stars);
      }
    } catch (error) {
      console.error(error);
      toast("The sky flickered -- past journeys couldn't be found.", "red");
    }
  };

  const handleAddMinute = async (minute: number) => {
    const starIndex = stars.findIndex((star) => star.name === addingTimeStar);
    if (starIndex !== -1) {
      try {
        let updated = [...stars];
        updated[starIndex].spentMinutes += minute;
        await redis.set("stars", updated);
        setStars(updated);
      } catch (error) {
        console.error(error);
        toast(
          "Failed in manually adding minutes spent to " + addingTimeStar,
          "red"
        );
      }
    } else {
      toast("Adding minutes to a star that is not found");
    }
  };

  const handleAddTimeClick = () => {
    setOpenAddTimeModal(true);
  };

  useEffect(() => {
    getStars();
  }, []);

  return (
    <>
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {stars.map((star) => (
              <ActionFloatingMenu
                key={star.name}
                addTimeOnClick={() => {
                  console.log(star.name);
                  setAddingTimeStar(star.name);
                  handleAddTimeClick();
                }}
              >
                <Star
                  name={star.name}
                  targetHours={star.targetHours}
                  spentHours={Math.floor(star.spentMinutes / 60)}
                />
              </ActionFloatingMenu>
            ))}
          </div>
        </section>
      </div>
      {openAddTimeModal && (
        <Modal
          addMinute={handleAddMinute}
          onClose={() => setOpenAddTimeModal(false)}
        />
      )}
    </>
  );
}

const Star = ({
  name,
  targetHours,
  spentHours,
}: {
  name: string;
  targetHours: number;
  spentHours: number;
}) => {
  const percentage = (spentHours / targetHours) * 100;
  return (
    <div className="bg-neutral-100 rounded-lg p-4 space-y-2">
      <h3 className="font-medium">{name}</h3>
      <div className="flex items-center gap-4">
        <img src="/svgs/star-glow.svg" alt="Star Icon" className="size-10" />
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
