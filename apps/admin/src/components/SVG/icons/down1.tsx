import React from 'react';

import SVG, { type ISVG } from '..';

const Down1 = ({ color, ...rest }: ISVG) => {
  return (
    <SVG viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" {...rest}>
      <g id="icon_down">
        <path id="Vector 639" d="M7 10L12 15L17 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </SVG>
  );
};

export default Down1;
