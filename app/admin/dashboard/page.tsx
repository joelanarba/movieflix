
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import AdminLayout from '../../../components/Layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { useAnalytics } from '../../../hooks/useAnalytics';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../../components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

// Mock admin check - in production, this would use Firebase custom claims
const isAdmin = (user: any) => {
  // For demo purposes, return true. In production, check Firebase custom claims or user roles
  return user && true;
};



const chartConfig = {
  visitors: {
    label: 'Visitors',
    color: '#4299e1'
  },
  visits: {
    label: 'Visits',
    color: '#48bb78'
  },
  count: {
    label: 'Count',
    color: '#ed8936'
  }
};

const COLORS = ['#4299e1', '#48bb78', '#ed8936', '#9f7aea', '#f56565'];

const AdminDashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: analyticsData, loading: analyticsLoading, error } = useAnalytics();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin(user))) {
      router.push('/login');
      return;
    }
  }, [user, authLoading, router]);

  if (authLoading || analyticsLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || !isAdmin(user) || !analyticsData) {
    return null;
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Error Loading Analytics</h1>
            <p className="text-slate-400">{error}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Analytics Dashboard</h1>
          <p className="text-slate-400">Monitor your MovieFlix application performance and user engagement</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Visitors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analyticsData.totalVisitors.toLocaleString()}</div>
              <p className="text-xs text-green-400 mt-1">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Page Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analyticsData.totalPageViews.toLocaleString()}</div>
              <p className="text-xs text-green-400 mt-1">+8% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Avg. Session</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analyticsData.averageSessionDuration}</div>
              <p className="text-xs text-blue-400 mt-1">+5% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Bounce Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analyticsData.bounceRate}</div>
              <p className="text-xs text-red-400 mt-1">-3% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Visitors Chart */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Daily Visitors (Last 7 Days)</CardTitle>
              <CardDescription className="text-slate-400">
                Track daily visitor trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <LineChart data={analyticsData.dailyVisitors}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="visitors" 
                    stroke={chartConfig.visitors.color} 
                    strokeWidth={2}
                    dot={{ fill: chartConfig.visitors.color, strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Popular Genres Pie Chart */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Popular Genres</CardTitle>
              <CardDescription className="text-slate-400">
                Distribution of genre preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <PieChart>
                  <Pie
                    data={analyticsData.popularGenres}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ genre, percentage }) => `${genre} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analyticsData.popularGenres.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Most Visited Movies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Most Visited Movies</CardTitle>
              <CardDescription className="text-slate-400">
                Top performing movie pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart data={analyticsData.mostVisitedMovies} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
                  <YAxis 
                    dataKey="movieTitle" 
                    type="category" 
                    stroke="#9CA3AF" 
                    fontSize={10}
                    width={120}
                    tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="visits" fill={chartConfig.visits.color} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Top Movies Details</CardTitle>
              <CardDescription className="text-slate-400">
                Detailed breakdown of most visited movie pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left text-slate-400 font-medium py-2">Movie</th>
                      <th className="text-right text-slate-400 font-medium py-2">Visits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {analyticsData.mostVisitedMovies.map((movie, index) => (
                      <tr key={movie.movieId} className="hover:bg-slate-700/50 transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="text-white font-medium text-sm">
                                {movie.movieTitle}
                              </div>
                              <div className="text-slate-400 text-xs">
                                ID: {movie.movieId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-right py-3">
                          <span className="text-white font-medium">
                            {movie.visits.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
