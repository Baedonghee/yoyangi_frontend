import React from 'react';

import SVG, { type ISVG } from '..';

const Plus = ({ color, ...rest }: ISVG) => {
  return (
    <SVG viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" {...rest}>
      <path
        d="M18.96 5.04C22.8 8.892 22.8 15.108 18.96 18.96C17.1129 20.8037 14.6098 21.8392 12 21.8392C9.39023 21.8392 6.88709 20.8037 5.04 18.96C3.19631 17.1129 2.16083 14.6098 2.16083 12C2.16083 9.39023 3.19631 6.88708 5.04 5.04C8.892 1.2 15.108 1.2 18.96 5.04ZM13.8 18.6V13.8H18.6V10.2H13.8V5.4H10.2V10.2H5.4V13.8H10.2V18.6H13.8Z"
        fill="black"
      />
    </SVG>
  );
};

export default Plus;
