import React from 'react';

import SVG, { type ISVG } from '..';

const CheckboxCircleDisabled = ({ ...rest }: ISVG) => {
  return (
    <SVG
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...rest}
    >
      <g id="Type=r100, State=disabled">
        <rect x="1" y="1" width="24" height="24" rx="12" fill="#F1F1F1" />
        <rect x="1" y="1" width="24" height="24" rx="12" stroke="#D6D6D6" strokeWidth="1.5" />
      </g>
    </SVG>
  );
};

export default CheckboxCircleDisabled;
