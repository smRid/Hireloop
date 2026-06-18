import AdminUsersClient from "@/components/dashboardPage/admin/AdminUsersClient";
import { getUsers } from "@/lib/api/users";
import { requireRole } from "@/lib/core/session";

export default async function AdminUsersPage() {
  await requireRole("admin");
  const response = await getUsers();
  const users = Array.isArray(response.data) ? response.data : [];

  return <AdminUsersClient initialUsers={users} />;
}
