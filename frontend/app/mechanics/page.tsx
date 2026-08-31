"use client";

import { useEffect, useState } from "react";

import DashboardSidebar from "../../components/ui/dashboard-sidebar";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

type MechanicStatus =
  | "AVAILABLE"
  | "BUSY"
  | "OFFLINE"
  | "ON_BREAK";

type CurrentBooking = {
  id: string;
  bookingNumber: string;
  status: string;
  scheduledAt: string;
  customer: {
    name: string;
  };
  service: {
    name: string;
  };
} | null;

type Mechanic = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: MechanicStatus;
  jobsCompleted: number;
  latitude: number | null;
  longitude: number | null;
  currentBooking: CurrentBooking;
};

type MechanicsResponse = {
  success: boolean;
  data: Mechanic[];
};

export default function MechanicsPage() {
  const [mechanics, setMechanics] =
    useState<Mechanic[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadMechanics() {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/api/mechanics`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load mechanics"
          );
        }

        const data: MechanicsResponse =
          await response.json();

        if (mounted) {
          setMechanics(data.data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load mechanics"
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadMechanics();

    const interval = setInterval(
      loadMechanics,
      30000
    );

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  function formatStatus(
    status: MechanicStatus
  ) {
    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  }

  function getStatusClass(
    status: MechanicStatus
  ) {
    switch (status) {
      case "AVAILABLE":
        return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";

      case "BUSY":
        return "bg-blue-50 text-blue-700 ring-blue-600/20";

      case "ON_BREAK":
        return "bg-amber-50 text-amber-700 ring-amber-600/20";

      case "OFFLINE":
        return "bg-slate-100 text-slate-600 ring-slate-500/20";

      default:
        return "bg-slate-100 text-slate-600 ring-slate-500/20";
    }
  }

  function formatDate(
    value: string
  ) {
    return new Date(
      value
    ).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

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
                Mechanics
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Monitor mechanic availability, workload and current jobs.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

              <span className="text-xs font-medium text-emerald-700">
                Live
              </span>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <SummaryCard
              label="Total Mechanics"
              value={mechanics.length}
            />

            <SummaryCard
              label="Available"
              value={
                mechanics.filter(
                  (mechanic) =>
                    mechanic.status ===
                    "AVAILABLE"
                ).length
              }
            />

            <SummaryCard
              label="Busy"
              value={
                mechanics.filter(
                  (mechanic) =>
                    mechanic.status ===
                    "BUSY"
                ).length
              }
            />

            <SummaryCard
              label="Offline / Break"
              value={
                mechanics.filter(
                  (mechanic) =>
                    mechanic.status ===
                      "OFFLINE" ||
                    mechanic.status ===
                      "ON_BREAK"
                ).length
              }
            />

          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-xl border border-slate-200 bg-white py-20 text-center shadow-sm">
              <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

              <p className="mt-3 text-sm text-slate-500">
                Loading mechanics...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
              <p className="font-medium text-red-600">
                Failed to load mechanics
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {error}
              </p>
            </div>
          )}

          {/* Mechanics */}
          {!loading &&
            !error &&
            mechanics.length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <p className="font-medium text-slate-700">
                  No mechanics found
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            mechanics.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                {mechanics.map(
                  (mechanic) => (
                    <div
                      key={mechanic.id}
                      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                    >

                      {/* Mechanic header */}
                      <div className="flex items-start justify-between gap-4">

                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                            {mechanic.name
                              .split(" ")
                              .map(
                                (name) =>
                                  name[0]
                              )
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <h2 className="truncate font-semibold text-slate-900">
                              {mechanic.name}
                            </h2>

                            <p className="truncate text-xs text-slate-500">
                              {mechanic.phone}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClass(
                            mechanic.status
                          )}`}
                        >
                          {formatStatus(
                            mechanic.status
                          )}
                        </span>

                      </div>

                      {/* Stats */}
                      <div className="mt-5 grid grid-cols-2 gap-3">

                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">
                            Jobs Completed
                          </p>

                          <p className="mt-1 text-xl font-bold text-slate-900">
                            {mechanic.jobsCompleted}
                          </p>
                        </div>

                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">
                            Current Job
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-900">
                            {mechanic.currentBooking
                              ? mechanic
                                  .currentBooking
                                  .bookingNumber
                              : "None"}
                          </p>
                        </div>

                      </div>

                      {/* Current booking */}
                      <div className="mt-4 border-t border-slate-100 pt-4">

                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Current / Last Booking
                        </p>

                        {mechanic.currentBooking ? (
                          <div className="mt-3">

                            <div className="flex items-center justify-between gap-3">
                              <p className="font-medium text-slate-800">
                                {
                                  mechanic
                                    .currentBooking
                                    .customer
                                    .name
                                }
                              </p>

                              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                                {formatStatus(
                                  mechanic
                                    .currentBooking
                                    .status as MechanicStatus
                                )}
                              </span>
                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                              {
                                mechanic
                                  .currentBooking
                                  .service
                                  .name
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {formatDate(
                                mechanic
                                  .currentBooking
                                  .scheduledAt
                              )}
                            </p>

                          </div>
                        ) : (
                          <p className="mt-3 text-sm text-slate-400">
                            No active booking
                          </p>
                        )}

                      </div>

                      {/* Location */}
                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                        <span className="text-xs text-slate-400">
                          Location
                        </span>

                        <span className="text-xs font-medium text-slate-600">
                          {mechanic.latitude !==
                            null &&
                          mechanic.longitude !==
                            null
                            ? `${mechanic.latitude.toFixed(
                                4
                              )}, ${mechanic.longitude.toFixed(
                                4
                              )}`
                            : "Not available"}
                        </span>
                      </div>

                    </div>
                  )
                )}

              </div>
            )}

        </div>
      </main>
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}