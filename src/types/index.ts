export type Cell = {
  row: number;
  col: number;
  value: number | null;
  solution: number;
  given: boolean;
  error: boolean;
};

export type Difficulty = "Easy" | "Medium" | "Hard";

