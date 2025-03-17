// import { PropsWithChildren } from "react";
import './Tile.css'

interface TileProps {
    title: string;
    children: any;
}

export const Tile = ({ title, children }: TileProps) => {
    return (
        <div className="TileContainer">
            <h3 className="titleText">{title}</h3>
            <>
                {children}
            </>
        </div>
    )
}