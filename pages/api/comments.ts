import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = session.user.id;

  if (req.method === "POST") {
    const { video_id, content, parent_id } = req.body;
    if (!video_id || !content) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const { error } = await supabase.from("comments").insert({
      user_id: userId,
      video_id,
      content,
      parent_id: parent_id || null,
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  }

  if (req.method === "GET") {
    const { video_id } = req.query;
    if (!video_id || typeof video_id !== "string") {
      return res.status(400).json({ error: "Missing video_id" });
    }

    const { data, error } = await supabase
      .from("comments")
      .select(
        `id, content, created_at, user:profiles(id, full_name, avatar_url), parent_id`
      )
      .eq("video_id", video_id)
      .order("created_at", { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
