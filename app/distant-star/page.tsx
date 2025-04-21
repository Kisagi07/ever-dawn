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
import { Star } from "../components/Star";

export default function Page() {
  const [stars, setStars] = useState<Star[]>([]);
  const [openAddTimeModal, setOpenAddTimeModal] = useState(false);
  const [openTimeSpentCorrection, setOpenTimeSpentCorrection] = useState(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [activeActionStar, setActiveActionStar] = useState("");

  const handleAddStarSubmit = async (e: FormEvent<HTMLFormElement>) => {
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

  const handleAddMinuteSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const minutes = Number(formData.get("minutes"));
    if (isNaN(minutes)) {
      toast("Minutes must be number", "red");
    }
    handleAddMinute(minutes);
  };

  const handleSpentMinuteCorrectionSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const minutes = Number(formData.get("minutes"));
    if (isNaN(minutes)) {
      toast("Minutes must be number", "red");
    }

    const starIndex = stars.findIndex((star) => star.name === activeActionStar);
    if (starIndex !== -1) {
      try {
        let updated = [...stars];
        updated[starIndex].spentMinutes = minutes;
        await redis.set("stars", updated);
        setStars(updated);
        setOpenTimeSpentCorrection(false);
        toast(`The star shine as much as you expected it to be`, "blue");
      } catch (error) {
        console.error(error);
        toast(`You can't seems to measure the shine of the star`, "red");
      }
    } else {
      toast("You can't seems to find the star");
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
    const starIndex = stars.findIndex((star) => star.name === activeActionStar);
    if (starIndex !== -1) {
      try {
        let updated = [...stars];
        updated[starIndex].spentMinutes += minute;
        await redis.set("stars", updated);
        setStars(updated);
        setOpenAddTimeModal(false);
        toast(`${activeActionStar} star seems to shine even brighter`);
      } catch (error) {
        console.error(error);
        toast(
          `The shine of ${activeActionStar} star does not seems to change`,
          "red"
        );
      }
    } else {
      toast("You can't seems to find the star");
    }
  };

  const handleAddTimeClick = () => {
    setOpenAddTimeModal(true);
  };

  const handleSpentMinuteCorrectionClick = () => {
    setOpenTimeSpentCorrection(true);
  };

  const handleDeleteClick = () => {
    setOpenDeleteConfirmation(true);
  };

  const handleDeleteStar = () => {
    const updated = [...stars];
    const index = updated.findIndex((star) => star.name === activeActionStar);
    if (index !== -1) {
      updated.splice(index, 1);
      redis
        .set("stars", updated)
        .then(() => {
          toast(
            `${activeActionStar} star has been removed from the sky.`,
            "blue"
          );
          setStars(updated);
        })
        .catch((error) => {
          console.error(error);
          toast("Failed to remove the star from the sky.", "red");
        });
      setOpenDeleteConfirmation(false);
    } else {
      toast("The star you wish to remove is not found.", "red");
    }
  };

  useEffect(() => {
    getStars();
  }, []);

  return (
    <>
      <div className="p-2 sm:p-4 md:p-8 space-y-4">
        <section className="max-w-7xl bg-white shadow rounded md:p-8 p-4 mx-auto space-y-8">
          <div className="space-y-4">
            <BreadCrumb />
            <p>Each hour lights the path ahead.</p>
          </div>
          <form
            onSubmit={handleAddStarSubmit}
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
        <section className="max-w-7xl bg-white shadow rounded md:p-8 p-4 mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="font-bold text-xl">Your Sky</h2>
            <p className="text-sm text-slate-500">
              Every star here marks a promise to yourself.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {stars.map((star) => (
              <ActionFloatingMenu
                key={star.name}
                addTimeOnClick={() => {
                  setActiveActionStar(star.name);
                  handleAddTimeClick();
                }}
                onSpentMinuteCorrectionClick={() => {
                  setActiveActionStar(star.name);
                  handleSpentMinuteCorrectionClick();
                }}
                onDeleteClick={() => {
                  setActiveActionStar(star.name);
                  handleDeleteClick();
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
        <Modal onClose={() => setOpenAddTimeModal(false)}>
          <h3 className="font-medium text-xl border-b border-slate-200">
            Add Time
          </h3>
          <form className="space-y-4" onSubmit={handleAddMinuteSubmit}>
            <FloatingText label="Add Minutes" name="minutes" />
            <Button className="w-full" type="submit">
              Add
            </Button>
          </form>
        </Modal>
      )}
      {openTimeSpentCorrection && (
        <Modal onClose={() => setOpenTimeSpentCorrection(false)}>
          <h3 className="font-medium text-xl border-b border-slate-200">
            Spent Minutes Correction
          </h3>
          <form
            className="space-y-4"
            onSubmit={handleSpentMinuteCorrectionSubmit}
          >
            <FloatingText label="Minutes" name="minutes" />
            <Button className="w-full" type="submit">
              Save
            </Button>
          </form>
        </Modal>
      )}
      {openDeleteConfirmation && (
        <Modal onClose={() => setOpenDeleteConfirmation(false)}>
          <h3 className="font-medium text-xl ">
            Delete Your {activeActionStar} Star ?
          </h3>
          <div className="flex gap-2 justify-end">
            <Button onClick={handleDeleteStar}>Yes</Button>
            <Button
              onClick={() => setOpenDeleteConfirmation(false)}
              className="!bg-slate-300 !text-slate-600 after:!bg-slate-950"
            >
              Cancel
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
