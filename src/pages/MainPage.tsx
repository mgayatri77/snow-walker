import React from "react";


import { Grid } from "../components/Grid";


export const MainPage = () => {

    return (
        <div  style={{
            height: "90vh",
            width: "90vw",
            display: "grid", 
            gridColumnStart: "1",
            gridColumnEnd: "span col4-start",
            gridRowStart: 2,
            gridRowEnd: "span 10",
        }} >
            <div>
                <Grid x={30} y={10} />
            </div>
        </div>
    );
}