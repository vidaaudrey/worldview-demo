import React from "react";
import Worldview, { Axes, Grid, Spheres } from "regl-worldview";
import "./App.css";

function App() {
  const steps = 500;
  // map a number/index to a specific color
  function numberToColor(number, max, a = 1) {
    const i = (number * 255) / max;
    const r = Math.round(Math.sin(0.024 * i + 0) * 127 + 128) / 255;
    const g = Math.round(Math.sin(0.024 * i + 2) * 127 + 128) / 255;
    const b = Math.round(Math.sin(0.024 * i + 4) * 127 + 128) / 255;
    return { r, g, b, a };
  }

  const scale = (Math.PI * 2) / steps;

  const sphereMarker = {
    pose: {
      orientation: { x: 0, y: 0, z: 0, w: 1 },
      position: { x: 0, y: 0, z: 0 }
    },
    scale: { x: 1, y: 1, z: 1 },
    // leave colors and points empty so we can fill up later
    colors: [],
    points: []
  };

  new Array(steps)
    .fill()
    .map((_, idx) => [
      // generate x, y, z coordinates based on trefoil equation
      Math.sin(idx * scale) + 2 * Math.sin(2 * idx * scale),
      Math.cos(idx * scale) - 2 * Math.cos(2 * idx * scale),
      -Math.sin(3 * idx * scale)
    ])
    .forEach(([x, y, z], idx) => {
      // add individual point and color to the single sphere object
      sphereMarker.colors.push(numberToColor(idx, steps));
      sphereMarker.points.push({ x: x * 20, y: y * 20, z: z * 20 });
    });

  return (
    <div className="App" style={{ width: "100vw", height: "100vh" }}>
      <Worldview>
        <Spheres>{[sphereMarker]}</Spheres>
        <Grid />
        <Axes />
      </Worldview>
    </div>
  );
}

export default App;
