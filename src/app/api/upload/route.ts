import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

// AWS S3 Configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
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
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
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
