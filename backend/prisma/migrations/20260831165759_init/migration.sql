-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'ASSIGNED', 'MECHANIC_ON_THE_WAY', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MechanicStatus" AS ENUM ('AVAILABLE', 'BUSY', 'OFFLINE', 'ON_BREAK');

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mechanic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" "MechanicStatus" NOT NULL DEFAULT 'AVAILABLE',
    "jobsCompleted" INTEGER NOT NULL DEFAULT 0,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mechanic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "bookingNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "mechanicId" TEXT,
    "serviceId" TEXT NOT NULL,
    "vehicleMake" TEXT NOT NULL,
    "vehicleModel" TEXT NOT NULL,
    "vehicleNumber" TEXT NOT NULL,
    "vehicleYear" INTEGER,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DOUBLE PRECISION NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE INDEX "Customer_createdAt_idx" ON "Customer"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Mechanic_email_key" ON "Mechanic"("email");

-- CreateIndex
CREATE INDEX "Mechanic_status_idx" ON "Mechanic"("status");

-- CreateIndex
CREATE INDEX "Service_category_idx" ON "Service"("category");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_bookingNumber_key" ON "Booking"("bookingNumber");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "Booking_scheduledAt_idx" ON "Booking"("scheduledAt");

-- CreateIndex
CREATE INDEX "Booking_createdAt_idx" ON "Booking"("createdAt");

-- CreateIndex
CREATE INDEX "Booking_customerId_idx" ON "Booking"("customerId");

-- CreateIndex
CREATE INDEX "Booking_mechanicId_idx" ON "Booking"("mechanicId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_mechanicId_fkey" FOREIGN KEY ("mechanicId") REFERENCES "Mechanic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
