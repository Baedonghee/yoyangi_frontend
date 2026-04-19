import React from 'react';

import SVG, { type ISVG } from '..';

const Warning = ({ color, ...rest }: ISVG) => {
  return (
    <SVG
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM12 6.10712C12.4142 6.10712 12.75 6.4429 12.75 6.85712V13.7143C12.75 14.1285 12.4142 14.4643 12 14.4643C11.5858 14.4643 11.25 14.1285 11.25 13.7143V6.85712C11.25 6.4429 11.5858 6.10712 12 6.10712ZM11.25 18.8572C11.25 19.2714 11.5858 19.6072 12 19.6072H12.0164C12.4306 19.6072 12.7664 19.2714 12.7664 18.8572C12.7664 18.443 12.4306 18.1072 12.0164 18.1072H12C11.5858 18.1072 11.25 18.443 11.25 18.8572Z"
        fill={color}
      />
    </SVG>
  );
};

export default Warning;
