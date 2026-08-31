import { Request, Response, NextFunction } from "express";
import { BookingStatus, MechanicStatus } from "../generated/prisma/client";
import { prisma } from "../config/prisma";

export async function getDashboard(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(
      thirtyDaysAgo.getDate() - 29
    );
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const [
      totalBookings,
      todayBookings,
      completedBookings,
      pendingBookings,
      cancelledBookings,
      totalRevenue,
      activeMechanics,
      newCustomers,
      bookingsForAnalytics,
      services,
    ] = await Promise.all([
      prisma.booking.count(),

      prisma.booking.count({
        where: {
          scheduledAt: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
      }),

      prisma.booking.count({
        where: {
          status: BookingStatus.COMPLETED,
        },
      }),

      prisma.booking.count({
        where: {
          status: BookingStatus.PENDING,
        },
      }),

      prisma.booking.count({
        where: {
          status: BookingStatus.CANCELLED,
        },
      }),

      prisma.booking.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          status: BookingStatus.COMPLETED,
        },
      }),

      prisma.mechanic.count({
        where: {
          status: {
            in: [
              MechanicStatus.AVAILABLE,
              MechanicStatus.BUSY,
            ],
          },
        },
      }),

      prisma.customer.count({
        where: {
          createdAt: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
      }),

      prisma.booking.findMany({
        where: {
          scheduledAt: {
            gte: thirtyDaysAgo,
          },
        },
        select: {
          status: true,
          amount: true,
          scheduledAt: true,
          serviceId: true,
        },
        orderBy: {
          scheduledAt: "asc",
        },
      }),

      prisma.service.findMany({
        select: {
          id: true,
          name: true,
          category: true,
        },
      }),
    ]);

    // ----------------------------------------------
    // BOOKINGS OVER TIME
    // ----------------------------------------------

    const bookingsByDate = new Map<
      string,
      number
    >();

    const revenueByDate = new Map<
      string,
      number
    >();

    for (const booking of bookingsForAnalytics) {
      const date = booking.scheduledAt
        .toISOString()
        .split("T")[0];

      bookingsByDate.set(
        date,
        (bookingsByDate.get(date) ?? 0) + 1
      );

      if (booking.status === BookingStatus.COMPLETED) {
        revenueByDate.set(
          date,
          (revenueByDate.get(date) ?? 0) +
            booking.amount
        );
      }
    }

    const bookingsOverTime = [];

    const revenueOverTime = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo);

      date.setDate(date.getDate() + i);

      const dateKey = date
        .toISOString()
        .split("T")[0];

      bookingsOverTime.push({
        date: dateKey,
        bookings:
          bookingsByDate.get(dateKey) ?? 0,
      });

      revenueOverTime.push({
        date: dateKey,
        revenue:
          Math.round(
            (revenueByDate.get(dateKey) ?? 0) * 100
          ) / 100,
      });
    }

    // ----------------------------------------------
    // BOOKING STATUS
    // ----------------------------------------------

    const statusCounts = await prisma.booking.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
    });

    const bookingStatus = statusCounts.map(
      (item) => ({
        status: item.status,
        count: item._count._all,
      })
    );

    // ----------------------------------------------
    // SERVICE CATEGORY
    // ----------------------------------------------

    const serviceCategoryMap = new Map<
      string,
      number
    >();

    const bookingServiceIds =
      bookingsForAnalytics.map(
        (booking) => booking.serviceId
      );

    const serviceLookup = new Map(
      services.map((service) => [
        service.id,
        service.category,
      ])
    );

    for (const serviceId of bookingServiceIds) {
      const category =
        serviceLookup.get(serviceId) ??
        "Other";

      serviceCategoryMap.set(
        category,
        (serviceCategoryMap.get(category) ?? 0) + 1
      );
    }

    const serviceBreakdown = Array.from(
      serviceCategoryMap.entries()
    ).map(([category, count]) => ({
      category,
      count,
    }));

    res.json({
      success: true,
      data: {
        overview: {
          totalBookings,
          todayBookings,
          completedBookings,
          pendingBookings,
          cancelledBookings,
          totalRevenue:
            totalRevenue._sum.amount ?? 0,
          activeMechanics,
          newCustomers,
        },

        analytics: {
          bookingsOverTime,
          revenueOverTime,
          bookingStatus,
          serviceBreakdown,
        },

        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
}