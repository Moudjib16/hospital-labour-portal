import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const TARGET_PATIENTS = 60;
const TARGET_REPORTS = 85;

const OPERATORS = [
  "Dr. Brahim Kacem",
  "Dr. Yasmine Belhadi",
  "Dr. Salim Benhamou",
  "Pr. Djamel Mesbah",
];

const BLOOD_TYPES = ["O_POS", "O_NEG", "A_POS", "A_NEG", "B_POS", "B_NEG", "AB_POS", "AB_NEG"] as const;
const OPERATION_TYPES = ["CESARIAN", "OPERATION_PROGRAMME"] as const;

const FIRST_NAMES = [
  "Amina", "Fatima", "Yasmina", "Khadidja", "Meriem", "Sofia", "Nadia",
  "Rym", "Lina", "Houda", "Sabrina", "Sara", "Imane", "Nesrine", "Wissam",
  "Aya", "Hadjer", "Nour", "Chaima", "Rania", "Ikram", "Manel", "Dounia",
  "Assia", "Zohra", "Karima", "Samia", "Bouchra", "Nabila", "Lamia",
];

const LAST_NAMES = [
  "Bouzid", "Merabet", "Hamidi", "Benali", "Cherif", "Saidi", "Khelifi",
  "Bouaziz", "Guerbal", "Ayachi", "Mansouri", "Benamara", "Slimani", "Zerrouki",
  "Boudiaf", "Meziane", "Hadjadj", "Touati", "Belkacem", "Ould Ali", "Rahmani",
  "Brahimi", "Chenouf", "Dahmani", "Guedda", "Hamdi", "Aouadi", "Zaidi",
];

const BIRTHPLACES = ["Mila", "Tadjenanet", "Guerouaou", "Sidi Merouane", "Gravia", "Oued El Athmane", "Teleghma", "Mila Centre"];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: readonly T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

function makeDescription(op: (typeof OPERATION_TYPES)[number]): string {
  const base =
    "Patiente admise au service de Gynécologie Obstétrique, dossier suivi en consultation prénatale. " +
    "Bilan pré-opératoire complet et valide (groupage, NFS, hémostase). " +
    "Consentement éclairé signé. Antiseptie large et mise en place d'une voie veineuse périphérique. ";

  if (op === "CESARIAN") {
    return (
      base +
      "Césarienne en urgence décidée devant un syndrome d'apnée fœtale (RCF pathologique). " +
      "Rachianesthésie réalisée. Incision de Pfannenstiel, hystérotomie segmentaire transversale arciforme (HSTA). " +
      "Extraction sans difficulté d'un nouveau-né vivant, Apgar 9/10. " +
      "Délivrance artificielle et révision utérine (DA + RU). " +
      "Réfection de l'hystérotomie par surjet simple extra-muqueux. Hémostase assurée. " +
      "Toilette péritonéale, fermeture pariétale plan par plan. Suites simples."
    );
  }

  // OPERATION_PROGRAMME
  return (
    base +
    "Opération programmée pour présentation par le siège. Rachianesthésie réalisée. " +
    "Incision de Pfannenstiel, hystérotomie segmentaire transversale arciforme (HSTA). " +
    "Extraction podalique d'un enfant vivant, Apgar 9/10. " +
    "Délivrance artificielle et révision utérine (DA + RU). " +
    "Réfection de l'hystérotomie par surjet simple extra-muqueux. Hémostase assurée. " +
    "Toilette péritonéale au sérum physiologique, fermeture pariétale plan par plan. Suites simples."
  );
}

function makePostOp(): string {
  return "Suites simples, sortie à J+3. Surveillance de la cicatrice à J+7.";
}

function makeComplications(): string | null {
  const r = Math.random();
  if (r < 0.7) return "Aucune";
  if (r < 0.85) return "Atonie utérine, corrigée par UTN.";
  return "HTA pré-éclamptique, surveillance rapprochée.";
}

async function main() {
  const passwordHash = await hash("admin123", 12);

  // ── Users ────────────────────────────────────────────────
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
  console.log(`✔ Admin user ready: ${admin.username}`);

  const doctorData = [
    { username: "b.kacem", name: "Dr. Brahim Kacem" },
    { username: "y.belhadi", name: "Dr. Yasmine Belhadi" },
  ];
  const doctors = [];
  for (const d of doctorData) {
    const u = await prisma.user.upsert({
      where: { username: d.username },
      update: {},
      create: {
        username: d.username,
        name: d.name,
        passwordHash,
        role: "DOCTOR",
      },
    });
    doctors.push(u);
    console.log(`✔ Doctor ready: ${u.username}`);
  }

  // ── Patients ─────────────────────────────────────────────
  // Base demo patients (kept stable across runs)
  const demoPatients = [
    {
      firstName: "Amina",
      lastName: "Bouzid",
      age: 31,
      nationality: "Algérienne",
      bloodType: "O_POS" as const,
      birthPlace: "Mila",
      medicalHistory: "Aucun antécédent notable.",
    },
    {
      firstName: "Yacine",
      lastName: "Merabet",
      age: 36,
      nationality: "Algérienne",
      bloodType: "A_NEG" as const,
      birthPlace: "Tadjenanet",
      medicalHistory: "Asthmatique, hypertension légère.",
    },
    {
      firstName: "Sofia",
      lastName: "Hamidi",
      age: 27,
      nationality: "Algérienne",
      bloodType: "AB_POS" as const,
      birthPlace: "Guerouaou",
      medicalHistory: "Antécédent de césarienne.",
    },
  ];

  const existingPatients = await prisma.patient.findMany({
    select: { firstName: true, lastName: true },
  });
  const namePairs = new Set<string>(
    existingPatients.map((p) => `${p.firstName}|${p.lastName}`)
  );

  let patientsCreated = 0;
  for (const p of demoPatients) {
    const key = `${p.firstName}|${p.lastName}`;
    if (namePairs.has(key)) continue;
    namePairs.add(key);
    await prisma.patient.create({ data: p });
    patientsCreated++;
  }

  const patientCount = await prisma.patient.count();
  while (patientCount + patientsCreated < TARGET_PATIENTS) {
    const f = pick(FIRST_NAMES);
    const l = pick(LAST_NAMES);
    const key = `${f}|${l}`;
    if (namePairs.has(key)) continue;
    namePairs.add(key);
    await prisma.patient.create({
      data: {
        firstName: f,
        lastName: l,
        age: randomInt(18, 44),
        nationality: "Algérienne",
        bloodType: pick(BLOOD_TYPES),
        birthPlace: pick(BIRTHPLACES),
        medicalHistory: Math.random() < 0.3 ? "Antécédent de césarienne." : null,
      },
    });
    patientsCreated++;
  }
  console.log(`✔ Patients ready (added ${patientsCreated}, total target ${TARGET_PATIENTS})`);

  // ── Labour Reports ───────────────────────────────────────
  const reportCount = await prisma.labourReport.count();
  const allPatients = await prisma.patient.findMany({
    select: { id: true, firstName: true, lastName: true, age: true, nationality: true, bloodType: true },
    take: TARGET_PATIENTS,
  });
  let reportsCreated = 0;
  let guard = 0;
  while (reportCount + reportsCreated < TARGET_REPORTS && guard < 1000) {
    guard++;
    const patient = pick(allPatients);
    const op = pick(OPERATION_TYPES);
    const operator = pick(OPERATORS);
    const doctor = Math.random() < 0.5 ? doctors[0] : doctors[1];
    // Spread delivery dates over the last ~9 months
    const daysAgo = randomInt(0, 270);
    const deliveryDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    const existing = await prisma.labourReport.findFirst({
      where: {
        patientId: patient.id,
        deliveryDate: { equals: deliveryDate },
      },
    });
    if (existing) continue;

    await prisma.labourReport.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        age: patient.age,
        nationality: patient.nationality,
        bloodType: patient.bloodType,
        operationType: op,
        deliveryDate,
        operatorFullName: operator,
        anesthesiologistFullName: pick([
          "Dr. Salim Benhamou",
          "Dr. Nadia Cherifi",
          "Dr. Karim Boudraa",
          "Dr. Leila Haddad",
        ]),
        complications: makeComplications(),
        fullDescription: makeDescription(op),
        postOpNotes: makePostOp(),
      },
    });
    reportsCreated++;
  }
  console.log(`✔ Reports ready (added ${reportsCreated}, total target ${TARGET_REPORTS})`);

  console.log("Seed complete.");
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
