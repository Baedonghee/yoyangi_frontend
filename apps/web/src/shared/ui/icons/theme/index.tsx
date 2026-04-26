export interface ISVG {
  width?: string;
  height?: string;
  color?: string;
  children?: any;
  [key: string]: any;
}

export default function SVG({
  width = "30",
  height = "30",
  color = "none",
  children,
  ...rest
}: ISVG) {
  return (
    <svg width={width} height={height} color={color} {...rest}>
      {children}
    </svg>
  );
}
