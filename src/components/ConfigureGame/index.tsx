import React, { useState } from "react";
import { TextField, Button, Paper, Grid } from '@mui/material';

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
        <div style={{width: "100vw", height: "100vh", display: "flex", flexGrow: "1", alignItems: "center", justifyContent: "center"}}>
            <Paper elevation={4} >
                <Grid container spacing={2} style={{padding: "10%"}}>
                    <Grid item xs={6}>
                        <TextField
                            id="config-grid-x"
                            label="Grid Size X"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={gridX}
                            onChange={(event) => {setGridX(Number(event.target.value))}}
                            style={{width: "100%"}}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="config-grid-y"
                            label="Grid Size Y"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={gridY}
                            onChange={(event) => {setGridY(Number(event.target.value))}}
                            style={{width: "100%"}}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="congif-num-plows"
                            label="Number of Plows"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={numPlows}
                            onChange={(event) => {setNumPlows(Number(event.target.value))}}
                            style={{width: "100%"}}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="outlined"
                            onClick={() => {onSubmit(
                                {gridX, gridY, numPlows}
                            )}}
                            style={{width: "100%"}}
                        >
                            Play
                        </Button>
                    </Grid>
                </Grid>    
            </Paper>
        </div>
    )
}