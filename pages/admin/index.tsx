import Layout from "../../components/Layout";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Layout>
        <p>Please sign in to access the admin dashboard.</p>
      </Layout>
    );
  }

  // TODO: Add role check (Admin or Instructor)

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <ul className="space-y-4">
        <li>
          <Link href="/admin/courses">
            <a className="text-blue-600 hover:underline">Manage Courses</a>
          </Link>
        </li>
        <li>
          <Link href="/admin/users">
            <a className="text-blue-600 hover:underline">Manage Users</a>
          </Link>
        </li>
      </ul>
    </Layout>
  );
}
