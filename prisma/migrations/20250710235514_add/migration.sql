/*
  Warnings:

  - You are about to drop the column `folderName` on the `folders` table. All the data in the column will be lost.
  - Added the required column `file_name` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `folder_name` to the `folders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "files" ADD COLUMN     "file_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "folders" DROP COLUMN "folderName",
ADD COLUMN     "folder_name" TEXT NOT NULL;
