import { GameData, Coordinate } from '@components/Game'
import { TileNumber } from '@components/Tile'
export const pickRandomCoordinate: (coordinates: Coordinate[]) => Coordinate = (coordinates) => {
    const selectedIndex = Math.floor(Math.random() * (coordinates.length - 1))
    return coordinates[selectedIndex]
}

export const getBlanks: (data: GameData) => Coordinate[] = (data) => {
    const blanks: Coordinate[] = []

    data.map((row: TileNumber[], i: number) => {
        row.map((value: TileNumber, j: number) => {
            if (!value) blanks.push([i, j])
        })
    })

    return blanks
}


export const dataEquals: (data1: GameData, data2: GameData) => boolean = (data1, data2) => {

    for (let i = 0; i < data1.length; i++) {
        for (let j = 0; j < data1[i].length; j++) {
            if (data1[i][j] !== data2[i][j]) {
                return false
            }
        }
    }
    return true
}



/* If no tile is next to a equal tile -> GAME OVER */
export const isGameOver: (data: GameData) => boolean = (data) => {

    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (i < data.length - 1 && data[i][j] === data[i + 1][j] ||
                j < data[i].length - 1 && data[i][j] === data[i][j + 1]) {
                return false
            }
        }
    }
    return true
}


export const isEmpty: (data: GameData) => boolean = (data) => {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (data[i][j]) return false
        }
    }
    return true
}



/* Based on score the propability of getting 4 is increasing
    from 20% to 80% at 120k score
*/
export const getRandomNumber: (score: number) => TileNumber = (score) => {
    const fourPercentageInterval = [20, 80]
    const maxScore = 120000
    const random = Math.random() * 100


    const fourPercentage = Math.min(score / maxScore, 1) * (fourPercentageInterval[1] - fourPercentageInterval[0]) + fourPercentageInterval[0]

    if (random < fourPercentage) {
        return 4
    } else {
        return 2
    }
}