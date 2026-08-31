"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type CategoryPoint = {
  category: string;
  count: number;
};

interface CategoryChartProps {
  data: CategoryPoint[];
}

const CATEGORY_COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#0891b2",
  "#f97316",
  "#64748b",
];

export default function CategoryChart({
  data,
}: CategoryChartProps) {
  return (
    <div className="flex h-72 w-full items-center">
      <div className="h-64 flex-1">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.category}
                  fill={
                    CATEGORY_COLORS[
                      index % CATEGORY_COLORS.length
                    ]
                  }
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, _name, item) => [
                value,
                item?.payload?.category ?? "Services",
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
        {data.map((item, index) => (
          <div
            key={item.category}
            className="flex items-center gap-2"
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{
                backgroundColor:
                  CATEGORY_COLORS[
                    index % CATEGORY_COLORS.length
                  ],
              }}
            />

            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-slate-700">
                {item.category}
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