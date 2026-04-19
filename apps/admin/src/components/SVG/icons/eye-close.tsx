import React from 'react';

import SVG, { type ISVG } from '..';

const EyeClose = ({ color, ...rest }: ISVG) => {
  return (
    <SVG viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" {...rest}>
      <g id="icon/eye_closed">
        <path
          id="Icon"
          d="M20.3999 19.5L5.3999 4.5M20.4387 14.3217C21.2649 13.0848 21.5999 12.0761 21.5999 12.0761C21.5999 12.0761 19.4153 5.1 11.9999 5.1C11.5836 5.1 11.1838 5.12199 10.7999 5.16349M17.3999 17.3494C16.0225 18.2281 14.2492 18.8495 11.9999 18.8127C4.67683 18.693 2.3999 12.0761 2.3999 12.0761C2.3999 12.0761 3.45776 8.69808 6.5999 6.64332"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          id="Icon_2"
          d="M9.75138 10C9.28375 10.5305 9 11.2274 9 11.9906C9 13.6526 10.3456 15 12.0055 15C12.7709 15 13.4694 14.7136 14 14.2419"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    </SVG>
  );
};

export default EyeClose;
