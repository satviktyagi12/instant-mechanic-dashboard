"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  Booking,
  BookingStatus,
  getBookingById,
  updateBookingStatus,
} from "../../../src/lib/api";

const STATUS_OPTIONS: BookingStatus[] = [
  "PENDING",
  "ASSIGNED",
  "MECHANIC_ON_THE_WAY",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

export default function BookingDetailPage() {
  const params = useParams<{ id: string }>();
  const bookingId = params.id;

  const [booking, setBooking] =
    useState<Booking | null>(null);

  const [status, setStatus] =
    useState<BookingStatus>("PENDING");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadBooking() {
      try {
        setLoading(true);
        setError(null);

        const response =
          await getBookingById(bookingId);

        if (!mounted) {
          return;
        }

        setBooking(response.data);
        setStatus(response.data.status);
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load booking"
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadBooking();

    return () => {
      mounted = false;
    };
  }, [bookingId]);

  async function handleStatusUpdate() {
    if (!booking) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response =
        await updateBookingStatus(
          bookingId,
          status
        );

      setBooking(response.data);
      setStatus(response.data.status);

      setSuccess(
        "Booking status updated successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update booking status"
      );
    } finally {
      setSaving(false);
    }
  }

  function formatStatus(value: string) {
    return value
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  }

  function formatDate(value: string) {
    return new Date(
      value
    ).toLocaleString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatCurrency(value: number) {
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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

          <p className="mt-3 text-sm text-slate-500">
            Loading booking...
          </p>
        </div>
      </main>
    );
  }

  if (error && !booking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <p className="font-medium text-red-600">
            Failed to load booking
          </p>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>

          <Link
            href="/bookings"
            className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Back to Bookings
          </Link>
        </div>
      </main>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/bookings"
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            ← Back to Bookings
          </Link>

          <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Booking Details
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                {booking.bookingNumber}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Created{" "}
                {formatDate(
                  booking.createdAt
                )}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1.5 text-sm font-medium ring-1 ring-inset ${getStatusClass(
                booking.status
              )}`}
            >
              {formatStatus(
                booking.status
              )}
            </span>
          </div>
        </div>

        {/* Status Update */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="font-semibold text-slate-900">
              Update Booking Status
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Change the current operational status of this booking.
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target
                    .value as BookingStatus
                )
              }
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              {STATUS_OPTIONS.map(
                (option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {formatStatus(option)}
                  </option>
                )
              )}
            </select>

            <button
              type="button"
              disabled={
                saving ||
                status === booking.status
              }
              onClick={
                handleStatusUpdate
              }
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving
                ? "Updating..."
                : "Update Status"}
            </button>
          </div>

          {success && (
            <p className="mt-3 text-sm font-medium text-emerald-600">
              {success}
            </p>
          )}

          {error && booking && (
            <p className="mt-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}
        </div>

        {/* Information */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* Customer */}
          <InfoCard title="Customer">
            <InfoRow
              label="Name"
              value={
                booking.customer.name
              }
            />

            <InfoRow
              label="Phone"
              value={
                booking.customer.phone
              }
            />

            {booking.customer.email && (
              <InfoRow
                label="Email"
                value={
                  booking.customer.email
                }
              />
            )}
          </InfoCard>

          {/* Vehicle */}
          <InfoCard title="Vehicle">
            <InfoRow
              label="Vehicle"
              value={`${booking.vehicleMake} ${booking.vehicleModel}`}
            />

            <InfoRow
              label="Registration"
              value={
                booking.vehicleNumber
              }
            />

            <InfoRow
              label="Year"
              value={
                booking.vehicleYear
                  ? String(
                      booking.vehicleYear
                    )
                  : "Not provided"
              }
            />
          </InfoCard>

          {/* Service */}
          <InfoCard title="Service">
            <InfoRow
              label="Service"
              value={
                booking.service.name
              }
            />

            <InfoRow
              label="Category"
              value={
                booking.service.category
              }
            />

            <InfoRow
              label="Amount"
              value={formatCurrency(
                booking.amount
              )}
            />
          </InfoCard>

          {/* Mechanic */}
          <InfoCard title="Mechanic">
            {booking.mechanic ? (
              <>
                <InfoRow
                  label="Name"
                  value={
                    booking.mechanic.name
                  }
                />

                <InfoRow
                  label="Status"
                  value={formatStatus(
                    booking.mechanic
                      .status
                  )}
                />

                <InfoRow
                  label="Phone"
                  value={
                    booking.mechanic.phone
                  }
                />
              </>
            ) : (
              <p className="text-sm text-slate-400">
                No mechanic assigned.
              </p>
            )}
          </InfoCard>
        </div>

        {/* Schedule */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">
            Schedule
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Scheduled At
              </p>

              <p className="mt-1 text-sm font-medium text-slate-800">
                {formatDate(
                  booking.scheduledAt
                )}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Completed At
              </p>

              <p className="mt-1 text-sm font-medium text-slate-800">
                {booking.completedAt
                  ? formatDate(
                      booking.completedAt
                    )
                  : "Not completed"}
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-slate-900">
        {title}
      </h2>

      <div className="mt-5 space-y-4">
        {children}
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-right text-sm font-medium text-slate-800">
        {value}
      </span>
    </div>
  );
}