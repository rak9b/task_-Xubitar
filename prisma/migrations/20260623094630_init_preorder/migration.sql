/*
  Warnings:

  - You are about to drop the `customers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `customerId` on the `preorders` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `preorders` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `preorders` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `preorders` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `preorders` table. All the data in the column will be lost.
  - Added the required column `name` to the `preorders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preorderWhen` to the `preorders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startsAt` to the `preorders` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "customers_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "customers";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "products";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_preorders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "productCount" INTEGER NOT NULL DEFAULT 1,
    "preorderWhen" TEXT NOT NULL,
    "startsAt" DATETIME NOT NULL,
    "endsAt" DATETIME,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_preorders" ("createdAt", "id", "status", "updatedAt") SELECT "createdAt", "id", "status", "updatedAt" FROM "preorders";
DROP TABLE "preorders";
ALTER TABLE "new_preorders" RENAME TO "preorders";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
