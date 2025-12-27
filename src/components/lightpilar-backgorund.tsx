"use client";

import LightPillar from "./lightpilar";

export default function LightPillarBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <LightPillar
        topColor="#5227FF"
        bottomColor="#FF9FFC"
        intensity={0.5}
        rotationSpeed={0.3}
        glowAmount={0.005}
        pillarWidth={3.0}
        pillarHeight={0.4}
        noiseIntensity={0.5}
        pillarRotation={30}
        interactive={false}
        mixBlendMode="screen"
      />
    </div>
  );
}
