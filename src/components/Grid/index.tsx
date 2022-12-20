import React from "react";

import { Node } from "../../model/Game"

type GridProps = {
    x: number;
    y: number;
    onRoadClick?: (from: Node, to: Node) => void;
    renderBuilding?: (node: Node) => React.ReactNode;
    intersectionStyle?: (node: Node) => object;
    roadStyle?: (from: Node, to: Node) => void;
};


export const Grid= ({x, y, onRoadClick, renderBuilding, roadStyle, intersectionStyle}: GridProps) => {
    const blockXPercent = Math.floor(100/x);
    const buildingXPercent = Math.floor(blockXPercent*0.95);
    const roadXPercent = blockXPercent - buildingXPercent;
    const blockYPercent = Math.floor(100/y);
    const buildingYPercent = Math.floor(blockYPercent*0.95);
    const roadYPercent = blockYPercent - buildingYPercent;

    const verticalRoad = (x_idx: number, y_idx : number)  => (
        <div key={`vertical-road-${x_idx}-${y_idx}}`} 
            onClick={() => {
                onRoadClick?.({ x: x_idx - 1, y: y_idx} , { x: x_idx, y: y_idx });
            }}
            style={{ ...(roadStyle?.( { x: x_idx - 1, y: y_idx  } , { x: x_idx, y: y_idx } ) ?? {}) }}
        />
    );

    const horizontalRoad = (x_idx: number, y_idx : number)  => (
        <div 
            key={`horizontal-road-${x_idx}-${y_idx}}`} 
            onClick={() => {
                onRoadClick?.({ x: x_idx, y: y_idx - 1  } , { x: x_idx, y: y_idx });
            }} 
            style={{ ...(roadStyle?.( { x: x_idx , y: y_idx - 1 } , { x: x_idx, y: y_idx } ) ?? {}) }}
        />
    );

    const intersection = (x_idx: number, y_idx: number) => (
        <div
            key={`intersection-${x_idx}-${y_idx}`} 
            style={{  ...(intersectionStyle?.( {x: x_idx, y: y_idx }) ?? {}) }}
        />
    );

    let grid : React.ReactNode[]  = []

    for (let i = 0; i < y; i++){
        let rowBuilding: React.ReactNode[] = []
        let rowRoad: React.ReactNode[] = []
        for (let j = 0; j < x; j++) {
            rowBuilding.push(renderBuilding?.({x: j, y:i} ?? <div/>));
            rowRoad.push(verticalRoad(j + 1, i + 1))
            if (j !== x - 1) {
                rowBuilding.push(horizontalRoad(j + 1, i + 1));
                rowRoad.push(intersection(j + 1, i + 1))
            }
        }
        grid.push(( <div key={`grid-building-row-${i}`} style={{display: "inline-grid",  gridTemplateColumns: `repeat(${x}, ${buildingXPercent}% ${roadXPercent}%)`}}> {rowBuilding} </div> ))
        if (i !== y - 1) {
            grid.push(( <div key={`grid-road-row-${i}`} style={{display: "inline-grid", gridTemplateColumns: `repeat(${x}, ${buildingXPercent}% ${roadXPercent}%)`}}> {rowRoad} </div> ))
        }
    }

    return (
        <div 
            key="grid"
            style={{
                display: "grid",
                gridTemplateRows: `repeat(${y}, ${buildingYPercent}% ${roadYPercent}%)`,
                width: "100%",
                height: "60vh",
                backgroundColor: "white",
                // marginLeft: "auto",
                // marginRight: "auto"
            }}
        >
            {grid}
        </div>               
    )
}