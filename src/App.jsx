import React from "react";

import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const types = {
  colored: "colored",
  base: "base",
};

const chartsParams = {
  uv: {
    color: "#82ca9d",
  },
  pv: {
    color: "#8884d8",
  },
};
const charts = Object.keys(chartsParams);

// extremum
const extremum = {};

charts.forEach((chart) => {
  if (!extremum[chart]) {
    extremum[chart] = {};
  }
  extremum[chart].min = data.reduce(
    (acc, item) => (acc > item[chart] ? item[chart] : acc),
    Number.MAX_SAFE_INTEGER
  );
  extremum[chart].max = data.reduce(
    (acc, item) => (acc < item[chart] ? item[chart] : acc),
    Number.MIN_SAFE_INTEGER
  );
});
console.log("extremum", extremum);

// means for each chart
const means = {};
charts.forEach((chart) => {
  const total = data.reduce((acc, item) => (acc += item[chart]), 0);
  means[chart] = total / data.length;
});
console.log("means", means);

// standard deviation ** 2 sum for each chart
let standardDeviation_2 = {};
charts.forEach((chart) => {
  standardDeviation_2[chart] = 0;
});
data.forEach((d) => {
  charts.forEach((chart) => {
    standardDeviation_2[chart] += (d[chart] - means[chart]) ** 2;
  });
});

// standard deviation for each chart
const standardDeviation = {};
charts.forEach((chart) => {
  standardDeviation[chart] = Math.sqrt(
    standardDeviation_2[chart] / data.length
  );
});
standardDeviation_2 = null;
console.log("standardDeviation", standardDeviation);

// alters for each chart
let yZPlus1 = {};
let yZMinus1 = {};

charts.forEach((chart) => {
  yZPlus1[chart] = means[chart] + standardDeviation[chart];
  yZMinus1[chart] = means[chart] - standardDeviation[chart];
});

const alters = {};
charts.forEach((chart) => {
  if (!alters[chart]) {
    alters[chart] = [];
  }
  if (yZPlus1[chart] < extremum[chart].max)
    alters[chart].push({
      type: types.colored,
      percent: (extremum[chart].max - yZPlus1[chart]) / extremum[chart].max,
    });
});
yZPlus1 = yZMinus1 = null;
console.log("alters", alters);

export default function App() {
  return (
    <>
      <AreaChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <defs>
          {charts.map((chart) => (
            <React.Fragment key={chart}>
              <linearGradient
                id={`areaColor_${chart}`}
                key={`areaColor_${chart}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                {alters[chart].map((item) => {
                  return (
                    <React.Fragment key={item.percent}>
                      <stop
                        offset={item.percent}
                        stopColor="red"
                        stopOpacity={1}
                      />
                      <stop
                        offset={item.percent}
                        stopColor="white"
                        stopOpacity={0}
                      />
                    </React.Fragment>
                  );
                })}
              </linearGradient>
              <linearGradient
                id={`lineColor_${chart}`}
                key={`lineColor_${chart}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                {alters[chart].map((item) => {
                  return (
                    <React.Fragment key={item.percent}>
                      <stop
                        offset={Math.ceil(item.percent * 100 + 1) / 100}
                        stopColor="red"
                        stopOpacity={1}
                      />
                      <stop
                        offset={Math.ceil(item.percent * 100 + 1) / 100}
                        stopColor={chartsParams[chart].color}
                        stopOpacity={1}
                      />
                    </React.Fragment>
                  );
                })}
              </linearGradient>
            </React.Fragment>
          ))}
        </defs>
        {charts.map((chart) => (
          <Area
            key={chart}
            type="monotone"
            dataKey={chart}
            stroke={`url(#lineColor_${chart})`}
            fill={`url(#areaColor_${chart})`}
          />
        ))}
      </AreaChart>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="pv"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    </>
  );
}
