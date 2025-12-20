import React from "react";
import { useGame } from "../context/GameContext";

export const Controls = () => {
  const { animals, dispatch } = useGame();

  return (
    <div className="controls">
      {animals.map((a, i) => (
        <div
          key={a.id}
          draggable
          className="animal"
          onDragStart={e =>
            e.dataTransfer.setData("animal", String(i + 1))
          }
          onClick={() =>
            dispatch({ type: "INPUT_VALUE", value: i + 1 })
          }
        >
          {a.char}
        </div>
      ))}
    </div>
  );
};

