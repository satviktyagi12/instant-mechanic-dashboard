import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  BookingStatus,
} from "../generated/prisma/client";

import { prisma } from "../config/prisma";

function getBookingId(req: Request): string {
  const { id } = req.params;

  if (Array.isArray(id)) {
    return id[0];
  }

  return id;
}

export async function getBookings(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number(req.query.limit) || 10,
        1
      ),
      100
    );

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const status =
      typeof req.query.status === "string"
        ? req.query.status
        : "";

    const skip = (page - 1) * limit;

    const validStatus = Object.values(
      BookingStatus
    ).includes(status as BookingStatus)
      ? (status as BookingStatus)
      : undefined;

    const where = {
      ...(validStatus
        ? { status: validStatus }
        : {}),

      ...(search
        ? {
            OR: [
              {
                bookingNumber: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                vehicleNumber: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                customer: {
                  name: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
              },
              {
                mechanic: {
                  name: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [bookings, total] =
      await Promise.all([
        prisma.booking.findMany({
          where,
          skip,
          take: limit,

          include: {
            customer: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },

            mechanic: {
              select: {
                id: true,
                name: true,
                status: true,
              },
            },

            service: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
          },

          orderBy: {
            scheduledAt: "desc",
          },
        }),

        prisma.booking.count({
          where,
        }),
      ]);

    res.json({
      success: true,

      data: bookings,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(
          total / limit
        ),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getBookingById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bookingId = getBookingId(req);

    const booking =
      await prisma.booking.findUnique({
        where: {
          id: bookingId,
        },

        include: {
          customer: true,
          mechanic: true,
          service: true,
        },
      });

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });

      return;
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateBookingStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bookingId = getBookingId(req);

    const { status } = req.body;

    if (
      typeof status !== "string" ||
      !Object.values(BookingStatus).includes(
        status as BookingStatus
      )
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });

      return;
    }

    const booking =
      await prisma.booking.findUnique({
        where: {
          id: bookingId,
        },
      });

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });

      return;
    }

    const bookingStatus =
      status as BookingStatus;

    const updatedBooking =
      await prisma.booking.update({
        where: {
          id: bookingId,
        },

        data: {
          status: bookingStatus,

          completedAt:
            bookingStatus ===
            BookingStatus.COMPLETED
              ? new Date()
              : booking.completedAt,
        },

        include: {
          customer: true,
          mechanic: true,
          service: true,
        },
      });

    res.json({
      success: true,
      data: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
}