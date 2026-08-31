"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type StatusPoint = {
  status: string;
  count: number;
};

interface StatusChartProps {
  data: StatusPoint[];
}

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: "#16a34a",
  PENDING: "#f59e0b",
  CANCELLED: "#ef4444",
  ASSIGNED: "#3b82f6",
  MECHANIC_ON_THE_WAY: "#8b5cf6",
};

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

export default function StatusChart({
  data,
}: StatusChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    label: formatStatus(item.status),
  }));

  return (
    <div className="flex h-72 w-full items-center">
      <div className="h-64 flex-1">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={3}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={
                    STATUS_COLORS[
                      entry.status
                    ] ?? "#64748b"
                  }
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, _name, item) => [
                value,
                item?.payload?.label ?? "Bookings",
              ]}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                boxShadow:
                  "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="w-40 space-y-3">
        {chartData.map((item) => (
          <div
            key={item.status}
            className="flex items-center gap-2"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor:
                  STATUS_COLORS[
                    item.status
                  ] ?? "#64748b",
              }}
            />

            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-slate-700">
                {item.label}
              </p>

              <p className="text-xs text-slate-400">
                {item.count}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}