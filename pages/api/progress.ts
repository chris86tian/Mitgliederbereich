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
    const { video_id, watched } = req.body;
    if (!video_id || typeof watched !== "boolean") {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const { error } = await supabase.from("video_progress").upsert({
      user_id: userId,
      video_id,
      watched,
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
