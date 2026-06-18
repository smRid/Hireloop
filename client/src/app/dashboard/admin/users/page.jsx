"use client";

import { useState, useMemo } from "react";
import {
  Search,
  MoreHorizontal,
  UserCheck,
  UserX,
  ShieldAlert,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogMedia,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

/* ════════════════════════════════════════════════════════════════════
   MOCK DATA
   ════════════════════════════════════════════════════════════════════ */

const INITIAL_USERS = [
  {
    id: 1,
    name: "Sarah Chen",
    initials: "SC",
    email: "sarah.chen@example.com",
    role: "Seeker",
    joinDate: "Jan 12, 2026",
    status: "Active",
  },
  {
    id: 2,
    name: "Marcus Webb",
    initials: "MW",
    email: "marcus.webb@example.com",
    role: "Recruiter",
    joinDate: "Jan 18, 2026",
    status: "Active",
  },
  {
    id: 3,
    name: "Priya Nair",
    initials: "PN",
    email: "priya.nair@example.com",
    role: "Seeker",
    joinDate: "Feb 3, 2026",
    status: "Active",
  },
  {
    id: 4,
    name: "James Okafor",
    initials: "JO",
    email: "james.okafor@example.com",
    role: "Recruiter",
    joinDate: "Feb 14, 2026",
    status: "Suspended",
  },
  {
    id: 5,
    name: "Lena Müller",
    initials: "LM",
    email: "lena.muller@example.com",
    role: "Seeker",
    joinDate: "Feb 22, 2026",
    status: "Active",
  },
  {
    id: 6,
    name: "David Park",
    initials: "DP",
    email: "david.park@example.com",
    role: "Recruiter",
    joinDate: "Mar 5, 2026",
    status: "Active",
  },
  {
    id: 7,
    name: "Amara Diallo",
    initials: "AD",
    email: "amara.diallo@example.com",
    role: "Seeker",
    joinDate: "Mar 11, 2026",
    status: "Active",
  },
  {
    id: 8,
    name: "Tom Eriksson",
    initials: "TE",
    email: "tom.eriksson@example.com",
    role: "Admin",
    joinDate: "Mar 19, 2026",
    status: "Active",
  },
  {
    id: 9,
    name: "Yuki Tanaka",
    initials: "YT",
    email: "yuki.tanaka@example.com",
    role: "Seeker",
    joinDate: "Apr 1, 2026",
    status: "Suspended",
  },
  {
    id: 10,
    name: "Nadia Rossi",
    initials: "NR",
    email: "nadia.rossi@example.com",
    role: "Recruiter",
    joinDate: "Apr 8, 2026",
    status: "Active",
  },
  {
    id: 11,
    name: "Carlos Mendez",
    initials: "CM",
    email: "carlos.mendez@example.com",
    role: "Seeker",
    joinDate: "Apr 17, 2026",
    status: "Active",
  },
  {
    id: 12,
    name: "Fatima Al-Rashid",
    initials: "FA",
    email: "fatima.alrashid@example.com",
    role: "Recruiter",
    joinDate: "May 2, 2026",
    status: "Active",
  },
  {
    id: 13,
    name: "Oliver Kim",
    initials: "OK",
    email: "oliver.kim@example.com",
    role: "Seeker",
    joinDate: "May 9, 2026",
    status: "Active",
  },
  {
    id: 14,
    name: "Zara Ahmed",
    initials: "ZA",
    email: "zara.ahmed@example.com",
    role: "Seeker",
    joinDate: "May 20, 2026",
    status: "Active",
  },
  {
    id: 15,
    name: "Raj Patel",
    initials: "RP",
    email: "raj.patel@example.com",
    role: "Recruiter",
    joinDate: "Jun 1, 2026",
    status: "Suspended",
  },
];

/* ════════════════════════════════════════════════════════════════════
   ROLE & STATUS CONFIG
   ════════════════════════════════════════════════════════════════════ */

const ROLE_CONFIG = {
  Seeker: { pillCls: "bg-secondary text-secondary-foreground" },
  Recruiter: { pillCls: "bg-primary/10 text-primary" },
  Admin: { pillCls: "bg-chart-2/10 text-chart-2" },
};

const STATUS_CONFIG = {
  Active: { pillCls: "bg-chart-3/10 text-chart-3" },
  Suspended: { pillCls: "bg-chart-4/10 text-chart-4" },
};

/* ════════════════════════════════════════════════════════════════════
   CONFIRMATION DIALOG VARIANTS
   ════════════════════════════════════════════════════════════════════ */

const CONFIRM_VARIANTS = {
  makeRecruiter: {
    title: "Make Recruiter?",
    description: (name) =>
      `${name} will be promoted to Recruiter. They will gain access to posting jobs and managing applicants.`,
    icon: UserCheck,
    iconCls: "bg-primary/10 text-primary",
    actionLabel: "Make Recruiter",
    actionCls: cn(
      "h-9 rounded-lg px-4",
      "bg-primary text-primary-foreground",
      "font-sans text-[14px] font-medium",
      "hover:bg-primary/90",
      "focus-visible:ring-primary/50",
    ),
    destructive: false,
  },
  makeSeeker: {
    title: "Change to Seeker?",
    description: (name) =>
      `${name} will be moved to the Seeker role. Their recruiter access and active job listings will be removed.`,
    icon: RefreshCw,
    iconCls: "bg-chart-2/10 text-chart-2",
    actionLabel: "Change Role",
    actionCls: cn(
      "h-9 rounded-lg px-4",
      "bg-chart-2 text-white",
      "font-sans text-[14px] font-medium",
      "hover:bg-chart-2/90",
    ),
    destructive: false,
  },
  suspend: {
    title: "Suspend Account?",
    description: (name) =>
      `${name}'s account will be suspended. They will lose all access to Hireloop until reactivated. This can be reversed.`,
    icon: AlertTriangle,
    iconCls: "bg-chart-4/10 text-chart-4",
    actionLabel: "Suspend",
    actionCls: cn(
      "h-9 rounded-lg px-4",
      "bg-chart-4 text-white",
      "font-sans text-[14px] font-medium",
      "hover:bg-chart-4/90",
    ),
    destructive: true,
  },
  activate: {
    title: "Activate Account?",
    description: (name) =>
      `${name}'s account will be reactivated. They will immediately regain access to Hireloop.`,
    icon: ShieldAlert,
    iconCls: "bg-chart-3/10 text-chart-3",
    actionLabel: "Activate",
    actionCls: cn(
      "h-9 rounded-lg px-4",
      "bg-chart-3 text-white",
      "font-sans text-[14px] font-medium",
      "hover:bg-chart-3/90",
    ),
    destructive: false,
  },
};

/* ════════════════════════════════════════════════════════════════════
   PRIMITIVES
   ════════════════════════════════════════════════════════════════════ */

function UserAvatar({ initials }) {
  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full",
        "border border-border bg-popover",
        "font-heading text-[11px] font-semibold leading-none text-primary",
      )}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

function RoleBadge({ role }) {
  const cfg = ROLE_CONFIG[role] ?? ROLE_CONFIG.Seeker;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5",
        "font-sans text-[12px] font-medium",
        cfg.pillCls,
      )}
    >
      {role}
    </span>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.Active;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5",
        "font-sans text-[12px] font-medium",
        cfg.pillCls,
      )}
    >
      {status}
    </span>
  );
}

/* ════════════════════════════════════════════════════════════════════
   ACTIONS DROPDOWN
   ════════════════════════════════════════════════════════════════════ */

function ActionsMenu({ user, onAction }) {
  const isSeeker = user.role === "Seeker";
  const isRecruiter = user.role === "Recruiter";
  const isAdmin = user.role === "Admin";
  const isActive = user.status === "Active";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Actions for ${user.name}`}
          className={cn(
            "flex size-8 items-center justify-center rounded-md",
            "border border-transparent text-muted-foreground",
            "transition-colors duration-100",
            "hover:border-border hover:bg-popover hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "data-[state=open]:border-border data-[state=open]:bg-popover data-[state=open]:text-foreground",
          )}
        >
          <MoreHorizontal className="size-4" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={cn(
          /* fixed width, not trigger-width */
          "w-48! min-w-48",
          "rounded-xl border border-border bg-popover py-1",
          "shadow-[0_8px_24px_-4px_rgba(0,0,0,0.4)]",
        )}
      >
        <DropdownMenuLabel className="px-3 py-1.5 font-sans text-[11px] uppercase tracking-widest text-muted-foreground/60">
          Role
        </DropdownMenuLabel>

        <DropdownMenuGroup>
          {/* Make Recruiter — shown for Seekers */}
          {isSeeker && (
            <DropdownMenuItem
              onSelect={() => onAction("makeRecruiter", user)}
              className="cursor-pointer gap-2.5 px-3 py-2 font-sans text-[13px]"
            >
              <UserCheck className="size-3.5 text-primary" aria-hidden="true" />
              Make Recruiter
            </DropdownMenuItem>
          )}

          {/* Make Seeker — shown for Recruiters */}
          {isRecruiter && (
            <DropdownMenuItem
              onSelect={() => onAction("makeSeeker", user)}
              className="cursor-pointer gap-2.5 px-3 py-2 font-sans text-[13px]"
            >
              <RefreshCw className="size-3.5 text-chart-2" aria-hidden="true" />
              Make Seeker
            </DropdownMenuItem>
          )}

          {/* Admin — no role change available */}
          {isAdmin && (
            <DropdownMenuItem
              disabled
              className="gap-2.5 px-3 py-2 font-sans text-[13px] opacity-40"
            >
              <ShieldAlert className="size-3.5" aria-hidden="true" />
              Admin — protected
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="px-3 py-1.5 font-sans text-[11px] uppercase tracking-widest text-muted-foreground/60">
          Account
        </DropdownMenuLabel>

        <DropdownMenuGroup>
          {/* Suspend — shown when Active and not Admin */}
          {isActive && !isAdmin && (
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => onAction("suspend", user)}
              className="cursor-pointer gap-2.5 px-3 py-2 font-sans text-[13px]"
            >
              <UserX className="size-3.5" aria-hidden="true" />
              Suspend Account
            </DropdownMenuItem>
          )}

          {/* Activate — shown when Suspended */}
          {!isActive && (
            <DropdownMenuItem
              onSelect={() => onAction("activate", user)}
              className="cursor-pointer gap-2.5 px-3 py-2 font-sans text-[13px] text-chart-3 focus:text-chart-3"
            >
              <ShieldAlert
                className="size-3.5 text-chart-3"
                aria-hidden="true"
              />
              Activate Account
            </DropdownMenuItem>
          )}

          {/* Admin active — no account action */}
          {isActive && isAdmin && (
            <DropdownMenuItem
              disabled
              className="gap-2.5 px-3 py-2 font-sans text-[13px] opacity-40"
            >
              <UserX className="size-3.5" aria-hidden="true" />
              Cannot suspend admin
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ════════════════════════════════════════════════════════════════════
   CONFIRM DIALOG
   ════════════════════════════════════════════════════════════════════ */

function ConfirmDialog({ pending, onConfirm, onCancel }) {
  if (!pending) return null;

  const variant = CONFIRM_VARIANTS[pending.action];
  const Icon = variant.icon;

  return (
    <AlertDialog
      open={!!pending}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className={variant.iconCls} aria-hidden="true">
            <Icon className="size-5" />
          </AlertDialogMedia>
          <AlertDialogTitle className="font-heading text-[18px] font-semibold text-foreground">
            {variant.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="font-sans text-[14px] text-muted-foreground">
            {variant.description(
              <span className="font-medium text-foreground">
                {pending.user.name}
              </span>,
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onCancel}
            className={cn(
              "h-9 rounded-lg border border-border bg-transparent px-4",
              "font-sans text-[14px] font-medium text-muted-foreground",
              "hover:border-border hover:bg-accent hover:text-foreground",
            )}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(pending)}
            className={variant.actionCls}
          >
            {variant.actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* ════════════════════════════════════════════════════════════════════
   EMPTY STATE
   ════════════════════════════════════════════════════════════════════ */

function EmptyState() {
  return (
    <TableRow className="border-0 hover:bg-transparent">
      <TableCell colSpan={5} className="py-16 text-center">
        <p className="font-sans text-[14px] text-muted-foreground">
          No users match your search or filter.
        </p>
      </TableCell>
    </TableRow>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════ */

export default function ManageUsersPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  /* pending = { action, user } | null */
  const [pending, setPending] = useState(null);

  /* ── Filtered list ── */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const matchesRole =
        roleFilter === "all" ||
        u.role.toLowerCase() === roleFilter.toLowerCase();
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  /* ── Open confirm dialog ── */
  function handleAction(action, user) {
    setPending({ action, user });
  }

  /* ── Apply confirmed action ── */
  function handleConfirm({ action, user }) {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== user.id) return u;
        if (action === "makeRecruiter") return { ...u, role: "Recruiter" };
        if (action === "makeSeeker") return { ...u, role: "Seeker" };
        if (action === "suspend") return { ...u, status: "Suspended" };
        if (action === "activate") return { ...u, status: "Active" };
        return u;
      }),
    );
    setPending(null);
  }

  return (
    <div className="flex flex-col gap-7">
      {/* ══════════════════════════════════════════════════════════
          PAGE HEADER
          ══════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-3">
        <h1 className="font-heading text-[28px] font-bold leading-tight text-foreground">
          Manage Users
        </h1>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5",
            "font-sans text-[13px] font-semibold",
            "bg-primary/10 text-primary",
          )}
          aria-label={`${users.length} total users`}
        >
          {users.length}
        </span>
      </div>

      {/* ══════════════════════════════════════════════════════════
          FILTER ROW
          ══════════════════════════════════════════════════════════ */}
      <div
        className="flex flex-wrap items-center justify-between gap-3"
        role="search"
        aria-label="Filter users"
      >
        {/* Showing count */}
        <p className="font-sans text-[14px] text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{filtered.length}</span>{" "}
          of <span className="font-medium text-foreground">{users.length}</span>{" "}
          users
        </p>

        {/* Search + Role filter — right side */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div
            className={cn(
              "relative flex h-10 w-full items-center sm:w-80",
              "rounded-lg border border-border bg-popover",
              "transition-colors duration-150",
              "focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/30",
            )}
          >
            <Search
              className="ml-3 size-3.5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              aria-label="Search users"
              className={cn(
                "flex-1 bg-transparent px-2.5",
                "font-sans text-[14px] text-foreground placeholder:text-muted-foreground",
                "outline-none border-none h-full",
              )}
            />
          </div>

          {/* Role filter */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger
              aria-label="Filter by role"
              className={cn(
                "h-10 w-40 rounded-lg border border-border bg-popover px-3",
                "font-sans text-[14px] text-foreground",
                "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30",
                "justify-between",
              )}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="seeker">Seeker</SelectItem>
                <SelectItem value="recruiter">Recruiter</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          TABLE
          ══════════════════════════════════════════════════════════ */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table aria-label="Users list">
          {/* Header */}
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              {[
                { label: "User", cls: "pl-6 w-[280px]" },
                { label: "Role", cls: "w-[120px]" },
                { label: "Join Date", cls: "w-[140px]" },
                { label: "Status", cls: "w-[120px]" },
                { label: "Actions", cls: "pr-6 w-[72px] text-right" },
              ].map(({ label, cls }) => (
                <TableHead
                  key={label}
                  className={cn(
                    "font-sans text-[12px] font-medium uppercase tracking-widest",
                    "text-muted-foreground/60 py-3",
                    cls,
                  )}
                >
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {/* Body */}
          <TableBody>
            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              filtered.map((user) => (
                <TableRow
                  key={user.id}
                  className={cn(
                    "border-border transition-colors duration-100",
                    "hover:bg-popover",
                  )}
                >
                  {/* User: avatar + name + email */}
                  <TableCell className="pl-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <UserAvatar initials={user.initials} />
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <span className="font-sans text-[14px] font-medium leading-snug text-foreground truncate">
                          {user.name}
                        </span>
                        <span className="font-sans text-[12px] leading-snug text-muted-foreground truncate">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Role */}
                  <TableCell className="py-3.5">
                    <RoleBadge role={user.role} />
                  </TableCell>

                  {/* Join Date */}
                  <TableCell className="py-3.5">
                    <span className="font-sans text-[14px] text-muted-foreground whitespace-nowrap">
                      {user.joinDate}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3.5">
                    <StatusBadge status={user.status} />
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="pr-6 py-3.5">
                    <div className="flex justify-end">
                      <ActionsMenu user={user} onAction={handleAction} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ══════════════════════════════════════════════════════════
          CONFIRMATION DIALOG
          ══════════════════════════════════════════════════════════ */}
      <ConfirmDialog
        pending={pending}
        onConfirm={handleConfirm}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}
