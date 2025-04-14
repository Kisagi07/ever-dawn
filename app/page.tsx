import Link from "next/link";
import Image from "next/image";

const Home = () => {
  return (
    <>
      <div className="space-y-8 ">
        <div className="bg-accent text-neutral-light py-8">
          <section
            id="hero"
            className="font-inter max-w-7xl mx-auto p-4 space-y-8  rounded py-8 md:flex md:items-center md:gap-40 md:space-y-0 md:p-8"
          >
            <Image
              src="/images/logo.png"
              width={160}
              height={160}
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
                guidesyour day through clarity, rhythm, and intention -- like
                the rise of every new dawn.
              </p>
            </div>
          </section>
        </div>
        <section className="rounded p-4 py-8 space-y-8 md:p-8 max-w-7xl mx-auto">
          <h2 className="font-semibold text-2xl">Tools</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
            <Tool
              href="/rythm-rise"
              title="Rythm Rise"
              imageSrc="/images/spread-learn-icon.png"
            />
            <Tool
              href="/distant-light"
              title="Distant Light"
              imageSrc="/images/distant-light.png"
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;

function Tool({
  title,
  href,
  imageSrc,
}: {
  title: string;
  href: string;
  imageSrc: string;
}) {
  return (
    <Link
      href={href}
      className="interactable bg-white rounded-lg flex flex-col items-center p-4 space-y-4 shadow"
    >
      <Image src={imageSrc} alt="" className="size-20" width={80} height={80} />
      <h3 className="text-center font-medium">{title}</h3>
    </Link>
  );
}
