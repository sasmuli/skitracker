"use client";

import { useState, useEffect } from "react";
import LightPillar from "./lightpilar";

export default function LightPillarBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  return (
    <div className="fixed inset-0 -z-10 w-screen h-screen">
      <LightPillar
        topColor="#5227FF"
        bottomColor="#FF9FFC"
        intensity={0.5}
        rotationSpeed={isMobile ? 0 : 0.3}
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
