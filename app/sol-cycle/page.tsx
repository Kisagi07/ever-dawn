import BreadCrumb from "../components/BreadCrumb";

const Page = () => {
  return (
    <div className="bg-white w-full h-screen flex items-center justify-center flex-col gap-4">
      <p className=" text-primary font-medium">Drawing</p>
      <h2 className="text-7xl font-bold text-primary">25:00</h2>
      <button className="bg-primary text-white font-semibold text-2xl px-4 py-2 relative rounded-lg min-w-60 after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-black after:opacity-0 after:rounded-[inherit] after:transition-opacity hover:after:opacity-hover active:after:opacity-active focus:after:opacity-focus cursor-pointer">
        Start
      </button>
      {/* <button className="bg-secondary text-white font-semibold text-2xl px-4 py-2 relative rounded-lg min-w-60 after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-black after:opacity-0 after:rounded-[inherit] after:transition-opacity hover:after:opacity-hover active:after:opacity-active focus:after:opacity-focus cursor-pointer">
        Pause
      </button>
      <button className="bg-white text-secondary border border-secondary font-semibold text-2xl px-4 py-2 relative rounded-lg min-w-60 after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-secondary after:opacity-0 after:rounded-[inherit] after:transition-opacity hover:after:opacity-hover active:after:opacity-active focus:after:opacity-focus cursor-pointer">
        Stop
      </button> */}
      <h3 className="text-xl font-medium text-neutral-400">Focus</h3>
    </div>
  );
};
export default Page;
