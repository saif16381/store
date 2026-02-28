import { db } from "./db";
import { users } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");
  
  // Create a default admin user and a test seller
  const adminExists = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, "admin@pakstore.com")
  });

  if (!adminExists) {
    await db.insert(users).values({
      email: "admin@pakstore.com",
      password: "password123", // For testing only
      displayName: "Admin User",
      role: "admin",
    });
    console.log("Admin user created.");
  }

  const sellerExists = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, "seller@pakstore.com")
  });

  if (!sellerExists) {
    await db.insert(users).values({
      email: "seller@pakstore.com",
      password: "password123", // For testing only
      displayName: "Test Seller",
      role: "seller",
      storeId: "store_1"
    });
    console.log("Seller user created.");
  }

  console.log("Database seeded successfully!");
}

seed().catch(console.error).finally(() => process.exit(0));