import { authClient } from "@/lib/auth-client";

export async function uploadImageToServer(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const { data: sessionData } = await authClient.getSession();
  const sessionToken = sessionData?.session?.token;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: sessionToken
      ? { Authorization: `Bearer ${sessionToken}` }
      : undefined,
  });

  if (response.status === 404) {
    throw new Error("The upload endpoint was not found. Check that the API server is running.");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success || typeof data.url !== "string") {
    throw new Error(
      data?.message || `Image upload failed (HTTP ${response.status}).`
    );
  }

  return data.url;
}
