import BreadCrumb from "../components/BreadCrumb";

export default function Page() {
  return (
    <div className="p-8">
      <section className="max-w-7xl bg-white shadow-lg rounded-lg p-8 mx-auto space-y-8">
        <BreadCrumb />
        <p>Each hour lights the path ahead.</p>
      </section>
    </div>
  );
}
