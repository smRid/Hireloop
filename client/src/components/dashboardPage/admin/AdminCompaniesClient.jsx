"use client";

import { useMemo, useState, useTransition } from "react";
import { CheckCircle2, Search, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import CompanyLogo from "@/components/shared/CompanyLogo";
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
import { updateCompanyStatus } from "@/lib/actions/companies";

const getId = (item) => item?._id ?? item?.id ?? "";

const formatDate = (date) => {
  if (!date) return "Unknown";
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function AdminCompaniesClient({ initialCompanies = [] }) {
  const router = useRouter();
  const [companies, setCompanies] = useState(initialCompanies);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return companies.filter((company) => {
      const matchesQuery =
        !normalized ||
        company.name?.toLowerCase().includes(normalized) ||
        company.industry?.toLowerCase().includes(normalized);
      const matchesStatus = status === "all" || company.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [companies, query, status]);

  function changeStatus(company, nextStatus) {
    startTransition(async () => {
      const result = await updateCompanyStatus(getId(company), nextStatus);

      if (result.error) {
        setMessage(result.error);
        return;
      }

      setCompanies((current) =>
        current.map((item) =>
          getId(item) === getId(company) ? { ...item, status: result.data.status } : item,
        ),
      );
      setMessage("Company status updated.");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-7">
      <PageHeader
        title="Manage Companies"
        description="Approve, reject, and monitor recruiter company profiles."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-sans text-[14px] text-muted-foreground">
          Showing {filtered.length} of {companies.length} companies
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-10 w-80 items-center rounded-lg border border-border bg-popover px-3">
            <Search className="mr-2 size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-full flex-1 bg-transparent font-sans text-[14px] outline-none"
              placeholder="Search companies..."
              type="search"
            />
          </div>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-10 rounded-lg border border-border bg-popover px-3 font-sans text-[14px] outline-none"
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {message && (
        <p className="font-sans text-[13px] text-muted-foreground" role="status">
          {message}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table aria-label="Companies">
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="pl-6">Company</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Recruiter</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="py-16 text-center">
                  <p className="font-sans text-[14px] text-muted-foreground">
                    No companies match this filter.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((company) => (
                <TableRow key={getId(company)} className="border-border hover:bg-popover">
                  <TableCell className="pl-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <CompanyLogo name={company.name} src={company.logoUrl} size="sm" />
                      <div>
                        <p className="font-sans text-[14px] font-medium">{company.name}</p>
                        <p className="font-sans text-[12px] text-muted-foreground">
                          {company.location}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <span className="font-sans text-[14px] text-muted-foreground">
                      {company.industry}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <span className="font-sans text-[14px] text-muted-foreground">
                      {company.recruiterId}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <span className="font-sans text-[14px] text-muted-foreground">
                      {formatDate(company.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <StatusPill status={company.status} />
                  </TableCell>
                  <TableCell className="pr-6 py-3.5">
                    <div className="flex justify-end gap-1">
                      {company.status !== "approved" && (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => changeStatus(company, "approved")}
                          className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-popover hover:text-primary"
                          aria-label={`Approve ${company.name}`}
                        >
                          <CheckCircle2 className="size-4" />
                        </button>
                      )}
                      {company.status !== "rejected" && (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => changeStatus(company, "rejected")}
                          className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          aria-label={`Reject ${company.name}`}
                        >
                          <XCircle className="size-4" />
                        </button>
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
