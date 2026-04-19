import React from 'react';

import SVG, { type ISVG } from '..';

const CalendarIcon = ({ color, ...rest }: ISVG) => {
  return (
    <SVG viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" {...rest}>
      <g id="icon/calendar">
        <path
          id="Vector"
          d="M13.0951 2.66675H3.7618C3.02542 2.66675 2.42847 3.2637 2.42847 4.00008V13.3334C2.42847 14.0698 3.02542 14.6667 3.7618 14.6667H13.0951C13.8315 14.6667 14.4285 14.0698 14.4285 13.3334V4.00008C14.4285 3.2637 13.8315 2.66675 13.0951 2.66675Z"
          stroke={color}
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path id="Vector_2" d="M11.0952 1.33325V3.99992" stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector_3" d="M5.76172 1.33325V3.99992" stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector_4" d="M2.42847 6.66675H14.4285" stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </SVG>
  );
};

export default CalendarIcon;
