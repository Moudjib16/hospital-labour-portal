import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { OperationType } from "@/generated/prisma/enums";

export const REPORT_PAGE_SIZE = 20;
export const PATIENT_PAGE_SIZE = 20;

export type ReportSearchResult = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  operationType: OperationType;
  deliveryDate: Date;
  operatorFullName: string;
  snippet: string | null;
};

export type ReportSearchResponse = {
  results: ReportSearchResult[];
  total: number;
  totalPages: number;
};

function emptyResponse(): ReportSearchResponse {
  return { results: [], total: 0, totalPages: 1 };
}

// Static SQL fragment (safe to inline — no user input)
const SEARCHABLE_TEXT = `
  COALESCE(r."fullDescription", '') || ' ' ||
  COALESCE(r."complications", '') || ' ' ||
  COALESCE(r."postOpNotes", '')
`;

const HEADLINE_TEXT = `
  COALESCE(r."fullDescription", '') || ' ' ||
  COALESCE(r."complications", '') || ' ' ||
  COALESCE(r."postOpNotes", '')
`;

function cleanTerms(query: string): string[] {
  return query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter(Boolean);
}

export async function searchReports(
  query: string,
  page: number
): Promise<ReportSearchResponse> {
  const q = query.trim();
  if (!q) return emptyResponse();

  const terms = cleanTerms(q);
  if (terms.length === 0) return emptyResponse();
  const tsQuery = terms.join(" & ");

  const vectorSql = `to_tsvector('french', ${SEARCHABLE_TEXT})`;
  const headlineSql = `ts_headline('french', ${HEADLINE_TEXT}, plainto_tsquery('french', $1), 'StartSel=<mark>, StopSel=</mark>, MaxWords=25, MinWords=12, ShortWord=3')`;

  const countRows = (await db.$queryRawUnsafe(
    `SELECT COUNT(*)::int AS total
     FROM "LabourReport" r
     WHERE ${vectorSql} @@ plainto_tsquery('french', $1)`,
    tsQuery
  )) as { total: number }[];

  const total = countRows[0]?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / REPORT_PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const offset = (current - 1) * REPORT_PAGE_SIZE;

  const rows = (await db.$queryRawUnsafe(
    `SELECT
       r."id",
       r."firstName",
       r."lastName",
       r."age",
       r."operationType",
       r."deliveryDate",
       r."operatorFullName",
       ts_rank_cd(${vectorSql}, plainto_tsquery('french', $1)) AS rank,
       ${headlineSql} AS snippet
     FROM "LabourReport" r
     WHERE ${vectorSql} @@ plainto_tsquery('french', $1)
     ORDER BY rank DESC, r."createdAt" DESC
     LIMIT $2 OFFSET $3`,
    tsQuery,
    REPORT_PAGE_SIZE,
    offset
  )) as Array<Record<string, unknown>>;

  const results: ReportSearchResult[] = rows.map((row) => ({
    id: String(row.id),
    firstName: String(row.firstName ?? ""),
    lastName: String(row.lastName ?? ""),
    age: Number(row.age),
    operationType: row.operationType as OperationType,
    deliveryDate: new Date(row.deliveryDate as string | Date),
    operatorFullName: String(row.operatorFullName ?? ""),
    snippet: row.snippet ? String(row.snippet) : null,
  }));

  return { results, total, totalPages };
}

export type PatientSearchResult = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  nationality: string;
  reportCount: number;
};

export type PatientSearchResponse = {
  results: PatientSearchResult[];
  total: number;
  totalPages: number;
};

function emptyPatientResponse(): PatientSearchResponse {
  return { results: [], total: 0, totalPages: 1 };
}

export async function searchPatients(
  query: string,
  page: number
): Promise<PatientSearchResponse> {
  const q = query.trim();
  if (!q) return emptyPatientResponse();

  const where: Prisma.PatientWhereInput = {
    OR: [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { nationality: { contains: q, mode: "insensitive" } },
      { birthPlace: { contains: q, mode: "insensitive" } },
      { medicalHistory: { contains: q, mode: "insensitive" } },
    ],
  };

  const total = await db.patient.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PATIENT_PAGE_SIZE));
  const current = Math.min(page, totalPages);

  const patients = await db.patient.findMany({
    where,
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    include: { _count: { select: { reports: true } } },
    skip: (current - 1) * PATIENT_PAGE_SIZE,
    take: PATIENT_PAGE_SIZE,
  });

  const results: PatientSearchResult[] = patients.map((p) => ({
    id: p.id,
    firstName: p.firstName,
    lastName: p.lastName,
    age: p.age,
    nationality: p.nationality,
    reportCount: p._count.reports,
  }));

  return { results, total, totalPages };
}