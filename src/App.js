import React from "react";
import Worldview, { Text } from "regl-worldview";
import "./App.css";

function App() {
  return (
    <div className="App" style={{ width: "100vw", height: "100vh" }}>
      <Worldview>
        <Text>
          {[
            {
              text: "Welcome to Cruise!",
              pose: {
                position: { x: 0, y: 0, z: 0 },
                orientation: { x: 0, y: 0, z: 0, w: 1 }
              },
              color: { r: 0.92, g: 0.094, b: 0, a: 1 }
            }
          ]}
        </Text>
      </Worldview>
    </div>
  );
}

export default App;
