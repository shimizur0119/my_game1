import type { NextPage } from 'next'
import { defaultRowConfig, defaultMapConfig, blockMapItems } from "@/constants/config"
import { memo, useState, useEffect, useCallback, useRef } from 'react'
import { animateScroll } from 'react-scroll';
interface Cell {
  x: number;
  y: number;
  name: string;
};

interface Player {
  position: {
    x: number;
    y: number;
  }
  isPlayer: string;
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

const ViewContainerBgElementMemo = memo(function ViewContainerBgElement() {
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

const Player = ({ isPlayer, position }: Player) => {
  useEffect(() => {
    // console.log("useEffect")
    // console.log(document.getElementById("player")?.offsetTop, window.innerHeight)
  }, [position])
  return (
    <div id="player" className={`u-player ${isPlayer}`} style={{ top: `calc(((100vw / 24) * (1 + ${position.y} * 2)) / 2)`, left: `calc(((100vw / 24) * (1 + ${position.x} * 2)) / 2)` }}></div>
  )
}

const Home: NextPage = () => {
  const [position, setPosition] = useState({ x: 12, y: 2 })
  const [isPlayer, setIsPlayer] = useState("is-front")
  const keydownFunction = useCallback((event: KeyboardEvent) => {
    const scrollCheck = ({ x, y }: typeof position) => {
      const next = document.querySelector(`.viewContainer__bgElement--cell[data-x="${x}"][data-y="${y}"]`)
      const nextTop = next?.getBoundingClientRect().y
      const elHeight = window.innerWidth / 24
      const windowHeight = window.innerHeight
      const downResult = nextTop && nextTop + elHeight > windowHeight
      const upResult = nextTop && nextTop < 0
      if (downResult) {
        animateScroll.scrollMore(elHeight, { duration: 300 })
      }
      if (upResult) {
        animateScroll.scrollMore(-elHeight, { duration: 300 })
      }
      return
    }
    const nextStepCheck = ({ x, y }: typeof position) => {
      const next = defaultMapConfig[y][x]
      const result = blockMapItems.includes(next)
      return result
    }
    if (event.key === "ArrowUp") {
      setIsPlayer((prev) => "is-back")
      setPosition((prev) => {
        const nextPosition = { x: prev.x, y: prev.y - 1 }
        scrollCheck(nextPosition)
        const stop = nextStepCheck(nextPosition)
        if (prev.y === 0 || stop) return prev
        return nextPosition
      })
    } else if (event.key === "ArrowRight") {
      setIsPlayer((prev) => "is-right")
      setPosition((prev) => {
        const nextPosition = { x: prev.x + 1, y: prev.y }
        const stop = nextStepCheck(nextPosition)
        if (prev.x === defaultRowConfig.length - 1 || stop) return prev
        return nextPosition
      })
    } else if (event.key === "ArrowLeft") {
      setIsPlayer((prev) => "is-left")
      setPosition((prev) => {
        const nextPosition = { x: prev.x - 1, y: prev.y }
        scrollCheck(nextPosition)
        const stop = nextStepCheck(nextPosition)
        if (prev.x === 0 || stop) return prev
        return nextPosition
      })
    } else if (event.key === "ArrowDown") {
      setIsPlayer((prev) => "is-front")
      setPosition((prev) => {
        const nextPosition = { x: prev.x, y: prev.y + 1 }
        const stop = nextStepCheck(nextPosition)
        if (prev.y === defaultMapConfig.length - 1 || stop) return prev
        scrollCheck(nextPosition)
        return nextPosition
      })
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", keydownFunction, false);
  }, [keydownFunction]);
  return (
    <>
      <div className="viewContainer">
        <div className="viewContainer__onElement">
          <div>Welcome!!</div>
        </div>
        <div className="viewContainer__playerElement">
          <Player isPlayer={isPlayer} position={position} />
          {/* <div className={`u-player ${isPlayer}`} style={{ top: `calc(((100vw / 24) * (1 + ${position.y} * 2)) / 2)`, left: `calc(((100vw / 24) * (1 + ${position.x} * 2)) / 2)` }}></div> */}
        </div>
        <ViewContainerBgElementMemo />
      </div>
    </>

  )
}

export default Home
