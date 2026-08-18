import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await hash("Admin@1234!", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@myevents.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@myevents.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  })

  console.log("Seeded admin user:", admin.email)
  console.log("Default password: Admin@1234!")
  console.log("IMPORTANT: Change this password after first login.")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
