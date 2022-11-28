import React, { useState } from "react";
import { TextField, Button } from '@mui/material';

export type GameConfig = {
    gridX: number;
    gridY: number;
    numPlows: number;
}

type ConfigureGameProps = {
    onSubmit: (config: GameConfig) => void
};

export const ConfigureGame = ({onSubmit}: ConfigureGameProps) => {
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const [numPlows, setNumPlows] = useState(0);

    return (
        <>
            <TextField
                id="config-grid-x"
                label="Grid Size X"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="filled"
                value={gridX}
                onChange={(event) => {setGridX(Number(event.target.value))}}
            />
            <TextField
                id="config-grid-y"
                label="Grid Size Y"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="filled"
                value={gridY}
                onChange={(event) => {setGridY(Number(event.target.value))}}
            />
            <TextField
                id="congif-num-plows"
                label="Number of Plows"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="filled"
                value={numPlows}
                onChange={(event) => {setNumPlows(Number(event.target.value))}}
            />

            <Button onClick={() => {onSubmit({
                gridX, gridY, numPlows
            })}}>Play
            </Button>
        </>
    )
}