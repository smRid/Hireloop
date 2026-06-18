import { NextResponse } from "next/server";

const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";

export async function POST(request) {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Image upload is not configured." },
      { status: 500 },
    );
  }

  /* Expect multipart/form-data with a "image" field (the file) */
  let incomingForm;
  try {
    incomingForm = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = incomingForm.get("image");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No image file provided." }, { status: 400 });
  }

  /* Convert the file to a base64 string — imgbb accepts base64 */
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  /* Forward to imgbb */
  const body = new URLSearchParams({ key: apiKey, image: base64 });

  let imgbbRes;
  try {
    imgbbRes = await fetch(IMGBB_UPLOAD_URL, {
      method: "POST",
      body,
    });
  } catch (err) {
    console.error("[logo-upload] imgbb network error:", err);
    return NextResponse.json(
      { error: "Failed to reach image host." },
      { status: 502 },
    );
  }

  const data = await imgbbRes.json();

  if (!imgbbRes.ok || !data?.success) {
    console.error("[logo-upload] imgbb error:", data);
    return NextResponse.json(
      { error: data?.error?.message ?? "Upload failed." },
      { status: 502 },
    );
  }

  /* Return only the fields the client needs */
  return NextResponse.json({
    url: data.data.url,
    displayUrl: data.data.display_url,
    deleteUrl: data.data.delete_url,
  });
}
