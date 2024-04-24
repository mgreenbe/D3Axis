import { bin } from "d3-array";
import { scaleLinear } from "d3-scale";
import { data } from "./data.ts";
import { D3Axis } from "./D3Axis";

interface Bin extends Array<number> {
  x0: number;
  x1: number;
}

const width = 960;
const height = 500;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 60;

// Bin the data.
const bins = bin().thresholds(40)(data) as Bin[];

// Declare the x (horizontal position) scale.
const xmin = bins[0].x0;
const xmax = bins.at(-1)!.x1;
const x = scaleLinear()
  .domain([xmin, xmax])
  .range([marginLeft, width - marginRight]);

// Declare the y (vertical position) scale.
const ymax = Math.max(...bins.map((bin) => bin.length));
const y = scaleLinear()
  .domain([0, ymax])
  .range([height - marginBottom, marginTop]);

const xAxisOptions = {
  className: "x-axis",
  tickPadding: 10,
  fontSize: 20,
  transform: `translate(0, ${height - marginBottom})`,
};

const yAxisOptions = {
  class: "y-axis",
  tickPadding: 10,
  tickSize: 10,
  fontSize: 20,
  transform: `translate(${marginLeft}, 0)`,
};

export function Histogram() {
  return (
    <svg
      id="histogram"
      height="570"
      width="960"
      viewBox="0 0 960 570"
      style={{ maxWidth: "100%", height: "auto" }}
    >
      <g fill="steelblue">
        {bins.map((bin) => (
          <rect
            x={x(bin.x0) + 1}
            width={x(bin.x1) - x(bin.x0) - 1}
            y={y(bin.length)}
            height={y(0) - y(bin.length)}
            key={x(bin.x0)}
          ></rect>
        ))}
      </g>
      <D3Axis orient="bottom" scale={x} options={xAxisOptions}></D3Axis>
      <D3Axis orient="left" scale={y} options={yAxisOptions}></D3Axis>
    </svg>
  );
}

// export const histogram = svg`<g fill="steelblue">${rects}</g>${xAxis}${yAxis}`;

// export const axisLabel = svg`<text x=${width} y=${
//   marginBottom + 30
// } fill="currentColor" text-anchor="end">Unemployment rate (%)</text>`;
