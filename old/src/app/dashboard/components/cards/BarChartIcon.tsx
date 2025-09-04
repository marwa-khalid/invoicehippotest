import React from "react";

interface BarChartIconProps {
  color?: string;
}

const BarChartIcon: React.FC<BarChartIconProps> = ({ color = "#67b7dc" }) => {
  return (
    <span className="svg-icon svg-icon-2x">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        version="1.1"
      >
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <rect x="0" y="0" width="24" height="24" />
          <rect
            fill={color}
            opacity="0.3"
            x="13"
            y="4"
            width="3"
            height="16"
            rx="1.5"
          />
          <rect fill={color} x="8" y="9" width="3" height="11" rx="1.5" />
          <rect fill={color} x="18" y="11" width="3" height="9" rx="1.5" />
          <rect fill={color} x="3" y="13" width="3" height="7" rx="1.5" />
        </g>
      </svg>
    </span>
  );
};

export default BarChartIcon;
