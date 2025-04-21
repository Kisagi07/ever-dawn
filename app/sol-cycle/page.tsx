import { Suspense } from "react";
import SolCycle from "../components/SolCycle";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SolCycle />
    </Suspense>
  );
};
export default Page;
