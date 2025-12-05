"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Eye, Users, TrendingUp } from "lucide-react"

interface AnalyticsChartProps {
  stats: {
    total_views: number
    unique_visitors: number
  }
  dailyData?: { date: string; views: number }[]
}

export function AnalyticsChart({ stats, dailyData = [] }: AnalyticsChartProps) {
  // Generate mock data if none provided
  const chartData =
    dailyData.length > 0
      ? dailyData
      : Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { weekday: "short" }),
          views: Math.floor(Math.random() * 50) + 10,
        }))

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blurple-500" />
              <span className="text-sm text-muted-foreground">Total Views</span>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.total_views.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blurple-500" />
              <span className="text-sm text-muted-foreground">Unique Visitors</span>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.unique_visitors.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="col-span-2 md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blurple-500" />
              <span className="text-sm text-muted-foreground">Avg. per Day</span>
            </div>
            <p className="text-2xl font-bold mt-2">{Math.round(stats.total_views / 7).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Views Over Time</CardTitle>
          <CardDescription>Last 7 days of project views</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5865f2" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5865f2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 20%)" />
                <XAxis dataKey="date" stroke="hsl(240 5% 65%)" fontSize={12} tickLine={false} />
                <YAxis stroke="hsl(240 5% 65%)" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(240 10% 5%)",
                    border: "1px solid hsl(240 5% 20%)",
                    borderRadius: "8px",
                  }}
                />
                <Area type="monotone" dataKey="views" stroke="#5865f2" strokeWidth={2} fill="url(#viewsGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
