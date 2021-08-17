import type { NextPage } from 'next'
import { defaultRowConfig, defaultMapConfig, blockMapItems } from "@/constants/config"
import { memo, useState, useEffect, useCallback } from 'react'

interface Cell {
  x: number;
  y: number;
  name: string;
};

const Cell = ({ x, y, name }: Cell) => {
  let addClass = ""
  if (name === "~") {
    addClass = "is-block"
  } else if (name === "umi_1") {
    addClass = "is-umi"
  }

  return (
    <div className={`viewContainer__bgElement--cell ${addClass}`} style={{ backgroundImage: `url('/images/map/${name}.png')` }} data-x={x} data-y={y} ></div>
  )
}

const ViewContainerBgElement = memo(() => {
  return (
    <div className="viewContainer__bgElement">
      {defaultMapConfig.map((row, rowIndex) => (
        <div className="viewContainer__bgElement--row" key={`mapRow-${rowIndex}`}>
          {row.map((cell, colIndex) => {
            return (<Cell name={cell} x={colIndex} y={rowIndex} key={`mapCell-${colIndex}-${rowIndex}`} />)
          })}
        </div>
      ))}
    </div>
  )
})

const Home: NextPage = () => {
  const [position, setPosition] = useState({ x: 5, y: 1 })
  const [isPlayer, setIsPlayer] = useState("is-front")
  const nextStepCheck = ({ x, y }: typeof position) => {
    const next = defaultMapConfig[y][x]
    const result = blockMapItems.includes(next)
    console.log("next", next, result)
    return result
  }
  const keydownFunction = useCallback((event: KeyboardEvent) => {
    console.log("KeyCode", event.key);
    if (event.key === "ArrowUp") {
      setIsPlayer((prev) => "is-back")
      setPosition((prev) => {
        const stop = nextStepCheck({ x: prev.x, y: prev.y - 1 })
        if (prev.y === 0 || stop) return prev
        return { x: prev.x, y: prev.y - 1 }
      })
    } else if (event.key === "ArrowRight") {
      setIsPlayer((prev) => "is-right")
      setPosition((prev) => {
        const stop = nextStepCheck({ x: prev.x + 1, y: prev.y })
        if (prev.x === defaultRowConfig.length - 1 || stop) return prev
        return { x: prev.x + 1, y: prev.y }
      })
    } else if (event.key === "ArrowLeft") {
      setIsPlayer((prev) => "is-left")
      setPosition((prev) => {
        const stop = nextStepCheck({ x: prev.x - 1, y: prev.y })
        if (prev.x === 0 || stop) return prev
        return { x: prev.x - 1, y: prev.y }
      })
    } else if (event.key === "ArrowDown") {
      setIsPlayer((prev) => "is-front")
      setPosition((prev) => {
        const stop = nextStepCheck({ x: prev.x, y: prev.y + 1 })
        if (prev.y === defaultMapConfig.length - 1 || stop) return prev
        return { x: prev.x, y: prev.y + 1 }
      })
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", keydownFunction, false);
  }, []);
  return (
    <>
      <div className="viewContainer">
        <div className="viewContainer__onElement">
          <div>hello</div>
        </div>
        <div className="viewContainer__playerElement">
          <div className={`u-player ${isPlayer}`} style={{ top: `calc(((100vw / 24) * (1 + ${position.y} * 2)) / 2)`, left: `calc(((100vw / 24) * (1 + ${position.x} * 2)) / 2)` }}></div>
        </div>
        <ViewContainerBgElement />
      </div>
    </>

  )
}

export default Home
