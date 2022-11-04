import Tile, { TileNumber } from "./Tile";


export type Dimension = 2 | 3 | 4 | 5 | 6 | 7 | 8

export interface BoardProps {
    dimension: Dimension
    data?: TileNumber[][]
}



export default function Board(props: BoardProps): JSX.Element {
    return <div id="game-board" className="bg-gray-400 shadow-inner p-2 gap-2">
        {props.data?.map((row: TileNumber[], index: number) =>
            <div key={`BoardRow-${index}`} className="bg-transparent flex gap-2 py-1">
                {row.map((value: TileNumber, index: number) =>
                    <Tile key={`Tile-${index}`} value={value} />)
                }
            </div>
        )}
    </div>

}
