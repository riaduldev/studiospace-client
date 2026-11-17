import { getApiUrl } from "@/lib/api-url";

export async function uploadImageToServer(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(getApiUrl("/api/upload"), {
    method: "POST",
    body: formData, 
    credentials: "include",
  });

  if (response.status === 404) {
    throw new Error(
      "The upload route was not found. Stop the service on port 8000 and start the API from the studiospace-server folder."
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success || typeof data.url !== "string") {
    throw new Error(
      data?.message || `Image upload failed (HTTP ${response.status}).`
    );
  }

  return data.url;
}