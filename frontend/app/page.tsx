"use client";

import { useEffect, useState } from "react";

import {
  getDashboard,
  DashboardResponse,
} from "../src/lib/api";

import DashboardSidebar from "../components/ui/dashboard-sidebar";
import BookingsChart from "../components/ui/bookings-chart";
import StatusChart from "../components/ui/status-chart";
import RevenueChart from "../components/ui/revenue-chart";
import CategoryChart from "../components/ui/category-chart";

export default function Home() {
  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        const data = await getDashboard();

        if (mounted) {
          setDashboard(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load dashboard"
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    const interval = setInterval(
      loadDashboard,
      30000
    );

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

          <p className="mt-3 text-sm text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <p className="font-medium text-red-600">
            Failed to load dashboard
          </p>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  if (!dashboard) {
    return null;
  }

  const {
    totalBookings,
    todayBookings,
    completedBookings,
    pendingBookings,
    cancelledBookings,
    totalRevenue,
    activeMechanics,
    newCustomers,
  } = dashboard.data.overview;

  const {
    bookingsOverTime,
    revenueOverTime,
    bookingStatus,
    serviceBreakdown,
  } = dashboard.data.analytics;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <main className="min-w-0 flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Operations
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                Dashboard
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Monitor your vehicle service operations in real time.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

              <span className="text-xs font-medium text-emerald-700">
                Live
              </span>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Total Bookings"
              value={totalBookings.toLocaleString("en-IN")}
            />

            <StatCard
              title="Today's Bookings"
              value={todayBookings.toLocaleString("en-IN")}
            />

            <StatCard
              title="Completed"
              value={completedBookings.toLocaleString("en-IN")}
            />

            <StatCard
              title="Total Revenue"
              value={`₹${Math.round(
                totalRevenue
              ).toLocaleString("en-IN")}`}
            />

            <StatCard
              title="Pending"
              value={pendingBookings.toLocaleString("en-IN")}
            />

            <StatCard
              title="Cancelled"
              value={cancelledBookings.toLocaleString("en-IN")}
            />

            <StatCard
              title="Active Mechanics"
              value={activeMechanics.toLocaleString("en-IN")}
            />

            <StatCard
              title="New Customers"
              value={newCustomers.toLocaleString("en-IN")}
            />

          </div>

          {/* Analytics Row 1 */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">

            {/* Bookings Over Time */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Bookings Over Time
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Booking activity over the last 30 days
                </p>
              </div>

              <div className="mt-6">
                <BookingsChart
                  data={bookingsOverTime}
                />
              </div>
            </div>

            {/* Booking Status */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Booking Status
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Current booking distribution
                </p>
              </div>

              <div className="mt-6">
                <StatusChart
                  data={bookingStatus}
                />
              </div>
            </div>

          </div>

          {/* Analytics Row 2 */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">

            {/* Revenue Over Time */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Revenue Over Time
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Revenue generated over the last 30 days
                </p>
              </div>

              <div className="mt-6">
                <RevenueChart
                  data={revenueOverTime}
                />
              </div>
            </div>

            {/* Service Category Breakdown */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Service Category Breakdown
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Bookings grouped by service category
                </p>
              </div>

              <div className="mt-6">
                <CategoryChart
                  data={serviceBreakdown}
                />
              </div>
            </div>

          </div>

          {/* Last Updated */}
          <div className="mt-6 flex items-center justify-end">
            <p className="text-xs text-slate-400">
              Last updated{" "}
              {new Date(
                dashboard.data.lastUpdated
              ).toLocaleTimeString("en-IN")}
              {" "}• Updates every 30 seconds
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}