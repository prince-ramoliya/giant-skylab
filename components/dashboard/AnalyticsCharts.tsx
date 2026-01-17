"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface ChartData {
    revenueTrend: { date: string; amount: number }[];
    categorySales: { name: string; value: number }[];
    topSellers: { name: string; amount: number }[];
    returnsByCategory: { name: string; value: number }[];
    ordersVsReturns: { date: string; orders: number; returns: number }[];
}

export function AnalyticsCharts({ data }: { data: ChartData }) {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                {/* Chart 1: Daily Revenue Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daily Revenue Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.revenueTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Chart 2: Category Sales Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Sales by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.categorySales}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {data.categorySales.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Chart 3: Top Sellers */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Sellers by Volume</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.topSellers} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" fontSize={12} />
                                <YAxis dataKey="name" type="category" width={100} fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="amount" fill="#82ca9d" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Chart 4: Returns by Category */}
                <Card>
                    <CardHeader>
                        <CardTitle>Returns by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.returnsByCategory}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Chart 5: Orders vs Returns */}
            <Card>
                <CardHeader>
                    <CardTitle>Orders vs Returns (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.ordersVsReturns}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="orders" stackId="1" stroke="#2563eb" fill="#3b82f6" />
                            <Area type="monotone" dataKey="returns" stackId="1" stroke="#ef4444" fill="#fca5a5" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
