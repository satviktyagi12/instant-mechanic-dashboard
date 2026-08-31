import "dotenv/config";
import {
  PrismaClient,
  BookingStatus,
  MechanicStatus,
} from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { faker } from "@faker-js/faker";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

// --------------------------------------------------
// SERVICES
// --------------------------------------------------

const services = [
  {
    name: "Full Car Service",
    category: "Maintenance",
    basePrice: 2499,
  },
  {
    name: "Oil Change",
    category: "Maintenance",
    basePrice: 899,
  },
  {
    name: "Brake Inspection",
    category: "Inspection",
    basePrice: 699,
  },
  {
    name: "Brake Pad Replacement",
    category: "Repair",
    basePrice: 2499,
  },
  {
    name: "Battery Replacement",
    category: "Battery",
    basePrice: 3999,
  },
  {
    name: "AC Service",
    category: "Maintenance",
    basePrice: 1499,
  },
  {
    name: "AC Repair",
    category: "Repair",
    basePrice: 2999,
  },
  {
    name: "Engine Diagnostics",
    category: "Inspection",
    basePrice: 1199,
  },
  {
    name: "Tyre Replacement",
    category: "Tyres",
    basePrice: 4999,
  },
  {
    name: "Wheel Alignment",
    category: "Tyres",
    basePrice: 799,
  },
  {
    name: "Wheel Balancing",
    category: "Tyres",
    basePrice: 599,
  },
  {
    name: "Car Cleaning",
    category: "Cleaning",
    basePrice: 699,
  },
  {
    name: "Emergency Breakdown",
    category: "Emergency",
    basePrice: 1999,
  },
  {
    name: "General Inspection",
    category: "Inspection",
    basePrice: 499,
  },
  {
    name: "Denting & Painting",
    category: "Repair",
    basePrice: 5999,
  },
];

// --------------------------------------------------
// VEHICLES
// --------------------------------------------------

const vehicleData = [
  ["Maruti", "Swift"],
  ["Maruti", "Baleno"],
  ["Maruti", "Brezza"],
  ["Hyundai", "Creta"],
  ["Hyundai", "i20"],
  ["Hyundai", "Venue"],
  ["Tata", "Nexon"],
  ["Tata", "Punch"],
  ["Tata", "Harrier"],
  ["Mahindra", "XUV700"],
  ["Mahindra", "Thar"],
  ["Honda", "City"],
  ["Honda", "Amaze"],
  ["Toyota", "Fortuner"],
  ["Toyota", "Innova"],
  ["Toyota", "Urban Cruiser"],
  ["Kia", "Seltos"],
  ["Kia", "Sonet"],
  ["Volkswagen", "Virtus"],
  ["Skoda", "Slavia"],
];

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function randomDate(start: Date, end: Date): Date {
  return faker.date.between({
    from: start,
    to: end,
  });
}

function generateVehicleNumber(): string {
  const states = ["DL", "HR", "UP", "RJ", "MH"];

  const state = faker.helpers.arrayElement(states);
  const district = faker.string.numeric(2);
  const letters = faker.string.alpha({
    length: 2,
    casing: "upper",
  });
  const digits = faker.string.numeric(4);

  return `${state}-${district}-${letters}-${digits}`;
}

function getRandomBookingStatus(): BookingStatus {
  const random = Math.random();

  if (random < 0.08) {
    return BookingStatus.PENDING;
  }

  if (random < 0.18) {
    return BookingStatus.ASSIGNED;
  }

  if (random < 0.28) {
    return BookingStatus.MECHANIC_ON_THE_WAY;
  }

  if (random < 0.38) {
    return BookingStatus.IN_PROGRESS;
  }

  if (random < 0.9) {
    return BookingStatus.COMPLETED;
  }

  return BookingStatus.CANCELLED;
}

function getRandomMechanicStatus(): MechanicStatus {
  const random = Math.random();

  if (random < 0.5) {
    return MechanicStatus.AVAILABLE;
  }

  if (random < 0.75) {
    return MechanicStatus.BUSY;
  }

  if (random < 0.9) {
    return MechanicStatus.OFFLINE;
  }

  return MechanicStatus.ON_BREAK;
}

function getTodayBookingDate(): Date {
  const now = new Date();

  const start = new Date(now);
  start.setHours(8, 0, 0, 0);

  const end = new Date(now);

  // Keep generated times between 8 AM and current time.
  if (now.getHours() >= 8) {
    end.setMinutes(
      Math.max(0, now.getMinutes() - 5)
    );
  } else {
    end.setHours(8, 30, 0, 0);
  }

  return randomDate(start, end);
}

// --------------------------------------------------
// MAIN
// --------------------------------------------------

async function main(): Promise<void> {
  console.log("🌱 Starting database seed...");

  // ------------------------------------------------
  // CLEAR EXISTING DATA
  // ------------------------------------------------

  await prisma.booking.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.mechanic.deleteMany();
  await prisma.service.deleteMany();

  console.log("🧹 Existing data cleared");

  // ------------------------------------------------
  // SERVICES
  // ------------------------------------------------

  const createdServices = await Promise.all(
    services.map((service) =>
      prisma.service.create({
        data: {
          name: service.name,
          category: service.category,
          description: `Professional ${service.name.toLowerCase()} service`,
          basePrice: service.basePrice,
        },
      })
    )
  );

  console.log(
    `🔧 Created ${createdServices.length} services`
  );

  // ------------------------------------------------
  // CUSTOMERS
  // ------------------------------------------------

  const customers: Array<
    Awaited<ReturnType<typeof prisma.customer.create>>
  > = [];

  for (let i = 0; i < 100; i++) {
    const customer = await prisma.customer.create({
      data: {
        name: faker.person.fullName(),
        email: `customer${i + 1}@example.com`,
        phone: `9${faker.string.numeric(9)}`,
        address: `${faker.location.streetAddress()}, Delhi NCR`,
        createdAt: randomDate(
          new Date("2025-01-01"),
          new Date()
        ),
      },
    });

    customers.push(customer);
  }

  console.log(
    `👥 Created ${customers.length} customers`
  );

  // ------------------------------------------------
  // MECHANICS
  // ------------------------------------------------

  const mechanics: Array<
    Awaited<ReturnType<typeof prisma.mechanic.create>>
  > = [];

  for (let i = 0; i < 25; i++) {
    const mechanic = await prisma.mechanic.create({
      data: {
        name: faker.person.fullName(),
        email: `mechanic${i + 1}@instantmechanic.com`,
        phone: `9${faker.string.numeric(9)}`,
        status: getRandomMechanicStatus(),
        jobsCompleted: faker.number.int({
          min: 20,
          max: 250,
        }),
        latitude: faker.number.float({
          min: 28.4,
          max: 28.75,
          fractionDigits: 6,
        }),
        longitude: faker.number.float({
          min: 76.85,
          max: 77.35,
          fractionDigits: 6,
        }),
      },
    });

    mechanics.push(mechanic);
  }

  console.log(
    `👨‍🔧 Created ${mechanics.length} mechanics`
  );

  // ------------------------------------------------
  // COMPLETED JOB TRACKING
  // ------------------------------------------------

  const completedJobs = new Map<string, number>();

  for (const mechanic of mechanics) {
    completedJobs.set(
      mechanic.id,
      mechanic.jobsCompleted
    );
  }

  // ------------------------------------------------
  // BOOKINGS
  // ------------------------------------------------

  const bookings: Array<
    Awaited<ReturnType<typeof prisma.booking.create>>
  > = [];

  const totalBookings = 750;

  for (let i = 0; i < totalBookings; i++) {
    const customer =
      faker.helpers.arrayElement(customers);

    const service =
      faker.helpers.arrayElement(createdServices);

    const vehicle =
      faker.helpers.arrayElement(vehicleData);

    const isToday = i < 40;

    const scheduledAt = isToday
      ? getTodayBookingDate()
      : randomDate(
          new Date("2025-01-01"),
          new Date()
        );

    let status = getRandomBookingStatus();

    // Today/future bookings should not randomly
    // become completed before their scheduled time.
    if (scheduledAt > new Date()) {
      if (
        status === BookingStatus.COMPLETED ||
        status === BookingStatus.IN_PROGRESS
      ) {
        status = BookingStatus.PENDING;
      }
    }

    const shouldAssignMechanic =
      status !== BookingStatus.PENDING &&
      status !== BookingStatus.CANCELLED;

    const mechanic = shouldAssignMechanic
      ? faker.helpers.arrayElement(mechanics)
      : null;

    const amount = Math.round(
      service.basePrice *
        faker.number.float({
          min: 0.9,
          max: 1.35,
        })
    );

    let completedAt: Date | null = null;

    if (
      status === BookingStatus.COMPLETED &&
      scheduledAt < new Date()
    ) {
      completedAt = new Date(
        scheduledAt.getTime() +
          faker.number.int({
            min: 60,
            max: 240,
          }) *
            60 *
            1000
      );

      if (completedAt > new Date()) {
        completedAt = new Date();
      }
    }

    const booking = await prisma.booking.create({
      data: {
        bookingNumber: `IM-${String(i + 1).padStart(
          5,
          "0"
        )}`,

        customerId: customer.id,

        mechanicId: mechanic?.id ?? null,

        serviceId: service.id,

        vehicleMake: vehicle[0],
        vehicleModel: vehicle[1],
        vehicleNumber: generateVehicleNumber(),

        vehicleYear: faker.number.int({
          min: 2016,
          max: 2026,
        }),

        status,

        amount,

        scheduledAt,

        completedAt,

        createdAt: scheduledAt,
      },
    });

    bookings.push(booking);

    if (
      status === BookingStatus.COMPLETED &&
      mechanic
    ) {
      completedJobs.set(
        mechanic.id,
        (completedJobs.get(mechanic.id) ?? 0) + 1
      );
    }

    if ((i + 1) % 100 === 0) {
      console.log(
        `📋 Created ${i + 1}/${totalBookings} bookings`
      );
    }
  }

  // ------------------------------------------------
  // UPDATE MECHANIC JOB COUNTS
  // ------------------------------------------------

  await Promise.all(
    mechanics.map((mechanic) =>
      prisma.mechanic.update({
        where: {
          id: mechanic.id,
        },
        data: {
          jobsCompleted:
            completedJobs.get(mechanic.id) ?? 0,
        },
      })
    )
  );

  console.log("👨‍🔧 Updated mechanic job counts");

  // ------------------------------------------------
  // SUMMARY
  // ------------------------------------------------

  const [
    customerCount,
    mechanicCount,
    serviceCount,
    bookingCount,
    completedCount,
    pendingCount,
    cancelledCount,
    revenue,
  ] = await Promise.all([
    prisma.customer.count(),

    prisma.mechanic.count(),

    prisma.service.count(),

    prisma.booking.count(),

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
  ]);

  console.log("");
  console.log(
    "════════════════════════════════════"
  );
  console.log("        SEED COMPLETED 🎉");
  console.log(
    "════════════════════════════════════"
  );
  console.log(`👥 Customers:  ${customerCount}`);
  console.log(`👨‍🔧 Mechanics:  ${mechanicCount}`);
  console.log(`🔧 Services:   ${serviceCount}`);
  console.log(`📋 Bookings:   ${bookingCount}`);
  console.log(`✅ Completed:  ${completedCount}`);
  console.log(`⏳ Pending:    ${pendingCount}`);
  console.log(`❌ Cancelled:  ${cancelledCount}`);
  console.log(
    `💰 Revenue:    ₹${Math.round(
      revenue._sum.amount ?? 0
    ).toLocaleString("en-IN")}`
  );
  console.log(
    "════════════════════════════════════"
  );
}

main()
  .catch((error: unknown) => {
    console.error("❌ Seed failed:");
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });