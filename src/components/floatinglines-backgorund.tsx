"use client";

import FloatingLines from "./floatinglines";

export function FloatingLinesBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <FloatingLines
        enabledWaves={["top", "middle", "bottom"]}
        lineCount={[5, 5, 5]}
        lineDistance={[8, 6, 4]}
        bendRadius={5.0}
        bendStrength={-0.5}
        interactive={true}
        parallax={true}
      />
    </div>
  );
}
