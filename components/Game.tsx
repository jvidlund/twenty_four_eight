import { useState, useEffect } from "react";
import Board, { Dimension } from "./Board";
import { TileNumber } from "./Tile";
import {
  getBlanks,
  pickRandomCoordinate,
  dataEquals,
  isGameOver,
  isEmpty,
  getRandomNumber,
} from "@utils/GameDataUtils";
import GameOverModal from "./GameOverModal";
import Controller from "./Controller";
import { MdOutlineRestartAlt } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";

export type GameData = TileNumber[][];

export type Direction = "up" | "down" | "left" | "right";

export type Coordinate = [number, number]; // [row, column]

export interface GameProps {
  dimension: Dimension;
}

const testData: Record<number, GameData> = {
  2: [
    [2, 2],
    [2, 2],
  ],
  3: [
    [2, 2, 2],
    [2, 2, 4],
    [8, 8, 8],
  ],
  4: [
    [4, 2, 4, 2],
    [4, 8, 2, 4],
    [8, 4, 8, 8],
    [16, 2, 4, 8],
  ],
};

const newData = (dimension: Dimension) => {
  return Array.from({ length: dimension }, (_, __) =>
    Array.from({ length: dimension }, (_, __) => undefined as TileNumber)
  );
};

export default function Game(props: GameProps): JSX.Element {
  const [data, setData] = useState(newData(props.dimension)); //useState(testData[props.dimension])
  const [checkGameOver, setCheckGameOver] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [keyPressed, setKeyPressed] = useState<string | undefined>(undefined);
  const [restart, setRestart] = useState(true);
  const [emptyBoard, setEmptyBoard] = useState(false);

  useEffect(() => {
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (!e.repeat && !keyPressed) {
        setKeyPressed(e.key);
      } else if (e.repeat) {
        setKeyPressed(undefined);
      }
    });

    document.addEventListener("keyup", (e: KeyboardEvent) => {
      setKeyPressed(undefined);
    });
  }, []);

  useEffect(() => {
    if (keyPressed) {
      switch (keyPressed) {
        case "ArrowUp":
          move("up");
          break;
        case "ArrowDown":
          move("down");
          break;
        case "ArrowLeft":
          move("left");
          break;
        case "ArrowRight":
          move("right");
          break;
        default:
          break;
      }
      setKeyPressed(undefined);
    }
  }, [keyPressed]);

  useEffect(() => {
    if (checkGameOver) {
      checkIfGameIsOver();
      setCheckGameOver(false);
    }
  }, [checkGameOver]);

  useEffect(() => {
    if (restart) {
      setData(newData(props.dimension));
      setScore(0);
      setEmptyBoard(true);
      setRestart(false);
    }
  }, [restart]);

  useEffect(() => {
    if (emptyBoard) {
      let newData = structuredClone(data);
      placeRandomTile(newData);
      placeRandomTile(newData);
      setData(newData);
      setEmptyBoard(false);
    }
  }, [emptyBoard]);

  const checkIfGameIsOver = () => {
    if (isGameOver(data)) {
      setGameOver(true);
    }
  };

  const placeRandomTile = (newData: GameData, number?: TileNumber) => {
    const blanks = getBlanks(newData);
    const nBlanks = blanks.length;
    const tilePlacement = pickRandomCoordinate(blanks);
    newData[tilePlacement[0]][tilePlacement[1]] = number
      ? number
      : getRandomNumber(score);
    if (nBlanks === 1) {
      setCheckGameOver(true);
    }
  };

  /* Handle move in any direciton */
  const move = (direction: Direction) => {
    let newData = structuredClone(data);
    let scoreChange = [0];
    switch (direction) {
      case "up":
        moveUp(newData, scoreChange);
        break;
      case "down":
        moveDown(newData, scoreChange);
        break;
      case "right":
        moveRight(newData, scoreChange);
        break;
      case "left":
        moveLeft(newData, scoreChange);
        break;
      default:
        break;
    }

    // Tried to check this with
    if (!dataEquals(newData, data)) {
      placeRandomTile(newData);
    }
    setScore(score + scoreChange[0]);
    setData(newData);
  };

  const squash = (
    coord: Coordinate,
    searchDirection: Direction,
    newData: GameData,
    scoreChange: number[]
  ) => {
    const nextValueCoord = findNextValue(coord, searchDirection, newData);
    if (nextValueCoord) {
      if (
        newData[coord[0]][coord[1]] &&
        newData[coord[0]][coord[1]] ===
          newData[nextValueCoord[0]][nextValueCoord[1]]
      ) {
        scoreChange[0] =
          scoreChange[0] + (newData[coord[0]][coord[1]] as number) * 2;
        newData[coord[0]][coord[1]] =
          (newData[coord[0]][coord[1]] as number) * 2;
        newData[nextValueCoord[0]][nextValueCoord[1]] = undefined;
      } else if (!newData[coord[0]][coord[1]]) {
        squash(
          nextValueCoord as Coordinate,
          searchDirection,
          newData,
          scoreChange
        );
        newData[coord[0]][coord[1]] =
          newData[nextValueCoord[0]][nextValueCoord[1]];
        newData[nextValueCoord[0]][nextValueCoord[1]] = undefined;
      }
    }
  };

  const findNextValue = (
    coord: Coordinate,
    searchDirection: Direction,
    newData: GameData
  ) => {
    const startRow = coord[0];
    const startCol = coord[1];
    if (searchDirection === "down") {
      for (let i = startRow + 1; i < props.dimension; i++) {
        if (newData[i][startCol]) {
          return [i, startCol];
        }
      }
    } else if (searchDirection === "up") {
      for (let i = startRow - 1; i >= 0; i--) {
        if (newData[i][startCol]) {
          return [i, startCol];
        }
      }
    } else if (searchDirection === "left") {
      for (let j = startCol - 1; j >= 0; j--) {
        if (newData[startRow][j]) {
          return [startRow, j];
        }
      }
    } else if (searchDirection === "right") {
      for (let j = startCol + 1; j < props.dimension; j++) {
        if (newData[startRow][j]) {
          return [startRow, j];
        }
      }
    }
  };

  /* Sum tiles with move up */
  const moveUp = (newData: GameData, scoreChange: number[]) => {
    for (let i = 0; i < props.dimension - 1; i++) {
      for (let j = 0; j < props.dimension; j++) {
        squash([i, j], "down", newData, scoreChange);
      }
    }
  };

  const moveDown = (newData: GameData, scoreChange: number[]) => {
    for (let i = props.dimension - 1; i > 0; i--) {
      for (let j = 0; j < props.dimension; j++) {
        squash([i, j], "up", newData, scoreChange);
      }
    }
  };

  const moveRight = (newData: GameData, scoreChange: number[]) => {
    for (let j = props.dimension - 1; j > 0; j--) {
      for (let i = 0; i < props.dimension; i++) {
        squash([i, j], "left", newData, scoreChange);
      }
    }
  };

  const moveLeft = (newData: GameData, scoreChange: number[]) => {
    for (let j = 0; j < props.dimension - 1; j++) {
      for (let i = 0; i < props.dimension; i++) {
        squash([i, j], "right", newData, scoreChange);
      }
    }
  };

  return (
    <div
      id="game-container"
      className={` bg-gray-200 shadow-2xl rounded-2xl flex w-1/3 mx-auto `}
    >
      <div id="game-component" className="flex mx-auto my-16">
        <Board data={data} dimension={props.dimension} key="Board" />
        <div id="game-component-rhs" className="flex flex-col">
          <div className="text-2xl rounded-md bg-yellow-700 my-4 mx-4 text-center">
            <h1>Score: {score}</h1>
          </div>
          <Controller onMove={move} />
          <div
            id="game-component-rhs-buttonBar"
            className=" flex text-2xl text-gray-600  bg-gray-300 mb-2 mx-3 p-2 mt-auto  shadow-sm rounded-sm gap-3"
          >
            <button
              id="game-component-settings-button"
              className="hover:text-black ml-auto"
              onClick={() => {}}
            >
              {" "}
              <IoMdSettings />
            </button>
            <button
              id="game-component-reset-button"
              className="hover:text-black"
              onClick={() => setRestart(true)}
            >
              {" "}
              <MdOutlineRestartAlt />
            </button>
          </div>
        </div>
      </div>

      <GameOverModal
        open={gameOver}
        close={() => setGameOver(false)}
        title={"GAME OVER"}
        content={<div>Would you like to play again? </div>}
        onOkClick={() => setData(newData(props.dimension))}
        onCancelClick={() => setGameOver(false)}
      />
    </div>
  );
}
