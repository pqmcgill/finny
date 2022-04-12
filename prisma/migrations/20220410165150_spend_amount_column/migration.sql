-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Spend" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memo" TEXT NOT NULL,
    "amount" REAL NOT NULL DEFAULT 0.00,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Spend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Spend" ("createdAt", "id", "memo", "updatedAt", "userId") SELECT "createdAt", "id", "memo", "updatedAt", "userId" FROM "Spend";
DROP TABLE "Spend";
ALTER TABLE "new_Spend" RENAME TO "Spend";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
