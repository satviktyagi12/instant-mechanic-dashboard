"use client";

import { useEffect, useState } from "react";

import DashboardSidebar from "../../components/ui/dashboard-sidebar";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string | null;
  createdAt: string;
  bookingsCount: number;
};

type CustomersResponse = {
  success: boolean;
  data: Customer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export default function CustomersPage() {
  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [limit, setLimit] =
    useState(20);

  const [total, setTotal] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(0);

  useEffect(() => {
    let mounted = true;

    async function loadCustomers() {
      try {
        setLoading(true);
        setError(null);

        const params =
          new URLSearchParams();

        params.set(
          "page",
          String(page)
        );

        params.set(
          "limit",
          String(limit)
        );

        if (search.trim()) {
          params.set(
            "search",
            search.trim()
          );
        }

        const response =
          await fetch(
            `${API_URL}/api/customers?${params.toString()}`,
            {
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            "Failed to load customers"
          );
        }

        const data: CustomersResponse =
          await response.json();

        if (!mounted) {
          return;
        }

        setCustomers(data.data);

        setTotal(
          data.pagination.total
        );

        setTotalPages(
          data.pagination.totalPages
        );
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load customers"
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadCustomers();

    return () => {
      mounted = false;
    };
  }, [
    page,
    limit,
    search,
  ]);

  function formatDate(
    value: string
  ) {
    return new Date(
      value
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <main className="min-w-0 flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8">
            <p className="text-sm font-medium text-slate-500">
              Operations
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Customers
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage customer information and booking activity.
            </p>
          </div>

          {/* Summary */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <SummaryCard
              label="Total Customers"
              value={total}
            />

            <SummaryCard
              label="Customers on Page"
              value={customers.length}
            />

            <SummaryCard
              label="Current Page"
              value={page}
            />

          </div>

          {/* Search */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(
                  event.target.value
                );
                setPage(1);
              }}
              placeholder="Search by name, email or phone..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
            />
          </div>

          {/* Table */}
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left">

                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Customer
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Contact
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Address
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Bookings
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Joined
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-20 text-center"
                      >
                        <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

                        <p className="mt-3 text-sm text-slate-500">
                          Loading customers...
                        </p>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-20 text-center"
                      >
                        <p className="font-medium text-red-600">
                          Failed to load customers
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                          {error}
                        </p>
                      </td>
                    </tr>
                  ) : customers.length ===
                    0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-20 text-center"
                      >
                        <p className="font-medium text-slate-700">
                          No customers found
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Try another search.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    customers.map(
                      (customer) => (
                        <tr
                          key={customer.id}
                          className="transition hover:bg-slate-50"
                        >

                          {/* Customer */}
                          <td className="px-5 py-4">
                            <p className="font-medium text-slate-900">
                              {customer.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {customer.id.slice(
                                0,
                                8
                              )}
                            </p>
                          </td>

                          {/* Contact */}
                          <td className="px-5 py-4">
                            <p className="text-sm font-medium text-slate-800">
                              {customer.email}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {customer.phone}
                            </p>
                          </td>

                          {/* Address */}
                          <td className="max-w-xs px-5 py-4">
                            <p className="truncate text-sm text-slate-600">
                              {customer.address ||
                                "Not provided"}
                            </p>
                          </td>

                          {/* Bookings */}
                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                              {
                                customer.bookingsCount
                              }
                            </span>
                          </td>

                          {/* Joined */}
                          <td className="px-5 py-4 text-sm text-slate-600">
                            {formatDate(
                              customer.createdAt
                            )}
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
                customers
              </p>

              <div className="flex items-center gap-2">

                <button
                  type="button"
                  disabled={
                    page <= 1 ||
                    loading
                  }
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
                    page >=
                      totalPages ||
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