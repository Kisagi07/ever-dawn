import { ReactNode, useCallback, useEffect, useRef } from "react";

interface ModalProps {
  onClose: () => void;
  children?: ReactNode;
}

const Modal = ({ onClose, children }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleAutoClose = useCallback(
    (e: MouseEvent) => {
      if (!modalRef.current!.contains(e.target as Node)) {
        onClose();
        document.body.style.overflow = "";
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("click", handleAutoClose);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("click", handleAutoClose);
    };
  }, [handleAutoClose]);
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center px-2 bg-black/70 justify-center">
      <div
        ref={modalRef}
        className="bg-white max-w-sm rounded-lg p-4 space-y-4 ring ring-neutral-300 w-full"
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
