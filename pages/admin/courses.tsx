import Layout from "../../components/Layout";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
}

export default function AdminCourses() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!session?.user?.id) return;

    async function fetchCourses() {
      const { data, error } = await supabase.from("courses").select("id, title");
      if (error) {
        console.error(error);
        return;
      }
      setCourses(data);
    }

    fetchCourses();
  }, [session]);

  if (!session) {
    return (
      <Layout>
        <p>Please sign in to access admin courses.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Manage Courses</h1>
      <Link href="/admin/courses/new">
        <a className="inline-block mb-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition">
          New Course
        </a>
      </Link>
      <ul className="space-y-4">
        {courses.map(({ id, title }) => (
          <li key={id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow glass flex justify-between items-center">
            <Link href={`/admin/courses/${id}`}>
              <a className="font-semibold hover:underline">{title}</a>
            </Link>
            {/* TODO: Add edit/delete buttons */}
          </li>
        ))}
      </ul>
    </Layout>
  );
}
