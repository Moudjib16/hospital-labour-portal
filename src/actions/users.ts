"use server";

import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Role } from "@/generated/prisma/enums";

export type UserFormState = {
  error?: string;
  success?: boolean;
};

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isRole(value: string): value is Role {
  return (Object.values(Role) as string[]).includes(value);
}

async function requireAdmin(): Promise<{ error: UserFormState } | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: { error: "Votre session a expiré, veuillez vous reconnecter." } };
  }
  if (session.user.role !== "ADMIN") {
    return { error: { error: "Accès réservé aux administrateurs." } };
  }
  return null;
}

async function parseActiveAdmins(): Promise<string[]> {
  const admins = await db.user.findMany({
    where: { role: "ADMIN", isActive: true },
    select: { id: true },
  });
  return admins.map((admin) => admin.id);
}

export async function createUser(
  _prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const denied = await requireAdmin();
  if (denied) {
    return denied.error;
  }

  const username = getString(formData, "username");
  const name = getString(formData, "name");
  const password = getString(formData, "password");
  const role = getString(formData, "role");

  if (!username || !name || !password) {
    return { error: "Veuillez renseigner tous les champs obligatoires." };
  }
  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }
  if (!isRole(role)) {
    return { error: "Rôle invalide." };
  }

  const existing = await db.user.findUnique({ where: { username } });
  if (existing) {
    return { error: "Ce nom d'utilisateur est déjà utilisé." };
  }

  const passwordHash = await hash(password, 12);

  await db.user.create({
    data: { username, name, passwordHash, role },
  });

  revalidatePath("/parametres");
  return { success: true };
}

export async function updateUser(
  _prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const denied = await requireAdmin();
  if (denied) {
    return denied.error;
  }

  const id = getString(formData, "id");
  if (!id) {
    return { error: "Utilisateur introuvable." };
  }

  const session = await auth();
  const currentUserId = session?.user?.id;

  const user = await db.user.findUnique({ where: { id } });
  if (!user) {
    return { error: "Utilisateur introuvable." };
  }

  const name = getString(formData, "name");
  const role = getString(formData, "role");
  const password = getString(formData, "password");

  if (!name || !isRole(role)) {
    return { error: "Veuillez renseigner un nom et un rôle valides." };
  }

  if (id === currentUserId && role !== user.role) {
    return { error: "Vous ne pouvez pas modifier votre propre rôle." };
  }

  if (password && password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  if (
    user.role === "ADMIN" &&
    role !== "ADMIN" &&
    (await parseActiveAdmins()).filter((adminId) => adminId !== id).length === 0
  ) {
    return { error: "Impossible de rétrograder le dernier administrateur actif." };
  }

  const data: { name: string; role: Role; passwordHash?: string } = {
    name,
    role,
  };
  if (password) {
    data.passwordHash = await hash(password, 12);
  }

  await db.user.update({ where: { id }, data });

  revalidatePath("/parametres");
  return { success: true };
}

export async function toggleUserStatus(
  _prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const denied = await requireAdmin();
  if (denied) {
    return denied.error;
  }

  const id = getString(formData, "id");
  const active = getString(formData, "active");

  if (!id) {
    return { error: "Utilisateur introuvable." };
  }

  const session = await auth();
  if (id === session?.user?.id) {
    return { error: "Vous ne pouvez pas désactiver votre propre compte." };
  }

  const user = await db.user.findUnique({ where: { id } });
  if (!user) {
    return { error: "Utilisateur introuvable." };
  }

  const isActive = active === "true";

  if (user.isActive && !isActive && user.role === "ADMIN") {
    if ((await parseActiveAdmins()).filter((adminId) => adminId !== id).length === 0) {
      return { error: "Impossible de désactiver le dernier administrateur actif." };
    }
  }

  await db.user.update({ where: { id }, data: { isActive } });

  revalidatePath("/parametres");
  return { success: true };
}