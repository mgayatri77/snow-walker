import React, { useState } from "react";

import { Node } from "../../model/Game"

type GridProps = {
    x: number;
    y: number;
    onRoadClick?: (from: Node, to: Node) => void;
    buildingStyle?: (node: Node) => object;
    intersectionStyle?: (node: Node) => object;
    roadStyle?: (from: Node, to: Node) => void;
};


export const Grid= ({x, y, onRoadClick, buildingStyle, roadStyle, intersectionStyle}: GridProps) => {
    const blockXPercent = Math.floor(100/x);
    const buildingXPercent = Math.floor(blockXPercent*0.95);
    const roadXPercent = blockXPercent - buildingXPercent;
    const blockYPercent = Math.floor(100/y);
    const buildingYPercent = Math.floor(blockYPercent*0.95);
    const roadYPercent = blockYPercent - buildingYPercent;

    const building = (x_idx: number, y_idx : number) => (
        <div 
            key={`building-${x_idx}-${y_idx}`} 
            onClick={() => {}} 
            style={{ ...(buildingStyle?.({x: x_idx, y: y_idx}) ?? {}) }}
        />
    );

    const verticalRoad = (x_idx: number, y_idx : number)  => (
        <div key={`vertical-road-${x_idx}-${y_idx}}`} 
            onClick={() => {
                onRoadClick?.({ x: y_idx - 1, y: x_idx  } , { x: y_idx, y: x_idx });
            }}
            style={{ ...(roadStyle?.( { x: y_idx - 1, y: x_idx  } , { x: y_idx, y: x_idx } ) ?? {}) }}
        />
    );

    const horizontalRoad = (x_idx: number, y_idx : number)  => (
        <div 
            key={`horizontal-road-${x_idx}-${y_idx}}`} 
            onClick={() => {
                onRoadClick?.({ x: y_idx , y: x_idx -1  } , { x: y_idx, y: x_idx });
            }} 
            style={{ ...(roadStyle?.( { x: y_idx , y: x_idx -1  } , { x: y_idx, y: x_idx } ) ?? {}) }}
        />
    );

    const intersection = (x_idx: number, y_idx: number) => (
        <div
            key={`intersection-${x_idx}-${y_idx}`} 
            style={{  ...(intersectionStyle?.( {x: y_idx, y: x_idx }) ?? {}) }}
        />
    );

    let grid : React.ReactNode[]  = []

    for (let i = 0; i < x; i++){
        let rowBuilding: React.ReactNode[] = []
        let rowRoad: React.ReactNode[] = []
        for (let j = 0; j < y; j++) {
            rowBuilding.push(building(i, j));
            rowRoad.push(verticalRoad(i + 1, j + 1))
            if (j !== y - 1) {
                rowBuilding.push(horizontalRoad(i + 1, j + 1));
                rowRoad.push(intersection(i + 1, j + 1))
            }
        }
        grid.push(( <div key={`grid-building-row-${i}`} style={{display: "inline-grid",  gridTemplateColumns: `repeat(${y}, ${buildingYPercent}% ${roadYPercent}%)`}}> {rowBuilding} </div> ))
        if (i !== x - 1) {
            grid.push(( <div key={`grid-road-row-${i}`} style={{display: "inline-grid", gridTemplateColumns: `repeat(${y}, ${buildingYPercent}% ${roadYPercent}%)`}}> {rowRoad} </div> ))
        }
    }

    return (
        <div 
            key="grid"
            style={{
                display: "grid",
                gridTemplateRows: `repeat(${x}, ${buildingXPercent}% ${roadXPercent}%)`,
                width: "25vw",
                height: "60vh",
                backgroundColor: "white",
                marginLeft: "auto",
                marginRight: "auto"
            }}
        >
            {grid}
        </div>               
    )
}