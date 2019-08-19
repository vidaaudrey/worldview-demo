import { useAnimationFrame } from "@cruise-automation/hooks";
import { quat, vec3 } from "gl-matrix";
import React from "react";
import Worldview, {
  Axes,
  DEFAULT_CAMERA_STATE,
  Grid,
  Spheres
} from "regl-worldview";
import "./App.css";
import CarModel from "./CarModel";

// map a number/index to a specific color
function numberToColor(number, max, a = 1) {
  const i = (number * 255) / max;
  const r = Math.round(Math.sin(0.024 * i + 0) * 127 + 128) / 255;
  const g = Math.round(Math.sin(0.024 * i + 2) * 127 + 128) / 255;
  const b = Math.round(Math.sin(0.024 * i + 4) * 127 + 128) / 255;
  return { r, g, b, a };
}

function getOrientation(len) {
  // get the orientation for the object so its moving direction is always aligned with the knot
  const tangentVecO = [
    Math.cos(len) + 4 * Math.cos(2 * len),
    -Math.sin(len) + 4 * Math.sin(2 * len),
    -3 * Math.cos(3 * len)
  ];
  const tangentVec = vec3.normalize([0, 0, 0], tangentVecO);
  const yaw = quat.setAxisAngle(
    [0, 0, 0, 0],
    [0, 0, 1],
    Math.atan2(tangentVec[1], tangentVec[0])
  );
  const orientation = [0, 0, 0, 1];
  quat.multiply(orientation, orientation, yaw);
  quat.rotateY(
    orientation,
    orientation,
    -Math.atan(tangentVecO[2] / Math.hypot(tangentVecO[0], tangentVecO[1]))
  );
  return {
    x: orientation[0],
    y: orientation[1],
    z: orientation[2],
    w: orientation[3]
  };
}

function App() {
  const steps = 500;
  const [count, setCount] = React.useState(0);
  useAnimationFrame(
    () => {
      const newCount = (count + 1) % steps;
      setCount(newCount);
    },
    false,
    []
  );

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

  const carPosition = sphereMarker.points[count];
  const carOrientation = getOrientation(count * scale);

  return (
    <div className="App" style={{ width: "100vw", height: "100vh" }}>
      <Worldview
        cameraState={{
          ...DEFAULT_CAMERA_STATE,
          distance: 200,
          target: [carPosition.x, carPosition.y, carPosition.z],
          targetOrientation: [
            carOrientation.x,
            carOrientation.y,
            carOrientation.z,
            carOrientation.w
          ]
        }}
      >
        <Spheres>{[sphereMarker]}</Spheres>
        <CarModel>
          {{
            pose: {
              position: carPosition,
              orientation: carOrientation
            },
            scale: { x: 0.02, y: 0.02, z: 0.02 }
          }}
        </CarModel>
        <Grid />
        <Axes />
      </Worldview>
    </div>
  );
}

export default App;
