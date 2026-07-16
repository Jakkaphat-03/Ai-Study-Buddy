import { NextResponse } from "next/server";
import { gemini } from "@/features/summary/services/gemini";

export async function GET() {
  try {
    const models = await gemini.models.list();

    return NextResponse.json(models);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}