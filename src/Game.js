import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

const Game = forwardRef(({ emoji, images }, ref) => {
  const [counter, setCounter] = useState(0);  // Counter state local to Game
  const [paused, setPaused] = useState(false);  // State to track if the game is paused
  const characterRef = useRef(null);
  const blockRef = useRef(null);
  const scoreContainerRef = useRef(null);
  const blockMoveIntervalRef = useRef(null); // Track block movement interval

  useImperativeHandle(ref, () => ({
    animateUp: () => {
        characterRef.current.style.animation = 'moveUp 1s linear forwards';
    },
    animateDown: () => {
        characterRef.current.style.animation = 'moveDown 1s linear forwards';
    }
  }));

  function getRandomDuration() {
    return (10 + Math.random() * 20) + 's'; // Random duration between 10s and 20s
  }

  // This useEffect is used for block movement
  useEffect(() => {
    blockRef.current.addEventListener('animationiteration', () => {
      blockRef.current.style.animation = 'none'; // Remove the animation
      void blockRef.current.offsetWidth; // Trigger reflow to reset animation state
      blockRef.current.style.animation = getRandomDuration() + ' linear infinite block'; // Reapply the animation
    });

    const moveBlock = (setCounter) => {
      if (paused || !blockRef.current) return; // Do not move the block if paused

      // Get the current position of the block
      const characterTop = parseInt(window.getComputedStyle(characterRef.current).getPropertyValue("top"));
      const currentLeft = parseInt(window.getComputedStyle(blockRef.current).getPropertyValue("left"));

      // if (currentLeft > -50) {
      //   blockRef.current.style.left = `${currentLeft - 5}px`;  // Move block left
      // } else {
      //   // Reset block position if it moves off the screen
      //   blockRef.current.style.left = "1700px";
      // }

      // Debug
      //console.log("Obstacle left position:", currentLeft); 
      //console.log("Character top position:", characterTop);

      // collision detection
      if (currentLeft < 120 && currentLeft > 40 && characterTop >= 130) { // Check for collision ONLY when block is in range
        setCounter(0);
      } else if (currentLeft < 120 && characterTop < 130 ) {
        setCounter(counter + 1);
      }
    };

    // Controls animation pause
    if (paused) {
      blockRef.current.style.animationPlayState = 'paused';
    }
    else {
      blockRef.current.style.animationPlayState = 'running';
    }

    let checkDead;
    checkDead = setInterval(() => {
      moveBlock(setCounter);
    }, 1);
  }, [paused]); // Pause state is a dependency

  // Pause button toggle
  const togglePause = () => {
    setPaused(prevPaused => !prevPaused);
    console.log("Toggled Pause, current paused state:", !paused);
  };

  return (
    <div id="game" style={{ position: "relative" }}>
      <div ref={characterRef} id="character">
        <img src="duck-emoji.png" alt="Duck Emoji" />
      </div>
      <div ref={blockRef} id="block-container">
        <img src="wood.png" alt="Block" />
      </div>
      {/* <div id="marker1"></div>
      <div id="marker2"></div> */}
      <div ref={scoreContainerRef} id="score-container" style={{ position: 'absolute', top: '10px', left: '10px', color: 'black' }}>
        <p>{`Score: ${counter}`}</p>
      </div>
      {emoji && (
        <img
          src={images[emoji]}
          alt={emoji}
          style={{ position: "absolute", top: "10px", right: "10px", width: "100px" }}
        />
      )}
      <button
        id="pauseButton"
        onClick={togglePause}
        style={{     position: "absolute",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "inline-block",
        outline: "0",
        cursor: "pointer",
        padding: "5px 16px",
        fontSize: "14px",
        fontWeight: "500",
        lineHeight: "20px",
        verticalAlign: "middle",
        border: "1px solid",
        borderRadius: "6px",
        color: "#ffffff",
        backgroundColor: "#2ea44f",
        borderColor: "#1b1f2326",
        boxShadow: "rgba(27, 31, 35, 0.04) 0px 1px 0px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset",
        transition: "0.2s cubic-bezier(0.3, 0, 0.5, 1)",
        transitionProperty: "color, background-color, border-color" }}
      >
        {paused ? "Resume" : "Pause"}
      </button>
    </div>
  );
});

export default Game;
