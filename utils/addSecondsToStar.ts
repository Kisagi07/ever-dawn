import updateStar from "@/app/libs/updateStar";

const addSecondsToStar = (seconds: number, starSelected: Star | null, setStarSelected: (star: Star) => void) => {
  if (starSelected) {
    const newStar = { ...starSelected };
    newStar.spentSeconds += seconds;
    setStarSelected(newStar);
    updateStar(newStar);
  }
};
export default addSecondsToStar;
