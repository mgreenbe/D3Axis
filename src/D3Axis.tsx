import type { ScaleLinear } from "d3-scale";

type Options = {
  className?: string;
  tickPadding?: number;
  tickSize?: number;
  tickSizeOuter?: number;
  fill?: string;
  fontFamily?: string;
  fontSize?: number;
  textAnchor?: "start" | "middle" | "end";
  transform?: string;
  showPath?: boolean;
};

type Orient = "top" | "bottom" | "left" | "right";

interface Props {
  orient: Orient;
  scale: ScaleLinear<number, number>;
  options?: Options;
}

export function D3Axis({ orient, scale, options }: Props) {
  const fill = options?.fill ?? "none";
  const tickPadding = options?.tickPadding ?? 3;
  const tickSize = options?.tickSize ?? 6;
  const tickSizeOuter = options?.tickSize ?? 6;
  const fontFamily = options?.fontFamily ?? "sans-serif";
  const fontSize = options?.fontSize ?? 10;
  const textAnchor =
    options?.textAnchor ??
    (orient === "right" ? "start" : orient === "left" ? "end" : "middle");
  const offset =
    typeof window !== "undefined" && window.devicePixelRatio > 1 ? 0 : 0.5;
  const k = orient === "top" || orient === "left" ? -1 : 1;

  const values: number[] = scale.ticks.apply(scale);
  const spacing = Math.max(tickSize, 0) + tickPadding;
  const range = scale.range();
  const range0 = range[0] + offset;
  const range1 = range[range.length - 1] + offset;

  let d: string;
  if (orient === "left" || orient === "right") {
    d = tickSizeOuter
      ? `M${k * tickSizeOuter},${range0}H${offset}V${range1}H${
          k * tickSizeOuter
        }`
      : `M${offset},${range0}V${range1}`;
  } else {
    d = tickSizeOuter
      ? `M${range0},${k * tickSizeOuter}V${offset}H${range1}V${
          k * tickSizeOuter
        }`
      : `M${range0},${offset}H${range1}`;
  }
  const translate = (value: number) =>
    orient === "top" || orient === "bottom"
      ? `translate(${scale(value + offset)}, 0)`
      : `translate(0, ${scale(value + offset)})`;

  const LR = orient === "left" || orient === "right";

  const lineProps = {
    stroke: "currentColor",
    [LR ? "x2" : "y2"]: k * tickSize,
  };

  const textProps = {
    fill: "currentColor",
    [LR ? "x" : "y"]: k * spacing,
    dy: orient === "top" ? "0em" : orient === "bottom" ? "0.71em" : "0.32em",
  };
  return (
    <g
      fontFamily={fontFamily}
      fontSize={fontSize}
      textAnchor={textAnchor}
      fill={fill}
      transform={options?.transform}
      className={options?.className}
    >
      <path stroke="currentColor" d={d}></path>
      {values.map((value) => (
        <g
          className="tick"
          opacity={1}
          transform={translate(value)}
          key={scale(value)}
        >
          <line {...lineProps}></line>
          <text {...textProps}>{value}</text>
        </g>
      ))}
    </g>
  );
}
