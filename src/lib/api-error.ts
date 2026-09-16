import { NextResponse } from "next/server";

/**
 * Logs the real error on the server and returns a generic message to the
 * client. Raw database or provider errors can expose table names, column
 * names and constraint details, so they must never reach the browser.
 */
export function serverError(context: string, error: unknown) {
  console.error(`[${context}]`, error);

  return NextResponse.json(
    { error: "Unexpected server error." },
    { status: 500 },
  );
}

/**
 * Errors thrown by our own AI services are already written for end users
 * (see toUserFriendlyError), so they are safe to forward.
 */
export function aiError(context: string, error: unknown) {
  console.error(`[${context}]`, error);

  return NextResponse.json(
    {
      error:
        error instanceof Error
          ? error.message
          : "Unexpected server error.",
    },
    { status: 500 },
  );
}
