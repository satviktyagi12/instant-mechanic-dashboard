const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    let message = "Something went wrong";

    try {
      const error = await response.json();
      message = error.message || message;
    } catch {
      // Ignore JSON parsing errors
    }

    throw new Error(message);
  }

  return response.json();
}

/* =========================
   DASHBOARD
========================= */

export type DashboardResponse = {
  success: boolean;

  data: {
    overview: {
      totalBookings: number;
      todayBookings: number;
      completedBookings: number;
      pendingBookings: number;
      cancelledBookings: number;
      totalRevenue: number;
      activeMechanics: number;
      newCustomers: number;
    };

    analytics: {
      bookingsOverTime: Array<{
        date: string;
        bookings: number;
      }>;

      revenueOverTime: Array<{
        date: string;
        revenue: number;
      }>;

      bookingStatus: Array<{
        status: string;
        count: number;
      }>;

      serviceBreakdown: Array<{
        category: string;
        count: number;
      }>;
    };

    lastUpdated: string;
  };
};

export async function getDashboard(): Promise<DashboardResponse> {
  return apiFetch<DashboardResponse>(
    "/api/dashboard"
  );
}

/* =========================
   BOOKINGS
========================= */

export type BookingStatus =
  | "PENDING"
  | "ASSIGNED"
  | "MECHANIC_ON_THE_WAY"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type Booking = {
  id: string;
  bookingNumber: string;

  customerId: string;
  mechanicId: string | null;
  serviceId: string;

  vehicleMake: string;
  vehicleModel: string;
  vehicleNumber: string;
  vehicleYear: number | null;

  status: BookingStatus;

  amount: number;

  scheduledAt: string;
  completedAt: string | null;

  createdAt: string;
  updatedAt: string;

  customer: {
    id: string;
    name: string;
    email?: string;
    phone: string;
    address?: string | null;
  };

  mechanic: {
    id: string;
    name: string;
    email?: string;
    phone: string;
    status: string;
    jobsCompleted?: number;
    latitude?: number | null;
    longitude?: number | null;
  } | null;

  service: {
    id: string;
    name: string;
    category: string;
    description?: string | null;
    basePrice?: number;
  };
};

export type BookingsResponse = {
  success: boolean;

  data: Booking[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function getBookings({
  page = 1,
  limit = 10,
  search = "",
  status = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: BookingStatus | "";
} = {}): Promise<BookingsResponse> {
  const params = new URLSearchParams();

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

  if (status) {
    params.set(
      "status",
      status
    );
  }

  return apiFetch<BookingsResponse>(
    `/api/bookings?${params.toString()}`
  );
}

export async function getBookingById(
  id: string
): Promise<{
  success: boolean;
  data: Booking;
}> {
  return apiFetch<{
    success: boolean;
    data: Booking;
  }>(
    `/api/bookings/${id}`
  );
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<{
  success: boolean;
  data: Booking;
}> {
  return apiFetch<{
    success: boolean;
    data: Booking;
  }>(
    `/api/bookings/${id}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({
        status,
      }),
    }
  );
}