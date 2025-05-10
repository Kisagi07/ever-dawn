interface Star {
  name: string;
  targetHours: number;
  spentSeconds: number;
  createdAt?: Date;
}

interface SetScheme {
  break: number;
  focus: number;
}

interface IteratingScheme {
  type: "focus" | "break" | "long_break";
  time: number;
}

interface DayFocus {
  date: string;
  total: number;
}
