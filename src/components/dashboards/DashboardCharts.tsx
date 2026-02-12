"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type ChartConfig = {
  charts?: Array<{
    type: string;
    title: string;
    data?: Array<Record<string, unknown>>;
  }>;
};

type Props = {
  config: ChartConfig | null;
};

export function DashboardCharts({ config }: Props) {
  const charts = config?.charts ?? [];

  if (charts.length === 0) {
    return (
      <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-8 text-center text-slate-500">
        No charts configured. Edit this dashboard to add visualizations.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {charts.map((chart, i) => (
        <div
          key={i}
          className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-6"
        >
          <h3 className="text-lg font-medium text-slate-100 mb-4">{chart.title}</h3>
          <div className="h-64">
            {chart.type === "line" && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chart.data ?? sampleLineData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#22d3ee"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
            {chart.type === "bar" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chart.data ?? sampleBarData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                    }}
                  />
                  <Bar dataKey="value" fill="#a78bfa" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
            {chart.type !== "line" && chart.type !== "bar" && (
              <div className="flex h-full items-center justify-center text-slate-500">
                Unknown chart type: {chart.type}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const sampleLineData = [
  { name: "Jan", value: 40 },
  { name: "Feb", value: 65 },
  { name: "Mar", value: 45 },
  { name: "Apr", value: 80 },
  { name: "May", value: 55 },
];

const sampleBarData = [
  { name: "A", value: 30 },
  { name: "B", value: 70 },
  { name: "C", value: 45 },
  { name: "D", value: 90 },
];
