import React from "react";

export function SkeletonPulse({ width = "30ch", height = "1rem" }) {
  const style = { width, height };
  return (
    <div
      style={style}
      className="rounded-full text-transparent bg-gray-200 w-full animate-pulse"
    >
      &nbsp;
    </div>
  );
}
