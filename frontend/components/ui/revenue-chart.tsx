"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type RevenuePoint = {
  date: string;
  revenue: number;
};

interface RevenueChartProps {
  data: RevenuePoint[];
}

export default function RevenueChart({
  data,
}: RevenueChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
      }
    ),
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: 5,
            bottom: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) =>
              `₹${Number(value).toLocaleString("en-IN")}`
            }
          />

          <Tooltip
            formatter={(value) => [
              `₹${Number(value).toLocaleString("en-IN")}`,
              "Revenue",
            ]}
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              boxShadow:
                "0 4px 12px rgba(0,0,0,0.08)",
            }}
          />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#16a34a"
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 5,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}