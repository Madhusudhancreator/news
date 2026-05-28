import { PrismaNeonHTTP } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  // During `next build`, DATABASE_URL may not be present.
  // Create a standard PrismaClient so the import doesn't crash the build.
  // Any actual query at build time will fail, but static analysis passes.
  if (!connectionString) {
    return new PrismaClient()
  }
  const adapter = new PrismaNeonHTTP(connectionString, {} as any)
  return new PrismaClient({ adapter } as any)
}

const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
