import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";
import { useSession } from "next-auth/react";

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

interface Progress {
  video_id: string;
  watched: boolean;
}

export default function CoursePage() {
  const router = useRouter();
  const { courseId } = router.query;
  const { data: session } = useSession();

  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!courseId || !session?.user?.id) return;

    async function fetchCourse() {
      const { data: courseData, error } = await supabase
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

      if (courseData) {
        setCourse(courseData);
      }
    }

    async function fetchProgress() {
      const { data: progressData, error } = await supabase
        .from("video_progress")
        .select("video_id, watched")
        .eq("user_id", session.user.id)
        .in(
          "video_id",
          course?.chapters.flatMap((ch) => ch.videos.map((v) => v.id)) || []
        );

      if (error) {
        console.error(error);
        return;
      }

      if (progressData) {
        const progMap: Record<string, boolean> = {};
        progressData.forEach(({ video_id, watched }) => {
          progMap[video_id] = watched;
        });
        setProgress(progMap);
      }
    }

    fetchCourse();
    fetchProgress();
  }, [courseId, session, course?.chapters]);

  if (!session) {
    return (
      <Layout>
        <p>Please sign in to view this course.</p>
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
      <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
      {course.chapters.map((chapter) => (
        <section key={chapter.id} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{chapter.title}</h2>
          <ul className="space-y-4">
            {chapter.videos.map((video) => (
              <li
                key={video.id}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow glass"
              >
                <h3 className="text-xl font-semibold">{video.title}</h3>
                <div className="mt-2 aspect-video">
                  {video.provider === "youtube" && (
                    <iframe
                      src={video.url}
                      title={video.title}
                      allowFullScreen
                      className="w-full h-full rounded-md"
                    />
                  )}
                  {video.provider === "vimeo" && (
                    <iframe
                      src={video.url}
                      title={video.title}
                      allowFullScreen
                      className="w-full h-full rounded-md"
                    />
                  )}
                  {video.provider === "s3" && (
                    <video
                      src={video.url}
                      controls
                      className="w-full h-full rounded-md"
                    />
                  )}
                </div>
                <button
                  onClick={async () => {
                    if (!session.user.id) return;
                    const watched = !progress[video.id];
                    const { error } = await supabase
                      .from("video_progress")
                      .upsert({
                        user_id: session.user.id,
                        video_id: video.id,
                        watched,
                      });
                    if (error) {
                      console.error(error);
                      return;
                    }
                    setProgress((prev) => ({ ...prev, [video.id]: watched }));
                  }}
                  className={`mt-4 px-4 py-2 rounded-md font-semibold transition ${
                    progress[video.id]
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {progress[video.id] ? "Mark as Unwatched" : "Mark as Watched"}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </Layout>
  );
}
