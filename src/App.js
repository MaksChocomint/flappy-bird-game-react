import styled from "styled-components";
import { useEffect, useState } from "react";

const BIRD_SIZE = 20;
const GAME_WIDTH = 500;
const GAME_HEIGHT = 750;
const GRAVITY = 5;
const JUMP_HEIGHT = 100;
const OBSTACLE_WIDTH = 60;
const OBSTACLE_GAP = 200;

function App() {
  const [birdPosition, setBirdPosition] = useState(GAME_HEIGHT / 2);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [obstacleHeight, setObstacleHeight] = useState(200);
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH - OBSTACLE_WIDTH);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const bottomObstacleHeight = GAME_HEIGHT - OBSTACLE_GAP - obstacleHeight;

  useEffect(() => {
    let timeId;
    if (gameHasStarted && birdPosition < GAME_HEIGHT - BIRD_SIZE) {
      timeId = setInterval(() => {
        setBirdPosition((birdPosition) => birdPosition + GRAVITY);
      }, 24);
    }

    return () => {
      clearInterval(timeId);
    };
  }, [birdPosition, gameHasStarted]);

  useEffect(() => {
    let obstacleId;
    if (gameHasStarted && obstacleLeft >= -OBSTACLE_WIDTH) {
      obstacleId = setInterval(() => {
        setObstacleLeft((obstacleLeft) => obstacleLeft - 5);
      }, 24);

      return () => {
        clearInterval(obstacleId);
      };
    } else {
      setObstacleLeft(GAME_WIDTH - OBSTACLE_WIDTH);
      setObstacleHeight(
        Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP))
      );
      if (gameHasStarted) {
        setScore((score) => score + 1);
      }
    }
  }, [obstacleLeft, gameHasStarted]);

  useEffect(() => {
    const hasCollidedWithTopObstacle =
      birdPosition >= 0 && birdPosition < obstacleHeight;
    const hasCollidedWithBottomObstacle =
      birdPosition <= GAME_HEIGHT &&
      birdPosition >= GAME_HEIGHT - bottomObstacleHeight;

    if (
      obstacleLeft >= 0 &&
      obstacleLeft <= OBSTACLE_WIDTH &&
      (hasCollidedWithTopObstacle || hasCollidedWithBottomObstacle)
    ) {
      setGameHasStarted(false);
      if (score > bestScore) {
        setBestScore(score);
      }
      setScore(0);
    }
  }, [birdPosition, obstacleHeight, bottomObstacleHeight, obstacleLeft]);

  useEffect(() => {
    console.log(score);
  }, [score]);

  const handleClick = () => {
    let newBirdPosition = birdPosition - JUMP_HEIGHT;

    if (!gameHasStarted) {
      setGameHasStarted(true);
    }
    if (newBirdPosition < 0) {
      setBirdPosition(0);
    } else {
      setBirdPosition(newBirdPosition);
    }
  };

  return (
    <Div onClick={handleClick}>
      <GameBox width={GAME_WIDTH} height={GAME_HEIGHT}>
        <Obstacle
          top={0}
          width={OBSTACLE_WIDTH}
          height={obstacleHeight}
          left={obstacleLeft}
        />
        <Obstacle
          top={GAME_HEIGHT - obstacleHeight - bottomObstacleHeight}
          width={OBSTACLE_WIDTH}
          height={bottomObstacleHeight}
          left={obstacleLeft}
        />
        <Bird size={BIRD_SIZE} top={birdPosition} />
      </GameBox>
      <span>
        {score} <br /> BEST: {bestScore}
      </span>
    </Div>
  );
}

export default App;

const Bird = styled.div`
  position: absolute;
  background-color: yellow;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  top: ${(props) => props.top}px;
  border-radius: 50%;
  box-shadow: 5px 5px 10px 0px rgba(34, 60, 80, 0.2);
`;

const Div = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  & span {
    color: white;
    font-weight: bold;
    margin-top: 50px;
    font-size: 24px;
    position: absolute;
    text-align: center;
  }
`;

const GameBox = styled.div`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-color: lightblue;
  overflow: hidden;
  box-shadow: 5px 5px 10px 0px rgba(34, 60, 80, 0.2);
`;

const Obstacle = styled.div`
  position: relative;
  top: ${(props) => props.top}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  left: ${(props) => props.left}px;
  background-color: lightgreen;
`;
