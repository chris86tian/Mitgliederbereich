import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

interface Video {
  id: string;
  title: string;
  url: string;
  provider: "youtube" | "vimeo" | "s3";
}

interface Chapter {
  id: string;
  title: string;
  videos: Video[];
}

interface Course {
  id: string;
  title: string;
  chapters: Chapter[];
}

export default function AdminCourseEdit() {
  const router = useRouter();
  const { courseId } = router.query;
  const { data: session } = useSession();

  const [course, setCourse] = useState<Course | null>(null);
  const [title, setTitle] = useState("");
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    if (!courseId) return;

    async function fetchCourse() {
      const { data, error } = await supabase
        .from("courses")
        .select(
          `id, title, chapters:id, chapters:title, chapters:videos:id, chapters:videos:title, chapters:videos:url, chapters:videos:provider`
        )
        .eq("id", courseId)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        setCourse(data);
        setTitle(data.title);
        setChapters(data.chapters);
      }
    }

    fetchCourse();
  }, [courseId]);

  if (!session) {
    return (
      <Layout>
        <p>Please sign in to edit courses.</p>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <p>Loading course...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Edit Course</h1>
      <label className="block mb-4">
        <span className="text-gray-700 dark:text-gray-300">Course Title</span>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      {/* TODO: Chapters and videos editing UI */}
      <button
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
        onClick={() => alert("Save functionality not implemented yet")}
      >
        Save
      </button>
    </Layout>
  );
}
