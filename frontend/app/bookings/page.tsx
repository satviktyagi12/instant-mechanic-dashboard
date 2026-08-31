"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  Booking,
  BookingStatus,
  getBookings,
} from "../../src/lib/api";

const STATUS_OPTIONS: Array<{
  value: BookingStatus | "";
  label: string;
}> = [
  {
    value: "",
    label: "All statuses",
  },
  {
    value: "PENDING",
    label: "Pending",
  },
  {
    value: "ASSIGNED",
    label: "Assigned",
  },
  {
    value: "MECHANIC_ON_THE_WAY",
    label: "Mechanic On The Way",
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
  },
  {
    value: "COMPLETED",
    label: "Completed",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
  },
];

type SortField =
  | "bookingNumber"
  | "customer"
  | "vehicle"
  | "service"
  | "mechanic"
  | "status"
  | "amount"
  | "scheduledAt";

type SortDirection = "asc" | "desc";

export default function BookingsPage() {
  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<BookingStatus | "">("");

  const [page, setPage] =
    useState(1);

  const [limit, setLimit] =
    useState(10);

  const [total, setTotal] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(0);

  const [sortField, setSortField] =
    useState<SortField>("scheduledAt");

  const [sortDirection, setSortDirection] =
    useState<SortDirection>("desc");

  useEffect(() => {
    let mounted = true;

    async function loadBookings() {
      try {
        setLoading(true);
        setError(null);

        const response =
          await getBookings({
            page,
            limit,
            search,
            status,
          });

        if (!mounted) {
          return;
        }

        setBookings(response.data);
        setTotal(
          response.pagination.total
        );
        setTotalPages(
          response.pagination.totalPages
        );
      } catch (err) {
        if (!mounted) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load bookings"
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadBookings();

    return () => {
      mounted = false;
    };
  }, [
    page,
    limit,
    search,
    status,
  ]);

  const sortedBookings = useMemo(() => {
    const result = [...bookings];

    result.sort((a, b) => {
      let first = "";
      let second = "";

      switch (sortField) {
        case "bookingNumber":
          first = a.bookingNumber;
          second = b.bookingNumber;
          break;

        case "customer":
          first = a.customer.name;
          second = b.customer.name;
          break;

        case "vehicle":
          first =
            `${a.vehicleMake} ${a.vehicleModel}`;
          second =
            `${b.vehicleMake} ${b.vehicleModel}`;
          break;

        case "service":
          first = a.service.name;
          second = b.service.name;
          break;

        case "mechanic":
          first =
            a.mechanic?.name || "Unassigned";
          second =
            b.mechanic?.name || "Unassigned";
          break;

        case "status":
          first = a.status;
          second = b.status;
          break;

        case "amount":
          return sortDirection === "asc"
            ? a.amount - b.amount
            : b.amount - a.amount;

        case "scheduledAt":
          return sortDirection === "asc"
            ? new Date(
                a.scheduledAt
              ).getTime() -
                new Date(
                  b.scheduledAt
                ).getTime()
            : new Date(
                b.scheduledAt
              ).getTime() -
                new Date(
                  a.scheduledAt
                ).getTime();
      }

      const comparison =
        first.localeCompare(
          second,
          undefined,
          {
            numeric: true,
            sensitivity: "base",
          }
        );

      return sortDirection === "asc"
        ? comparison
        : -comparison;
    });

    return result;
  }, [
    bookings,
    sortField,
    sortDirection,
  ]);

  function handleSort(
    field: SortField
  ) {
    if (sortField === field) {
      setSortDirection(
        (current) =>
          current === "asc"
            ? "desc"
            : "asc"
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  function handleSearch(
    value: string
  ) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusChange(
    value: BookingStatus | ""
  ) {
    setStatus(value);
    setPage(1);
  }

  function handleLimitChange(
    value: number
  ) {
    setLimit(value);
    setPage(1);
  }

  function formatStatus(
    value: BookingStatus
  ) {
    return value
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  }

  function formatDate(
    value: string
  ) {
    return new Date(
      value
    ).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatCurrency(
    value: number
  ) {
    return `₹${Math.round(
      value
    ).toLocaleString("en-IN")}`;
  }

  function getStatusClass(
    value: BookingStatus
  ) {
    switch (value) {
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";

      case "PENDING":
        return "bg-amber-50 text-amber-700 ring-amber-600/20";

      case "CANCELLED":
        return "bg-red-50 text-red-700 ring-red-600/20";

      case "ASSIGNED":
        return "bg-blue-50 text-blue-700 ring-blue-600/20";

      case "MECHANIC_ON_THE_WAY":
        return "bg-violet-50 text-violet-700 ring-violet-600/20";

      case "IN_PROGRESS":
        return "bg-slate-100 text-slate-700 ring-slate-600/20";

      default:
        return "bg-slate-100 text-slate-700 ring-slate-600/20";
    }
  }

  function SortIcon({
    field,
  }: {
    field: SortField;
  }) {
    if (sortField !== field) {
      return (
        <span className="text-slate-300">
          ↕
        </span>
      );
    }

    return (
      <span className="text-slate-700">
        {sortDirection === "asc"
          ? "↑"
          : "↓"}
      </span>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-[1500px]">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Operations
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Bookings
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage and monitor vehicle service bookings.
            </p>
          </div>

          <Link
            href="/"
            className="w-fit rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">

            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={(event) =>
                  handleSearch(
                    event.target.value
                  )
                }
                placeholder="Search booking, customer, vehicle or mechanic..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
              />
            </div>

            {/* Status */}
            <select
              value={status}
              onChange={(event) =>
                handleStatusChange(
                  event.target
                    .value as BookingStatus | ""
                )
              }
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              {STATUS_OPTIONS.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                )
              )}
            </select>

            {/* Page size */}
            <select
              value={limit}
              onChange={(event) =>
                handleLimitChange(
                  Number(
                    event.target.value
                  )
                )
              }
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              <option value={10}>
                10 / page
              </option>

              <option value={25}>
                25 / page
              </option>

              <option value={50}>
                50 / page
              </option>
            </select>

          </div>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-left">

              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>

                  <TableHeader
                    label="Booking"
                    field="bookingNumber"
                    onSort={handleSort}
                  >
                    <SortIcon field="bookingNumber" />
                  </TableHeader>

                  <TableHeader
                    label="Customer"
                    field="customer"
                    onSort={handleSort}
                  >
                    <SortIcon field="customer" />
                  </TableHeader>

                  <TableHeader
                    label="Vehicle"
                    field="vehicle"
                    onSort={handleSort}
                  >
                    <SortIcon field="vehicle" />
                  </TableHeader>

                  <TableHeader
                    label="Service"
                    field="service"
                    onSort={handleSort}
                  >
                    <SortIcon field="service" />
                  </TableHeader>

                  <TableHeader
                    label="Mechanic"
                    field="mechanic"
                    onSort={handleSort}
                  >
                    <SortIcon field="mechanic" />
                  </TableHeader>

                  <TableHeader
                    label="Status"
                    field="status"
                    onSort={handleSort}
                  >
                    <SortIcon field="status" />
                  </TableHeader>

                  <TableHeader
                    label="Amount"
                    field="amount"
                    onSort={handleSort}
                  >
                    <SortIcon field="amount" />
                  </TableHeader>

                  <TableHeader
                    label="Scheduled"
                    field="scheduledAt"
                    onSort={handleSort}
                  >
                    <SortIcon field="scheduledAt" />
                  </TableHeader>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-20 text-center"
                    >
                      <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

                      <p className="mt-3 text-sm text-slate-500">
                        Loading bookings...
                      </p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-20 text-center"
                    >
                      <p className="font-medium text-red-600">
                        Failed to load bookings
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        {error}
                      </p>
                    </td>
                  </tr>
                ) : sortedBookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-20 text-center"
                    >
                      <p className="font-medium text-slate-700">
                        No bookings found
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Try changing your search or filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  sortedBookings.map(
                    (booking) => (
                      <tr
                        key={booking.id}
                        className="transition hover:bg-slate-50"
                      >

                        {/* Booking */}
                        <td className="px-5 py-4">
                          <Link
                            href={`/bookings/${booking.id}`}
                            className="font-medium text-slate-900 hover:underline"
                          >
                            {booking.bookingNumber}
                          </Link>

                          <p className="mt-1 text-xs text-slate-400">
                            {booking.id.slice(
                              0,
                              8
                            )}
                          </p>
                        </td>

                        {/* Customer */}
                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-800">
                            {booking.customer.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {booking.customer.phone}
                          </p>
                        </td>

                        {/* Vehicle */}
                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-800">
                            {booking.vehicleMake}{" "}
                            {booking.vehicleModel}
                          </p>

                          <p className="mt-1 text-xs font-medium uppercase text-slate-500">
                            {booking.vehicleNumber}
                          </p>
                        </td>

                        {/* Service */}
                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-800">
                            {booking.service.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {booking.service.category}
                          </p>
                        </td>

                        {/* Mechanic */}
                        <td className="px-5 py-4">
                          {booking.mechanic ? (
                            <>
                              <p className="font-medium text-slate-800">
                                {booking.mechanic.name}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {booking.mechanic.status
                                  .replaceAll(
                                    "_",
                                    " "
                                  )
                                  .toLowerCase()
                                  .replace(
                                    /\b\w/g,
                                    (char) =>
                                      char.toUpperCase()
                                  )}
                              </p>
                            </>
                          ) : (
                            <span className="text-sm text-slate-400">
                              Unassigned
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClass(
                              booking.status
                            )}`}
                          >
                            {formatStatus(
                              booking.status
                            )}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="px-5 py-4">
                          <span className="font-semibold text-slate-900">
                            {formatCurrency(
                              booking.amount
                            )}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4">
                          <p className="whitespace-nowrap text-sm font-medium text-slate-800">
                            {formatDate(
                              booking.scheduledAt
                            )}
                          </p>
                        </td>

                      </tr>
                    )
                  )
                )}

              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-slate-500">
              Showing{" "}
              {total === 0
                ? 0
                : (page - 1) *
                    limit +
                  1}{" "}
              to{" "}
              {Math.min(
                page * limit,
                total
              )}{" "}
              of{" "}
              {total.toLocaleString(
                "en-IN"
              )}{" "}
              bookings
            </p>

            <div className="flex items-center gap-2">

              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() =>
                  setPage(
                    (current) =>
                      current - 1
                  )
                }
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <div className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white">
                {page}
                {" / "}
                {totalPages || 1}
              </div>

              <button
                type="button"
                disabled={
                  page >= totalPages ||
                  loading
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      current + 1
                  )
                }
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>

            </div>
          </div>

        </div>

      </div>
    </main>
  );
}

function TableHeader({
  label,
  field,
  onSort,
  children,
}: {
  label: string;
  field: SortField;
  onSort: (field: SortField) => void;
  children: React.ReactNode;
}) {
  return (
    <th className="px-5 py-3">
      <button
        type="button"
        onClick={() => onSort(field)}
        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:text-slate-900"
      >
        {label}
        {children}
      </button>
    </th>
  );
}