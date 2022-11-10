import { Coordinate } from "./Game";
import Tile, { TileNumber } from "./Tile";

export type Dimension = 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface BoardProps {
  dimension: Dimension;
  data?: TileNumber[][];
}

export default function Board(props: BoardProps): JSX.Element {
  return (
    <div id="game-board" className="bg-gray-400 shadow-inner p-2 gap-2">
      {props.data?.map((row: TileNumber[], i: number) => (
        <div key={`BoardRow-${i}`} className="bg-transparent flex gap-2 py-1">
          {row.map((value: TileNumber, j: number) => (
            <Tile
              key={`Tile-${j}`}
              value={value}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
