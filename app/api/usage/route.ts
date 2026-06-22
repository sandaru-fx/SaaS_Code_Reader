import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { isClerkConfigured } from "@/lib/clerk/is-configured";
import { getUsageStatus } from "@/lib/usage/usage";

export async function GET() {
  if (!isClerkConfigured()) {
    return NextResponse.json(
      { error: "Authentication is not configured." },
      { status: 503 }
    );
  }

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  try {
    const status = await getUsageStatus(userId);
    return NextResponse.json(status);
  } catch {
    return NextResponse.json(
      { error: "Unable to load usage status." },
      { status: 500 }
    );
  }
}
