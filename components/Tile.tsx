import { useState, useEffect } from "react";

export type TileNumber = number | undefined;

export type ChangeType = "newTile" | "addTile";

export interface TileProps {
  value: TileNumber;
  animation?: string;
}

const colorMap: Record<number, string> = {
  2: "bg-white",
  4: "bg-orange-50",
  8: "bg-orange-300",
  16: "bg-orange-500",
  32: "bg-red-300",
  64: "bg-red-600",
  128: "bg-amber-200",
  256: "bg-amber-400",
  512: "bg-amber-600",
  1024: "bg-yellow-300",
  2048: "bg-yellow-500",
  4096: "bg-yellow-800",
};

const textColorMap: Record<number, string> = {
  2: "gray-700",
  4: "gray-700",
  8: "text-white",
  16: "text-white",
  32: "text-white",
  64: "text-white",
  128: "text-white",
  256: "text-white",
  512: "text-white",
  1024: "text-white",
  2048: "text-white",
  4096: "text-white",
};

export default function Tile(props: TileProps): JSX.Element {
  return (
    <div
      className={`${
        props.animation
      } rounded-xl flex text-2xl font-bold w-16 h-16 ${
        props.value && textColorMap[props.value]
          ? textColorMap[props.value]
          : "text-gray-700"
      } ${
        props.value && colorMap[props.value]
          ? colorMap[props.value]
          : "bg-gray-500"
      } rounded-sm `}
    >
      <p className="mx-auto my-auto">{props.value}</p>
    </div>
  );
}
