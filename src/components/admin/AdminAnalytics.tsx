"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

type TopPost = {
  postId: string;
  title: string;
  slug: string;
  views?: number;
  comments?: number;
};

type SignupPoint = {
  date: string;
  count: number;
};

type AnalyticsData = {
  topPostsByViews: TopPost[];
  topPostsByComments: TopPost[];
  userSignupsOverTime: SignupPoint[];
  totalPageViews: number;
};

export function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/analytics/admin")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load analytics");
        return res.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-8 text-center text-slate-500">
        Loading analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-8 text-center text-red-400">
        {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-10">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-6">
          <p className="text-sm text-slate-500">Total page views</p>
          <p className="text-3xl font-bold text-slate-100 mt-1">{data.totalPageViews}</p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-6">
        <h2 className="text-lg font-medium text-slate-100 mb-4">Top posts by views</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.topPostsByViews}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis type="number" stroke="#71717a" />
              <YAxis
                type="category"
                dataKey="title"
                width={90}
                stroke="#71717a"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#27272a",
                  border: "1px solid #3f3f46",
                }}
                formatter={(value) => [Number(value ?? 0), "Views"]}
              />
              <Bar dataKey="views" fill="#71717a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {data.topPostsByViews.slice(0, 5).map((p) => (
            <Link
              key={p.postId}
              href={`/posts/${p.slug}`}
              className="block text-sm text-slate-400 hover:text-cyan-400"
            >
              {p.title} ({p.views} views)
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-6">
        <h2 className="text-lg font-medium text-slate-100 mb-4">Top posts by comments</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.topPostsByComments}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis type="number" stroke="#71717a" />
              <YAxis
                type="category"
                dataKey="title"
                width={90}
                stroke="#71717a"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#27272a",
                  border: "1px solid #3f3f46",
                }}
                formatter={(value) => [Number(value ?? 0), "Comments"]}
              />
              <Bar dataKey="comments" fill="#71717a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {data.topPostsByComments.slice(0, 5).map((p) => (
            <Link
              key={p.postId}
              href={`/posts/${p.slug}`}
              className="block text-sm text-slate-400 hover:text-cyan-400"
            >
              {p.title} ({p.comments} comments)
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-6">
        <h2 className="text-lg font-medium text-slate-100 mb-4">User signups over time</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data.userSignupsOverTime}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="date" stroke="#71717a" />
              <YAxis stroke="#71717a" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#27272a",
                  border: "1px solid #3f3f46",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#a1a1aa"
                strokeWidth={2}
                dot={{ fill: "#71717a" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
