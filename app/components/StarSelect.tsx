import { useEffect, useState } from "react";
import fetchStar from "../libs/fetchStar";
import { Star } from "./Star";

interface StarSelectProps {
  starSelected: (star: Star) => void;
}
const StarSelect = ({ starSelected }: StarSelectProps) => {
  const [loading, setLoading] = useState(true);
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    fetchStar().then((stars) => {
      setStars(stars);
      setLoading(false);
    });
  }, []);
  return (
    <div className="absolute bg-white shadow z-10 rounded min-h-30 max-h-60 overflow-y-auto ring ring-gray-200 min-w-60 left-1/2 -translate-x-1/2">
      {loading ? (
        <div className="p-4">
          <div className="border-4 border-primary animate-spin border-r-secondary size-20 mx-auto rounded-full"></div>
        </div>
      ) : (
        stars.map((star) => (
          <div onClick={() => starSelected(star)} key={star.name}>
            <Star
              name={star.name}
              spentHours={Math.floor(star.spentSeconds / 60 / 60)}
              targetHours={star.targetHours}
              className=" !bg-white !shadow-none hover:!bg-gray-100 transition-colors cursor-pointer"
            />
          </div>
        ))
      )}
    </div>
  );
};
export default StarSelect;
