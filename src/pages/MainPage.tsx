import React, { useState } from "react";

import { PlayerInput } from "../components/PlayerInput";
import { ConfigureGame, GameConfig, PlayerType } from "../components/ConfigureGame"

import { Game } from "../model/Game";

enum Stage {
    Config = 1,
    Player1,
    Player2,
    Score
}

export const MainPage = () => {
    const [currentStage, setCurrentStage] = useState(Stage.Config);
    const [gameConfig, setGameConfig] = useState<GameConfig>({
        grid: {
            x: 0,
            y: 0,
        },
        numPlows: 0,
        player1: {},
        player2: {}
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
            if (gameConfig.player1.type !== PlayerType.human){
                setCurrentStage(Stage.Player2)
                // TODO: Call AI to make moves on the game
                break;
            }
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
                        <PlayerInput 
                            playerName={gameConfig.player1.name}
                            grid={gameConfig.grid}
                            numPlows={gameConfig.numPlows}
                            game={new Game(gameConfig.grid.x, gameConfig.grid.y, gameConfig.numPlows)}
                        />
                    </div>
                </div>
            );
        case Stage.Player2:
            if (gameConfig.player2.type !== PlayerType.human){
                setCurrentStage(Stage.Score)
                // TODO: Call AI to make moves on the game
                break;
            }
            break;
        case Stage.Score:
            break;
    }

    return <div/>
}