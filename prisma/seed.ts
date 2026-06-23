import { prisma } from "../src/lib/prisma";

const PRODUCT_TITLES = [
  "iPhone 15 Pro Max Silicon Case",
  "UltraWide 34\" Curved Gaming Monitor",
  "Mechanical Keyboard Blue Switches",
  "Ergonomic Mesh Office Chair",
  "Noise Cancelling Wireless Headphones",
  "Smart Fitness Watch Series 9",
  "Portable SSD 2TB USB-C",
  "Dual-Device Wireless Charger Pad",
  "4K Ultra HD Dash Cam with GPS",
  "Premium Leather Laptop Sleeve 14\"",
  "Compact Espresso Machine 15-Bar",
  "Cold Brew Coffee Maker 1L",
  "Stainless Steel Water Bottle 32oz",
  "Aerodynamic Road Bike Helmet",
  "Yoga Mat Non-Slip Eco-Friendly",
  "Adjustable Dumbbell Set 50lbs",
  "Smart LED Light Strip 10m",
  "Wi-Fi 6 Mesh Router 3-Pack",
  "Vlogging Camera with Flip Screen",
  "Professional Condenser Microphone",
];

const CUSTOMER_NAMES = [
  "James Smith", "Michael Brown", "Robert Jones", "Maria Garcia", "David Miller",
  "William Davis", "Linda Rodriguez", "Elizabeth Martinez", "Barbara Hernandez", "Susan Lopez",
  "Jessica Gonzalez", "Sarah Wilson", "Karen Anderson", "Nancy Thomas", "Lisa Taylor",
  "Betty Moore", "Margaret Jackson", "Sandra Martin", "Ashley Lee", "Kimberly Perez",
  "Emily Thompson", "Donna White", "Michelle Harris", "Carol Sanchez", "Amanda Clark",
  "Dorothy Ramirez", "Patricia Lewis", "John Robinson", "Thomas Walker", "Stephen Young",
  "Paul Allen", "Mark King", "Donald Wright", "George Scott", "Kenneth Green",
  "Steven Baker", "Edward Adams", "Brian Nelson", "Ronald Hill", "Timothy Ramirez",
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSku(title: string): string {
  const prefix = title.split(" ").map(w => w.substring(0, 2).toUpperCase()).join("");
  const randNum = getRandomNumber(100, 999);
  return `${prefix}-${randNum}`;
}

async function main() {
  console.log("Cleaning up existing preorders...");
  await prisma.preorder.deleteMany({});

  console.log("Seeding 50 preorders...");
  for (let i = 0; i < 50; i++) {
    const title = getRandomItem(PRODUCT_TITLES);
    const sku = generateSku(title);
    const customer = getRandomItem(CUSTOMER_NAMES);
    const quantity = getRandomNumber(1, 5);
    // Price between 9.99 and 599.99
    const price = (getRandomNumber(999, 59999) / 100).toFixed(2);
    const description = `Preorder for ${customer}. Expected shipping by end of next month.`;
    const active = Math.random() > 0.3; // 70% active, 30% inactive
    
    // Distribute creation dates over the last 30 days
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - getRandomNumber(0, 30));

    await prisma.preorder.create({
      data: {
        title,
        sku,
        customer,
        quantity,
        price,
        description,
        active,
        createdAt,
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
