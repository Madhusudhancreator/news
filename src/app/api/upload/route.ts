import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// AWS S3 Configuration
const s3 = new S3Client({
  region: process.env.MY_AWS_REGION,
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY!,
  },
});

const bucketName = process.env.AWS_S3_BUCKET!;

// Helper: Upload a single file to S3
async function uploadFileToS3(file: File, folder: string): Promise<string> {
  const uniqueSuffix = nanoid(8);
  const fileName = `${folder}/${uniqueSuffix}-${file.name}`;

  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);

  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.type,
    })
  );

  return fileName;
}

// API Endpoint: Handle File Upload
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Only image files are allowed (JPEG, PNG, WebP, GIF, AVIF)" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, message: "File size must be under 5 MB" },
        { status: 400 }
      );
    }

    // Upload file to the `news` folder
    const uploadedFileName = await uploadFileToS3(file, "news");

    return NextResponse.json({ success: true, fileName: uploadedFileName });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during file upload." },
      { status: 500 }
    );
  }
}
