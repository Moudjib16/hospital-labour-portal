"use client";

import { useState } from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { Plus, Power, UserRoundPen } from "lucide-react";

import { createUser, toggleUserStatus, updateUser } from "@/actions/users";
import type { UserFormState } from "@/actions/users";
import { Role } from "@/generated/prisma/enums";
import { roleLabels } from "@/lib/report-labels";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type UserRow = {
  id: string;
  username: string;
  name: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
};

type UserManagementProps = {
  users: UserRow[];
  currentUserId: string;
};

const initialUserState: UserFormState = {};

export function UserManagement({
  users,
  currentUserId,
}: UserManagementProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {users.length} compte{users.length > 1 ? "s" : ""} utilisateur
          {users.length > 1 ? "s" : ""}.
        </p>
        <CreateUserDialog />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Inscrit le</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">
                  @{user.username}
                </div>
              </TableCell>
              <TableCell>{roleLabels[user.role]}</TableCell>
              <TableCell>
                <StatusBadge active={user.isActive} />
              </TableCell>
              <TableCell>
                {new Intl.DateTimeFormat("fr-FR", {
                  dateStyle: "medium",
                }).format(user.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <EditUserDialog
                    user={user}
                    canChangeRole={user.id !== currentUserId}
                  />
                  {user.id === currentUserId ? (
                    <span className="text-xs text-muted-foreground">
                      Vous
                    </span>
                  ) : (
                    <ToggleUserDialog user={user} />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
        active
          ? "bg-emerald-500/10 text-emerald-600"
          : "bg-muted text-muted-foreground"
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          active ? "bg-emerald-500" : "bg-muted-foreground/50"
        )}
      />
      {active ? "Actif" : "Désactivé"}
    </span>
  );
}

function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setFormKey((k) => k + 1);
    }
    setOpen(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            <Plus aria-hidden="true" />
            Nouvel utilisateur
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvel utilisateur</DialogTitle>
          <DialogDescription>
            Créez un compte médecin ou administrateur.
          </DialogDescription>
        </DialogHeader>
        <CreateUserForm key={formKey} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function CreateUserForm({ onDone }: { onDone: () => void }) {
  const [state, formAction, pending] = useActionState(
    async (prevState: UserFormState, formData: FormData) => {
      const result = await createUser(prevState, formData);
      if (result.success) {
        toast.success("Compte utilisateur créé.");
        onDone();
      }
      return result;
    },
    initialUserState
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Nom d&apos;utilisateur *</Label>
        <Input
          id="username"
          name="username"
          placeholder="Ex. a.bensaad"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Nom complet *</Label>
        <Input id="name" name="name" placeholder="Ex. Dr. Ali Bensaad" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe *</Label>
        <Input
          id="password"
          name="password"
          type="password"
          minLength={8}
          placeholder="8 caractères minimum"
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Rôle *</Label>
        <Select name="role" defaultValue="DOCTOR" required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner un rôle" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(Role).map((value) => (
              <SelectItem key={value} value={value}>
                {roleLabels[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {state.error ? (
        <p aria-live="polite" className="text-sm text-red-600">
          {state.error}
        </p>
      ) : null}
      <DialogFooter>
        <Button type="submit" disabled={pending}>
          {pending ? "Création..." : "Créer le compte"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function EditUserDialog({
  user,
  canChangeRole,
}: {
  user: UserRow;
  canChangeRole: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setFormKey((k) => k + 1);
    }
    setOpen(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm">
            <UserRoundPen aria-hidden="true" />
            Modifier
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier @{user.username}</DialogTitle>
          <DialogDescription>
            Modifiez le nom, le rôle ou réinitialisez le mot de passe.
          </DialogDescription>
        </DialogHeader>
        <EditUserForm
          key={formKey}
          user={user}
          canChangeRole={canChangeRole}
          onDone={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function EditUserForm({
  user,
  canChangeRole,
  onDone,
}: {
  user: UserRow;
  canChangeRole: boolean;
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    async (prevState: UserFormState, formData: FormData) => {
      const result = await updateUser(prevState, formData);
      if (result.success) {
        toast.success("Compte utilisateur mis à jour.");
        onDone();
      }
      return result;
    },
    initialUserState
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={user.id} />
      <div className="space-y-2">
        <Label htmlFor={`name-${user.id}`}>Nom complet</Label>
        <Input
          id={`name-${user.id}`}
          name="name"
          defaultValue={user.name}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Rôle</Label>
        <Select
          name="role"
          defaultValue={user.role}
          disabled={!canChangeRole}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(Role).map((value) => (
              <SelectItem key={value} value={value}>
                {roleLabels[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!canChangeRole ? (
          <p className="text-xs text-muted-foreground">
            Vous ne pouvez pas modifier votre propre rôle.
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`password-${user.id}`}>Nouveau mot de passe</Label>
        <Input
          id={`password-${user.id}`}
          name="password"
          type="password"
          minLength={8}
          placeholder="Laisser vide pour ne pas changer"
        />
      </div>
      {state.error ? (
        <p aria-live="polite" className="text-sm text-red-600">
          {state.error}
        </p>
      ) : null}
      <DialogFooter>
        <Button type="submit" disabled={pending}>
          {pending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function ToggleUserDialog({ user }: { user: UserRow }) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setFormKey((k) => k + 1);
    }
    setOpen(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className={user.isActive ? "text-destructive" : undefined}
          >
            <Power aria-hidden="true" />
            {user.isActive ? "Désactiver" : "Réactiver"}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {user.isActive
              ? `Désactiver @${user.username} ?`
              : `Réactiver @${user.username} ?`}
          </DialogTitle>
          <DialogDescription>
            {user.isActive
              ? "Ce médecin ne pourra plus se connecter tant que le compte est désactivé. Les rapports existants sont conservés."
              : "Ce médecin pourra à nouveau se connecter avec son mot de passe."}
          </DialogDescription>
        </DialogHeader>
        <ToggleUserForm key={formKey} user={user} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function ToggleUserForm({
  user,
  onDone,
}: {
  user: UserRow;
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    async (prevState: UserFormState, formData: FormData) => {
      const result = await toggleUserStatus(prevState, formData);
      if (result.success) {
        toast.success(
          user.isActive
            ? `Le compte @${user.username} a été désactivé.`
            : `Le compte @${user.username} a été réactivé.`
        );
        onDone();
      }
      return result;
    },
    initialUserState
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={user.id} />
      <input
        type="hidden"
        name="active"
        value={user.isActive ? "false" : "true"}
      />
      {state.error ? (
        <p aria-live="polite" className="mb-4 text-sm text-red-600">
          {state.error}
        </p>
      ) : null}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={pending}
          variant={user.isActive ? "destructive" : "default"}
        >
          {pending
            ? "Enregistrement..."
            : user.isActive
              ? "Désactiver"
              : "Réactiver"}
        </Button>
      </DialogFooter>
    </form>
  );
}