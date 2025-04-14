import { PlusCircleIcon } from "@heroicons/react/24/outline";
import BreadCrumb from "../components/BreadCrumb";
import Button from "../components/Button";
import FloatingText from "../components/FloatingText";
import { FormEvent } from "react";

export default function Page() {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="p-8">
      <section className="max-w-7xl bg-white shadow-lg rounded-lg p-8 mx-auto space-y-8">
        <BreadCrumb />
        <p>Each hour lights the path ahead.</p>
        <form onSubmit={handleSubmit} className="flex gap-4 items-center">
          <Button className="mt-3">
            <PlusCircleIcon className="size-6" />
            New Star
          </Button>
          <FloatingText label="Star Name" />
          <FloatingText defaultValue="0" label="Distance" endOfValue="Hours" />
        </form>
      </section>
    </div>
  );
}
