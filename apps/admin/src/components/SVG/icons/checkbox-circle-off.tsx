import React from 'react';

import SVG, { type ISVG } from '..';

const CheckboxCircleOff = ({ color, ...rest }: ISVG) => {
  return (
    <SVG
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...rest}
    >
      <g id="Type=r100, State=off">
        <rect x="0.5" y="0.5" width="23" height="23" rx="11.5" fill="white" />
        <rect x="0.5" y="0.5" width="23" height="23" rx="11.5" stroke={color} />
      </g>
    </SVG>
  );
};

export default CheckboxCircleOff;
