import React from "react";

interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = "md", className = "" }) => {
  const sizeConfig = {
    xs: {
      width: 20,
      height: 21,
      circleRadius: 8.5,
      strokeWidth: 3,
      viewBox: "0 0 20 21",
    },
    sm: {
      width: 28,
      height: 29,
      circleRadius: 12,
      strokeWidth: 4,
      viewBox: "0 0 28 29",
    },
    md: {
      width: 36,
      height: 37,
      circleRadius: 16,
      strokeWidth: 4,
      viewBox: "0 0 36 37",
    },
    lg: {
      width: 40,
      height: 41,
      circleRadius: 18,
      strokeWidth: 4,
      viewBox: "0 0 40 41",
    },
    xl: {
      width: 48,
      height: 49,
      circleRadius: 22,
      strokeWidth: 4,
      viewBox: "0 0 48 49",
    },
  };

  const { width, height, circleRadius, strokeWidth, viewBox } =
    sizeConfig[size];

  // Dynamically calculate cx, cy, and path based on size
  const cx = width / 2;
  const cy = height / 2;
  const pathScale = width / 20; // Scale path relative to xs size (20x21 base)
  const basePath = [
    `M${18.5172 * pathScale} ${cy}`,
    `C${19.3361 * pathScale} ${cy} ${20.0113 * pathScale} ${cy - 0.66748 * pathScale} ${19.8903 * pathScale} ${cy - 1.47743 * pathScale}`,
    `C${19.6474 * pathScale} ${cy - 3.10308 * pathScale} ${19.0062 * pathScale} ${cy - 4.65188 * pathScale} ${18.014 * pathScale} ${cy - 5.98132 * pathScale}`,
    `C${16.7246 * pathScale} ${cy - 7.70891 * pathScale} ${14.9114 * pathScale} ${cy - 8.97358 * pathScale} ${12.8448 * pathScale} ${cy - 9.58683 * pathScale}`,
    `C${10.7781 * pathScale} ${cy - 10.2001 * pathScale} ${8.5686 * pathScale} ${cy - 10.1291 * pathScale} ${6.54558 * pathScale} ${cy - 9.3844 * pathScale}`,
    `C${4.9888 * pathScale} ${cy - 8.81135 * pathScale} ${3.60659 * pathScale} ${cy - 7.86296 * pathScale} ${2.51635 * pathScale} ${cy - 6.63289 * pathScale}`,
    `C${1.97316 * pathScale} ${cy - 6.02003 * pathScale} ${2.17495 * pathScale} ${cy - 5.09233 * pathScale} ${2.86134 * pathScale} ${cy - 4.64564 * pathScale}`,
    `C${3.54773 * pathScale} ${cy - 4.19896 * pathScale} ${4.45707 * pathScale} ${cy - 4.40786 * pathScale} ${5.03749 * pathScale} ${cy - 4.98558 * pathScale}`,
    `C${5.75143 * pathScale} ${cy - 5.6962 * pathScale} ${6.61392 * pathScale} ${cy - 6.2494 * pathScale} ${7.57003 * pathScale} ${cy - 6.60134 * pathScale}`,
    `C${8.9931 * pathScale} ${cy - 7.12518 * pathScale} ${10.5473 * pathScale} ${cy - 7.17512 * pathScale} ${12.0011 * pathScale} ${cy - 6.74374 * pathScale}`,
    `C${13.4549 * pathScale} ${cy - 6.31236 * pathScale} ${14.7303 * pathScale} ${cy - 5.42274 * pathScale} ${15.6373 * pathScale} ${cy - 4.20749 * pathScale}`,
    `C${16.2467 * pathScale} ${cy - 3.391 * pathScale} ${16.6679 * pathScale} ${cy - 2.4569 * pathScale} ${16.8787 * pathScale} ${cy - 1.47189 * pathScale}`,
    `C${17.05 * pathScale} ${cy - 0.67108 * pathScale} ${17.6983 * pathScale} ${cy} ${18.5172 * pathScale} ${cy}Z`,
  ].join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-spin ${className}`}
    >
      <circle
        cx={cx}
        cy={cy}
        r={circleRadius}
        stroke="#E5E7EB"
        strokeWidth={strokeWidth}
      />
      <mask id={`path-2-inside-1_${width}_${height}`} fill="white">
        <path d={basePath} />
      </mask>
      <path
        d={basePath}
        stroke="oklch(82.8% 0.189 84.429)"
        strokeWidth={8}
        mask={`url(#path-2-inside-1_${width}_${height})`}
      />
    </svg>
  );
};

export default Spinner;
