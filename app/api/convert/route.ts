import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

const supportedFormats = ["png", "jpg", "jpeg", "webp", "tiff"];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const format = formData.get("format") as string | null;

    if (!file || !format) {
      return NextResponse.json(
        { error: "Missing file or format" },
        { status: 400 }
      );
    }

    if (!supportedFormats.includes(format.toLowerCase())) {
      return NextResponse.json(
        { error: "Unsupported format" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
      const outputBuffer = await sharp(buffer)
        .toFormat(format as keyof sharp.FormatEnum, { quality: 80 })
        .toBuffer();

      return new NextResponse(outputBuffer, {
        status: 200,
        headers: {
          "Content-Type": `image/${format}`,
          "Content-Disposition": `attachment; filename="converted.${format}"`,
        },
      });
    } catch (sharpError) {
      console.error("Error during Sharp conversion:", sharpError);
      return NextResponse.json(
        { error: "Failed to convert image" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected conversion error:", error);
    return NextResponse.json({ error: "Conversion failed" }, { status: 500 });
  }
}
