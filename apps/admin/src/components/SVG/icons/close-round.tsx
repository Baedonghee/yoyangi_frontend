import React from 'react';

import SVG, { type ISVG } from '..';

const CloseRound = ({ color, ...rest }: ISVG) => {
  return (
    <SVG
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...rest}
    >
      <g clipPath="url(#clip0_970_625)">
        <path
          d="M16 8L8 16M8 8L16 16"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="0.75"
          y="0.75"
          width="22.5"
          height="22.5"
          rx="11.25"
          stroke={color}
          strokeWidth="1.5"
        />
      </g>
      <defs>
        <clipPath id="clip0_970_625">
          <rect width="24" height="24" rx="12" fill="white" />
        </clipPath>
      </defs>
    </SVG>
  );
};

export default CloseRound;
