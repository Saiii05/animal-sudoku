import React from "react";
import { useGame } from "../context/GameContext";
import { clsx } from "clsx";
import { Cell } from "../types";

const CellView: React.FC<{ cell: Cell }> = ({ cell }) => {
  const { state, dispatch, animals } = useGame();
  const sel = state.selectedCell;

  const sameRow = sel && sel[0] === cell.row;
  const sameCol = sel && sel[1] === cell.col;
  const sameBox =
    sel &&
    Math.floor(sel[0] / 3) === Math.floor(cell.row / 3) &&
    Math.floor(sel[1] / 3) === Math.floor(cell.col / 3);

  return (
    <div
      className={clsx(
        "cell",
        sameRow && "cell-row",
        sameCol && "cell-col",
        sameBox && "cell-box",
        cell.isError && "cell-error",
        cell.isGiven && "cell-given"
      )}
      onClick={() =>
        dispatch({ type: "SELECT_CELL", row: cell.row, col: cell.col })
      }
      onDragOver={e => !cell.isGiven && e.preventDefault()}
      onDrop={e => {
        if (cell.isGiven) return;
        const v = Number(e.dataTransfer.getData("animal"));
        dispatch({ type: "SELECT_CELL", row: cell.row, col: cell.col });
        dispatch({ type: "INPUT_VALUE", value: v });
      }}
    >
      {cell.value ? animals[cell.value - 1]?.char : ""}
    </div>
  );
};

export const Board = () => {
  const { state } = useGame();
  if (state.grid.length !== 9) return <div>Loading…</div>;

  return (
    <div className="board">
      {state.grid.flat().map(cell => (
        <CellView key={`${cell.row}-${cell.col}`} cell={cell} />
      ))}
    </div>
  );
};

