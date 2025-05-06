import Link from "next/link";
import Image from "next/image";

const Home = () => {
  return (
    <>
      <div className="space-y-8 ">
        <div className="-light py-8">
          <section id="hero" className="font-inter max-w-7xl mx-auto p-4 space-y-4  rounded py-8">
            <div className="sm:flex sm:items-center sm:gap-4 sm:justify-center">
              <Image src="/images/logo.png" width={160} height={160} alt="" className="w-40 mx-auto sm:mx-0 " />
              <h1 className="font-inter text-center text-4xl font-extrabold">Ever Dawn</h1>
            </div>
            <h2 className="text-center md:mt-8 text-2xl md:text-center font-medium">Grow with the Rhythm of Light</h2>
            <p className="text-sm text-center">A mindful helper crafted to guide your focus and growth. like the steady rise of a new sun.</p>
          </section>
        </div>
        <section className="rounded p-4 py-8 space-y-8 md:p-8 max-w-7xl mx-auto">
          <h2 className="font-semibold text-2xl">Tools</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
            <Tool href="/rythm-rise" title="Rythm Rise" imageSrc="/images/spread-learn-icon.png" />
            <Tool href="/distant-star" title="Distant Star" imageSrc="/images/distant-light.png" />
            <Tool href="/sol-cycle" title="Sol Cycle" imageSrc="/images/sol-cycle.png" />
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;

function Tool({ title, href, imageSrc }: { title: string; href: string; imageSrc: string }) {
  return (
    <Link href={href} className="interactable bg-white rounded-lg flex flex-col items-center p-4 space-y-4 shadow-xl">
      <Image src={imageSrc} alt="" className="size-20" width={80} height={80} />
      <h3 className="text-center font-medium">{title}</h3>
    </Link>
  );
}
