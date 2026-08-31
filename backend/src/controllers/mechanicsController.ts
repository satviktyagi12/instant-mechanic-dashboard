import {
    Request,
    Response,
    NextFunction,
  } from "express";
  
  import {
    BookingStatus,
  } from "../generated/prisma/client";
  
  import { prisma } from "../config/prisma";
  
  export async function getMechanics(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const mechanics =
        await prisma.mechanic.findMany({
          include: {
            bookings: {
              where: {
                status: {
                  in: [
                    BookingStatus.ASSIGNED,
                    BookingStatus.MECHANIC_ON_THE_WAY,
                    BookingStatus.IN_PROGRESS,
                  ],
                },
              },
  
              include: {
                customer: {
                  select: {
                    name: true,
                  },
                },
  
                service: {
                  select: {
                    name: true,
                  },
                },
              },
  
              orderBy: {
                scheduledAt: "desc",
              },
  
              take: 1,
            },
          },
  
          orderBy: {
            name: "asc",
          },
        });
  
      res.json({
        success: true,
        data: mechanics.map((mechanic) => ({
          id: mechanic.id,
          name: mechanic.name,
          email: mechanic.email,
          phone: mechanic.phone,
          status: mechanic.status,
          jobsCompleted:
            mechanic.jobsCompleted,
          latitude: mechanic.latitude,
          longitude: mechanic.longitude,
  
          currentBooking:
            mechanic.bookings[0] ?? null,
        })),
      });
    } catch (error) {
      next(error);
    }
  }