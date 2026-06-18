"use client";

import { useMemo, useState, useTransition } from "react";
import { RefreshCw, Search, ShieldAlert, UserCheck, UserX } from "lucide-react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/shared/PageHeader";
import StatusPill from "@/components/shared/StatusPill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { updateUserAccountRole, updateUserStatus } from "@/lib/actions/users";
import { cn } from "@/lib/utils";

const getId = (item) => item?.id ?? item?._id ?? "";

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const formatDate = (date) => {
  if (!date) return "Unknown";
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function Avatar({ name }) {
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-popover font-heading text-[11px] font-semibold text-primary">
      {initials(name)}
    </div>
  );
}

export default function AdminUsersClient({ initialUsers = [] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return users.filter((user) => {
      const matchesQuery =
        !normalized ||
        user.name?.toLowerCase().includes(normalized) ||
        user.email?.toLowerCase().includes(normalized);
      const matchesRole = role === "all" || user.role === role;
      return matchesQuery && matchesRole;
    });
  }, [query, role, users]);

  function patchUser(userId, updates) {
    setUsers((current) =>
      current.map((user) =>
        getId(user) === userId ? { ...user, ...updates } : user,
      ),
    );
  }

  function changeRole(user, nextRole) {
    const userId = getId(user);
    startTransition(async () => {
      const result = await updateUserAccountRole(userId, nextRole);

      if (result.error) {
        setMessage(result.error);
        return;
      }

      patchUser(userId, { role: result.data.role });
      setMessage("User role updated.");
      router.refresh();
    });
  }

  function changeStatus(user, nextStatus) {
    const userId = getId(user);
    startTransition(async () => {
      const result = await updateUserStatus(userId, nextStatus);

      if (result.error) {
        setMessage(result.error);
        return;
      }

      patchUser(userId, { status: result.data.status });
      setMessage("User status updated.");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-7">
      <PageHeader
        title="Manage Users"
        description="Review users, update roles, and suspend or restore account access."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-sans text-[14px] text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filtered.length}</span>{" "}
          of <span className="font-medium text-foreground">{users.length}</span> users
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-10 w-80 items-center rounded-lg border border-border bg-popover px-3">
            <Search className="mr-2 size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-full flex-1 bg-transparent font-sans text-[14px] outline-none"
              placeholder="Search users..."
              type="search"
            />
          </div>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="h-10 rounded-lg border border-border bg-popover px-3 font-sans text-[14px] outline-none"
            aria-label="Filter by role"
          >
            <option value="all">All Roles</option>
            <option value="seeker">Seeker</option>
            <option value="recruiter">Recruiter</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {message && (
        <p className="font-sans text-[13px] text-muted-foreground" role="status">
          {message}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table aria-label="Users">
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="pl-6">User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="py-16 text-center">
                  <p className="font-sans text-[14px] text-muted-foreground">
                    No users match this filter.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((user) => (
                <TableRow key={getId(user)} className="border-border hover:bg-popover">
                  <TableCell className="pl-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} />
                      <div className="min-w-0">
                        <p className="truncate font-sans text-[14px] font-medium">
                          {user.name ?? "Unnamed user"}
                        </p>
                        <p className="truncate font-sans text-[12px] text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <StatusPill status={user.role}>{user.role ?? "unset"}</StatusPill>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <span className="font-sans text-[14px] text-muted-foreground">
                      {user.plan ?? "free"}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <StatusPill status={user.status ?? "active"} />
                  </TableCell>
                  <TableCell className="py-3.5">
                    <span className="font-sans text-[14px] text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="pr-6 py-3.5">
                    <div className="flex justify-end gap-1">
                      {user.role !== "recruiter" && (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => changeRole(user, "recruiter")}
                          className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-popover hover:text-primary"
                          aria-label={`Make ${user.name} recruiter`}
                        >
                          <UserCheck className="size-4" />
                        </button>
                      )}
                      {user.role === "recruiter" && (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => changeRole(user, "seeker")}
                          className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-popover"
                          aria-label={`Make ${user.name} seeker`}
                        >
                          <RefreshCw className="size-4" />
                        </button>
                      )}
                      {user.status === "suspended" ? (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => changeStatus(user, "active")}
                          className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-popover hover:text-primary"
                          aria-label={`Activate ${user.name}`}
                        >
                          <ShieldAlert className="size-4" />
                        </button>
                      ) : (
                        user.role !== "admin" && (
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => changeStatus(user, "suspended")}
                            className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            aria-label={`Suspend ${user.name}`}
                          >
                            <UserX className="size-4" />
                          </button>
                        )
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
