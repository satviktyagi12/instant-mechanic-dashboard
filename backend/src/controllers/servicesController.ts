import {
    Request,
    Response,
    NextFunction,
  } from "express";
  
  import { prisma } from "../config/prisma";
  
  export async function getServices(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const services =
        await prisma.service.findMany({
          orderBy: {
            name: "asc",
          },
        });
  
      res.json({
        success: true,
        data: services,
      });
    } catch (error) {
      next(error);
    }
  }