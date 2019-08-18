import React from "react";
import Worldview, { Axes, Cubes, Grid } from "regl-worldview";
import "./App.css";

function App() {
  const OBJECT_COUNT = 100;
  const cubes = new Array(OBJECT_COUNT).fill().map((_, idx) => ({
    pose: {
      position: { x: idx, y: idx, z: idx },
      orientation: { x: 0, y: 0, z: 0, w: 1 }
    },
    scale: { x: 1 * Math.random(), y: 1, z: 1 },
    color: { r: Math.random(), g: Math.random(), b: Math.random(), a: 1 }
  }));

  return (
    <div className="App" style={{ width: "100vw", height: "100vh" }}>
      <Worldview>
        <Cubes>{cubes}</Cubes>
        <Grid />
        <Axes />
      </Worldview>
    </div>
  );
}

export default App;
