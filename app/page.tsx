import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/images/logo.png";
import SpreadLearn from "@/public/images/spread-learn-icon.png";

const Home = () => {
  return (
    <>
      <div className="space-y-8 bg-white">
        <section
          id="hero"
          className="font-inter max-w-7xl mx-auto p-4 space-y-8 bg-white rounded py-8 md:flex md:items-center md:gap-40 md:space-y-0 md:p-8"
        >
          <Image
            src={Logo}
            alt=""
            className="size-40 mx-auto md:order-2 md:size-60"
          />
          <div className="space-y-8">
            <h1 className="text-center text-3xl font-extrabold md:text-left">
              Grow with the Rhythm of Light
            </h1>
            <p className="text-sm">
              Ever Dawn is a personal helper app crafted for mindful focus and
              growth. Starting with spread-based learning rhythms, it gently
              guidesyour day through clarity, rhythm, and intention -- like the
              rise of every new dawn.
            </p>
          </div>
        </section>
        <section className="rounded p-4 py-8 space-y-8 bg-surface-0 md:p-8 max-w-7xl mx-auto">
          <h2 className="font-semibold text-2xl">Tools</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
            <Link
              href="/rythm-rise"
              className="interactable bg-neutral-100 rounded flex flex-col items-center p-4 space-y-4 shadow"
            >
              <Image src={SpreadLearn} alt="" className="size-20" />
              <h3 className="text-center font-medium">Rythm Rise</h3>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
