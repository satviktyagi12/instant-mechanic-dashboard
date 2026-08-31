import {
    Request,
    Response,
    NextFunction,
  } from "express";
  
  import { prisma } from "../config/prisma";
  
  export async function getCustomers(
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
          Number(req.query.limit) || 20,
          1
        ),
        100
      );
  
      const search =
        typeof req.query.search === "string"
          ? req.query.search.trim()
          : "";
  
      const skip = (page - 1) * limit;
  
      const where = search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                phone: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {};
  
      const [customers, total] =
        await Promise.all([
          prisma.customer.findMany({
            where,
            skip,
            take: limit,
  
            include: {
              _count: {
                select: {
                  bookings: true,
                },
              },
            },
  
            orderBy: {
              createdAt: "desc",
            },
          }),
  
          prisma.customer.count({
            where,
          }),
        ]);
  
      res.json({
        success: true,
  
        data: customers.map((customer) => ({
          ...customer,
          bookingsCount:
            customer._count.bookings,
          _count: undefined,
        })),
  
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