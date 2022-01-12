-- CreateTable
CREATE TABLE "BlacklistedUser" (
    "id" TEXT NOT NULL,
    "epicId" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    "endDate" BIGINT NOT NULL,

    CONSTRAINT "BlacklistedUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlacklistLeaderboard" (
    "id" TEXT NOT NULL,
    "numberOfBlacklist" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "BlacklistLeaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListOfTicketCategories" (
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ListOfTicketCategories_pkey" PRIMARY KEY ("categoryId")
);
