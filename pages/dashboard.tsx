import Layout from "../components/Layout";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";

interface CourseProgress {
  course_id: string;
  title: string;
  progress_percent: number;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<CourseProgress[]>([]);

  useEffect(() => {
    if (!session?.user?.id) return;

    async function fetchProgress() {
      const { data, error } = await supabase
        .from("course_progress")
        .select("course_id, courses(title), progress_percent")
        .eq("user_id", session.user.id);

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        setCourses(
          data.map((item) => ({
            course_id: item.course_id,
            title: item.courses.title,
            progress_percent: item.progress_percent,
          }))
        );
      }
    }

    fetchProgress();
  }, [session]);

  if (!session) {
    return (
      <Layout>
        <p>Please sign in to view your dashboard.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Your Courses</h1>
      {courses.length === 0 ? (
        <p>You have not enrolled in any courses yet.</p>
      ) : (
        <ul className="space-y-4">
          {courses.map(({ course_id, title, progress_percent }) => (
            <li
              key={course_id}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow glass"
            >
              <Link href={`/courses/${course_id}`}>
                <a className="text-xl font-semibold hover:underline">{title}</a>
              </Link>
              <div className="mt-2 h-3 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${progress_percent}%` }}
                />
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Progress: {progress_percent.toFixed(1)}%
              </p>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
