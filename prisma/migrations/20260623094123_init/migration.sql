-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "imageUrl" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "preorders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "totalPrice" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "productId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    CONSTRAINT "preorders_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "preorders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");
