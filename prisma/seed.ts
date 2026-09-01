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
      age: 31,
      dateOfBirth: new Date("1995-03-14"),
      nationality: "Algérienne",
      bloodType: "O_POS" as const,
      birthPlace: "Mila",
      medicalHistory: "Aucun antécédent notable.",
    },
    {
      nationalId: "223344556677",
      firstName: "Yacine",
      lastName: "Merabet",
      age: 36,
      dateOfBirth: new Date("1990-07-22"),
      nationality: "Algérienne",
      bloodType: "A_NEG" as const,
      birthPlace: "Tadjenanet",
      medicalHistory: "Asthmatique, hypertension légère.",
    },
    {
      nationalId: "334455667788",
      firstName: "Sofia",
      lastName: "Hamidi",
      age: 27,
      dateOfBirth: new Date("1998-11-02"),
      nationality: "Algérienne",
      bloodType: "AB_POS" as const,
      birthPlace: "Guerouaou",
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
      firstName: amina.firstName,
      lastName: amina.lastName,
      age: amina.age,
      nationality: amina.nationality,
      operationType: "NATURAL_DELIVERY",
      deliveryDate: new Date("2026-08-15"),
      operatorFullName: "Dr. Brahim Kacem",
      anesthesiologistFullName: "Dr. Salim Benhamou",
      complications: "Aucune",
      fullDescription:
        "Patiente âgée de 31 ans, primigeste, admise en salle de travail à terme sur grossesse spontanée. " +
        "Travail spontané d'une durée totale de 8 heures, dilatation complète atteinte progressivement. " +
        "Expulsion dirigée en position dorsale, sous analgésie péridurale. " +
        "Naissance d'un nouveau-né de sexe féminin en bonne adaptation à la vie extra-utérine, Score d'Apgar 9/10. " +
        "Délivrance naturelle complète, globe utérin correct, saignement minime. " +
        "Révision utérine non nécessaire. Périmètre placentaire intact. " +
        "Suites immédiates simples, retour de la patiente en salle d'hospitalisation sans incident.",
      postOpNotes: "Suites simples, sortie à J+2.",
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