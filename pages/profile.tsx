import Layout from "../components/Layout";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Profile() {
  const { data: session } = useSession();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (!session?.user?.id) return;

    async function fetchProfile() {
      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url, full_name")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        setAvatarUrl(data.avatar_url);
        setName(data.full_name);
      }
    }

    fetchProfile();
  }, [session]);

  if (!session) {
    return (
      <Layout>
        <p>Please sign in to view your profile.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-3xl p-6 shadow glass">
        <div className="flex flex-col items-center gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-4xl font-bold text-gray-600 dark:text-gray-300">
              {name ? name[0].toUpperCase() : "U"}
            </div>
          )}
          <h1 className="text-3xl font-bold">{name || "User"}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Email: {session.user.email}
          </p>
        </div>
      </div>
    </Layout>
  );
}
