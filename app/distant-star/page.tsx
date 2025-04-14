"use client";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import BreadCrumb from "../components/BreadCrumb";
import Button from "../components/Button";
import FloatingText from "../components/FloatingText";
import { FormEvent } from "react";
import { toast } from "../components/Toast";

export default function Page() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // get data
    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string).trim();
    let hour: string | number = (formData.get("hour") as string)
      .replace("Hours", "")
      .trim();
    // validate data
    if (!name) {
      toast("Star name required", "red");
      return;
    }
    if (!hour || hour === "0") {
      toast("Distance required", "red");
      return;
    }
    hour = Number(hour);
    if (isNaN(hour)) {
      toast("Distance need to be a number", "red");
      return;
    }
  };

  return (
    <div className="p-8">
      <section className="max-w-7xl bg-white shadow-lg rounded-lg p-8 mx-auto space-y-8">
        <BreadCrumb />
        <p>Each hour lights the path ahead.</p>
        <form onSubmit={handleSubmit} className="flex gap-4 items-center">
          <Button className="mt-3" type="submit">
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
