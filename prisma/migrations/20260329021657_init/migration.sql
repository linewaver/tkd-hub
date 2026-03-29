-- CreateTable
CREATE TABLE "Studio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'US',
    "phone" TEXT,
    "email" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'America/New_York',
    "logoUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STUDIO_OWNER',
    "supabaseUserId" TEXT,
    "studioId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "Studio" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studioId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" DATETIME,
    "email" TEXT,
    "phone" TEXT,
    "beltRank" TEXT NOT NULL DEFAULT 'WHITE',
    "enrollmentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,
    "notes" TEXT,
    "photoUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Member_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "Studio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ParentStudent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parentId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ParentStudent_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ParentStudent_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "checkInTime" DATETIME,
    "checkOutTime" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PRESENT',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Attendance_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Attendance_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "Studio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BeltPromotion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "fromBelt" TEXT NOT NULL,
    "toBelt" TEXT NOT NULL,
    "testDate" DATETIME NOT NULL,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BeltPromotion_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BeltPromotion_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "Studio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'UNPAID',
    "description" TEXT,
    "dueDate" DATETIME,
    "paidDate" DATETIME,
    "stripePaymentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Payment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Payment_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "Studio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_supabaseUserId_key" ON "User"("supabaseUserId");

-- CreateIndex
CREATE INDEX "User_studioId_idx" ON "User"("studioId");

-- CreateIndex
CREATE INDEX "Member_studioId_idx" ON "Member"("studioId");

-- CreateIndex
CREATE INDEX "Member_studioId_status_idx" ON "Member"("studioId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ParentStudent_parentId_memberId_key" ON "ParentStudent"("parentId", "memberId");

-- CreateIndex
CREATE INDEX "Attendance_studioId_date_idx" ON "Attendance"("studioId", "date");

-- CreateIndex
CREATE INDEX "Attendance_memberId_idx" ON "Attendance"("memberId");

-- CreateIndex
CREATE INDEX "BeltPromotion_studioId_idx" ON "BeltPromotion"("studioId");

-- CreateIndex
CREATE INDEX "BeltPromotion_memberId_idx" ON "BeltPromotion"("memberId");

-- CreateIndex
CREATE INDEX "Payment_studioId_idx" ON "Payment"("studioId");

-- CreateIndex
CREATE INDEX "Payment_studioId_status_idx" ON "Payment"("studioId", "status");

-- CreateIndex
CREATE INDEX "Payment_memberId_idx" ON "Payment"("memberId");
