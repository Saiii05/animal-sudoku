export type Animal = { id: string; char: string; name: string; isCustom?: boolean; };
export type CellValue = number | null; 
export type Cell = { row: number; col: number; value: CellValue; solution: number; isGiven: boolean; notes: number[]; isError: boolean; };
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type GameState = { grid: Cell[][]; selectedCell: [number, number] | null; history: Cell[][][]; historyPointer: number; difficulty: Difficulty; isSolved: boolean; mistakes: number; timer: number; isPencilMode: boolean; };
