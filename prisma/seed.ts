import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await hash("admin123", 12);

  // Admin
  const admin = await prisma.user.upsert({
    where: { username: "azerrougue" },
    update: {},
    create: {
      username: "azerrougue",
      name: "Abdelmoudjib Admin",
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`✔ Admin user created: ${admin.username}`);

  // Doctors
  const doctor1 = await prisma.user.upsert({
    where: { username: "b.kacem" },
    update: {},
    create: {
      username: "b.kacem",
      name: "Dr. Brahim Kacem",
      passwordHash,
      role: "DOCTOR",
    },
  });
  const doctor2 = await prisma.user.upsert({
    where: { username: "y.belhadi" },
    update: {},
    create: {
      username: "y.belhadi",
      name: "Dr. Yasmine Belhadi",
      passwordHash,
      role: "DOCTOR",
    },
  });
  console.log(`✔ Doctors created: ${doctor1.username}, ${doctor2.username}`);

  // Patients (Mila province, Algeria — French/Algerian names)
  const patients = [
    {
      nationalId: "112233445566",
      firstName: "Amina",
      lastName: "Bouzid",
      dateOfBirth: new Date("1995-03-14"),
      bloodType: "O_POS" as const,
      birthPlace: "Mila",
      address: "Cité des Frères Benal, Mila",
      medicalHistory: "Aucun antécédent notable.",
    },
    {
      nationalId: "223344556677",
      firstName: "Yacine",
      lastName: "Merabet",
      dateOfBirth: new Date("1990-07-22"),
      bloodType: "A_NEG" as const,
      birthPlace: "Tadjenanet",
      address: "Rue du 1er Novembre, Tadjenanet, Mila",
      medicalHistory: "Asthmatique, hypertension légère.",
    },
    {
      nationalId: "334455667788",
      firstName: "Sofia",
      lastName: "Hamidi",
      dateOfBirth: new Date("1998-11-02"),
      bloodType: "AB_POS" as const,
      birthPlace: "Guerouaou",
      address: "Cité El Badr, Guerouaou, Mila",
      medicalHistory: "Antécédent de césarienne.",
    },
  ];

  for (const p of patients) {
    await prisma.patient.upsert({
      where: { nationalId: p.nationalId },
      update: {},
      create: p,
    });
  }

  const amina = await prisma.patient.findUniqueOrThrow({
    where: { nationalId: "112233445566" },
  });
  console.log(`✔ Patients created (first: ${amina.firstName} ${amina.lastName})`);

  // Sample finalized labour report linking a patient to a doctor
  await prisma.labourReport.create({
    data: {
      patientId: amina.id,
      doctorId: doctor1.id,
      deliveryType: "NATURAL",
      deliveryDate: new Date("2026-08-15"),
      complications: "Aucune",
      babyWeightGrams: 3350,
      babyGender: "Féminin",
      postOpNotes: "Suites simples, sortie à J+2.",
      status: "FINAL",
    },
  });
  console.log("✔ Sample labour report created");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
