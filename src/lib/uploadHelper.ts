// lib/uploadHelper.ts

export async function uploadImageToServer(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  // আপনার Express ব্যাকএন্ডের URL (যেমন: http://localhost:8000/api/upload)
  const res = await fetch("http://localhost:8000/api/upload", {
    method: "POST",
    body: formData, 
    // খেয়াল রাখবেন: fetch এ FormData পাঠালে 'Content-Type': 'multipart/form-data' হেডার ম্যানুয়ালি দিতে হয় না, ব্রাউজার নিজে থেকেই সেট করে নেয়।
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || "Image upload failed");
  }

  return data.url; // এটি ব্যাকএন্ড থেকে আসা ImgBB-এর সরাসরি ইমেজ লিংক
}