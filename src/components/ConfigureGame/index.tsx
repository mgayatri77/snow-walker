import React, { useState } from "react";
import { Alert, Snackbar, TextField, Button, Paper, Grid, MenuItem } from '@mui/material';

export enum PlayerType {
    human,
    RandomAI,
}

export type PlayerConfig = {
    type?: PlayerType | string;
    name?: string;
}

export type GridConfig = {
    x: number;
    y: number;
}

export type GameConfig = {
    grid: GridConfig;
    numPlows: number;
    maxRoads: number;
    player1: PlayerConfig;
    player2: PlayerConfig;
}

type ConfigureGameProps = {
    onSubmit: (config: GameConfig) => void
};

export const ConfigureGame = ({onSubmit}: ConfigureGameProps) => {
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const [numPlows, setNumPlows] = useState(0);
    const [maxRoads, setMaxRoads] = useState(0);
    const [player1, setPlayer1] = useState<PlayerConfig>({name: '', type: PlayerType.human});
    const [player2, setPlayer2] = useState<PlayerConfig>({name: '', type: PlayerType.human});
    const [alert, setAlert] = useState({ text: '', hasAlert: false });

    return (
        <div style={{width: "100vw", height: "100vh", display: "flex", flexGrow: "1", alignItems: "center", justifyContent: "center"}}>
            <Paper elevation={4} >
                <Grid item xs={12}>
                    <Snackbar open={alert.hasAlert} autoHideDuration={6000} onClose={() =>{}}>
                        <Alert variant="filled" severity="error" style={{width: "100%"}}>
                            {alert.text}
                        </Alert>
                    </Snackbar>
                </Grid>
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
                            id="config-num-plows"
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
                        <TextField
                            id="config-max-roads"
                            label="Maximun roads that can be plowed"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={maxRoads}
                            onChange={(event) => {setMaxRoads(Number(event.target.value))}}
                            style={{width: "100%"}}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="config-player-1-type"
                            select
                            label="Player 1 Type"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={player1.type}
                            onChange={(event) => {
                                if (event.target.value !== 'human')
                                    setPlayer1({name: 'AI', type: event.target.value});
                                else
                                    setPlayer1({...player1, type: event.target.value})}}
                            style={{width: "100%"}}
                        >
                            {
                                Object.keys(PlayerType).filter(pType => !(Number(pType) >= 0)).map(pType=> (
                                    <MenuItem key={`config-player-1-type-${pType}`} value={PlayerType[pType as keyof typeof PlayerType]}>{pType}</MenuItem>
                                ))
                            }
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="config-player-1-name"
                            label="Player 1 Name"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={player1.type !== PlayerType.human}
                            variant="outlined"
                            value={player1.name}
                            onChange={(event) => {setPlayer1({...player1, name: event.target.value})}}
                            style={{width: "100%"}}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="config-player-2-type"
                            select
                            label="Player 2 Type"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={player2.type}
                            onChange={(event) => {
                                if (event.target.value !== 'human')
                                    setPlayer2({name: 'AI', type: event.target.value});
                                else
                                    setPlayer2({...player2, type: event.target.value})}}
                            style={{width: "100%"}}
                        >
                            {
                                Object.keys(PlayerType).filter(pType => !(Number(pType) >= 0)).map(pType=> (
                                    <MenuItem key={`config-player-2-type-${pType}`} value={PlayerType[pType as keyof typeof PlayerType]}>{pType}</MenuItem>
                                ))
                            }
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="config-player-2-name"
                            label="Player 2 Name"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={player2.type !== PlayerType.human}
                            variant="outlined"
                            value={player2.name}
                            onChange={(event) => {setPlayer2({...player2, name: event.target.value})}}
                            style={{width: "100%"}}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                if (gridX < 2 || gridY < 2) {
                                    setAlert({hasAlert: true, text: "Grid Size X and Y must be at least 2"});
                                } else if (numPlows < 1) {
                                    setAlert({hasAlert: true, text: "Number of Plows must be at least 1"});
                                } else if (maxRoads < 1) {
                                    setAlert({hasAlert: true, text: "Maximum number of roads must be at least 1"});
                                } else {
                                    onSubmit(
                                        {grid: {x: gridX, y: gridY}, numPlows, maxRoads, player1, player2}
                                    )
                                }
                            }}
                            style={{width: "100%"}}
                        >
                            Play
                        </Button>
                    </Grid>
                    <Snackbar open={alert.hasAlert} autoHideDuration={6000} onClose={() =>{}}>
                            <Alert variant="filled" severity="error" style={{width: "100%"}}>
                                {alert.text}
                            </Alert>
                    </Snackbar>
                </Grid>
            </Paper>
        </div>
    )
}