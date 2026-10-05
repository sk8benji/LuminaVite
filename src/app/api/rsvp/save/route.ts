import { NextRequest } from "next/server";
import { POST as rsvpPost } from "@/app/api/rsvp/route";

export async function POST(req: NextRequest) {
  return rsvpPost(req);
}
