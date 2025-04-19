import { FormEvent, useEffect, useRef } from "react";
import FloatingText from "./FloatingText";
import Button from "./Button";
import { toast } from "./Toast";

interface ModalProps {
  onClose: () => void;
  addMinute: (num: number) => void;
}

const Modal = ({ onClose, addMinute }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleAutoClose = (e: MouseEvent) => {
    if (!modalRef.current!.contains(e.target as Node)) {
      onClose();
      document.removeEventListener("click", handleAutoClose);
      document.body.style.overflow = "";
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const minutes = Number(formData.get("minutes"));
    if (isNaN(minutes)) {
      toast("Minutes must be number", "red");
    }
    addMinute(minutes);
  };

  useEffect(() => {
    document.addEventListener("click", handleAutoClose);
    document.body.style.overflow = "hidden";
  }, []);
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center px-2 bg-black/70 justify-center">
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-4 space-y-4 ring ring-neutral-300 w-full"
      >
        <h3 className="font-medium text-xl border-b border-neutral-200">
          Add Time
        </h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <FloatingText label="Add Minutes" name="minutes" />
          <Button className="w-full" type="submit">
            Add
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
