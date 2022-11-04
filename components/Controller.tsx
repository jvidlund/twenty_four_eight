import { BsFillArrowDownSquareFill, BsFillArrowLeftSquareFill, BsFillArrowRightSquareFill, BsFillArrowUpSquareFill } from "react-icons/bs"
import { Direction } from "./Game"


export interface ControllerProps {
    onMove: (direction: Direction) => void
}
export default function Controller(props: ControllerProps) {

    return <div id="controllerLayout" className="mx-6 align-middle text-4xl my-auto flex-col shadow-inner p-4" >
        <div className="flex mb-2">
            <ControllerArrow className="mx-auto " direction="up" onMove={props.onMove} />
        </div>
        <div >
            <ControllerArrow direction="left" onMove={props.onMove} />
            <ControllerArrow className="mx-2" direction="down" onMove={props.onMove} />
            <ControllerArrow direction="right" onMove={props.onMove} />
        </div>
    </div>
}




interface ControllerArrowProps {
    onMove: (direction: Direction) => void
    direction: Direction
    className?: string

}

function ControllerArrow(props: ControllerArrowProps) {
    return <button className={`shadow-lg hover:text-gray-500 ${props.className} `} onClick={() => props.onMove(props.direction)}>
        {props.direction === 'up' && <BsFillArrowUpSquareFill />}
        {props.direction === 'down' && <BsFillArrowDownSquareFill />}
        {props.direction === 'right' && <BsFillArrowRightSquareFill />}
        {props.direction === 'left' && <BsFillArrowLeftSquareFill />}
    </button>
}