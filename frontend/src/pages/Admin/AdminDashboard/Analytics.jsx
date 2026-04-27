import React, { useEffect, useState } from "react";
import { toast } from "sonner";
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
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPath";
import Spinner from "../../../components/ui/Spinner";

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(API_PATHS.ADMIN.ANALYTICS);
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to load analytics");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!data) return null;

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[var(--app-text)]">Revenue & Analytics</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Revenue Line Chart */}
        <div className="surface-card p-6">
          <h3 className="mb-4 text-lg font-medium text-[var(--app-text)]">Monthly Revenue</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" />
                <XAxis dataKey="name" stroke="var(--app-text)" opacity={0.6} />
                <YAxis stroke="var(--app-text)" opacity={0.6} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)', borderRadius: '12px' }}
                    itemStyle={{ color: 'var(--app-text)' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Bookings Bar Chart */}
        <div className="surface-card p-6">
          <h3 className="mb-4 text-lg font-medium text-[var(--app-text)]">Weekly Bookings</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weeklyBookings}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" />
                <XAxis dataKey="name" stroke="var(--app-text)" opacity={0.6} />
                <YAxis stroke="var(--app-text)" opacity={0.6} />
                <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)', borderRadius: '12px' }}
                    itemStyle={{ color: 'var(--app-text)' }}
                    cursor={{ fill: 'var(--app-border)', opacity: 0.2 }}
                />
                <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Turf Pie Chart */}
        <div className="surface-card p-6">
          <h3 className="mb-4 text-lg font-medium text-[var(--app-text)]">Revenue by Turf</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.revenueByTurf}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.revenueByTurf.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)', borderRadius: '12px' }}
                    itemStyle={{ color: 'var(--app-text)' }}
                    formatter={(value) => `₹${value}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Hours Bar Chart */}
        <div className="surface-card p-6">
          <h3 className="mb-4 text-lg font-medium text-[var(--app-text)]">Peak Booking Hours</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.peakHours} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" />
                <XAxis type="number" stroke="var(--app-text)" opacity={0.6} />
                <YAxis dataKey="time" type="category" stroke="var(--app-text)" opacity={0.6} width={80} />
                <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)', borderRadius: '12px' }}
                    itemStyle={{ color: 'var(--app-text)' }}
                    cursor={{ fill: 'var(--app-border)', opacity: 0.2 }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
