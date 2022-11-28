import React, { useState } from "react";

import { Grid } from "../components/Grid";
import { ConfigureGame, GameConfig } from "../components/ConfigureGame"

enum Stage {
    Config = 1,
    Player1,
    Player2,
    Score
}



export const MainPage = () => {
    const [currentStage, setCurrentStage] = useState(Stage.Config);
    const [gameConfig, setGameConfig] = useState<GameConfig>({
        gridX: 0,
        gridY: 0,
        numPlows: 0
    });

    switch (currentStage) {
        case Stage.Config:
            return (
                <ConfigureGame onSubmit={(config: GameConfig) => {
                    setCurrentStage(Stage.Player1)
                    setGameConfig(config)
                }}/>
            );
        case Stage.Player1:
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
                        <Grid x={gameConfig.gridX} y={gameConfig.gridY} numPlows={gameConfig.numPlows}/>
                    </div>
                </div>
            );
        case Stage.Player2:
            break;
        case Stage.Score:
            break;
    }

    return <div/>
}