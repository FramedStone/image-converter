"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const imageFormats = [
  "png",
  "jpg",
  "jpeg",
  "webp",
  "gif",
  "tiff",
  "bmp",
  "ico",
  "svg",
  "avif",
  "heic",
  "jxr",
  "psd",
  "eps",
  "raw",
];

export default function ImageConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [convertTo, setConvertTo] = useState<string>("png");
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      setError("Please select a file to convert.");
      return;
    }

    setConverting(true);
    setError(null);

    try {
      // In a real application, you would send the file to a server for conversion
      // Here, we're simulating the conversion process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create a fake converted file for download
      const blob = new Blob([selectedFile], { type: `image/${convertTo}` });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `converted.${convertTo}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("An error occurred during conversion. Please try again.");
    } finally {
      setConverting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Convert your image</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="file-upload">Select an image file</Label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90"
            />
          </div>
          <div>
            <Label htmlFor="convert-to">Convert to</Label>
            <Select onValueChange={setConvertTo} defaultValue={convertTo}>
              <SelectTrigger id="convert-to">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {imageFormats.map((format) => (
                  <SelectItem key={format} value={format}>
                    {format.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleConvert}
          disabled={!selectedFile || converting}
          className="w-full"
        >
          {converting ? "Converting..." : "Convert"}
        </Button>
      </CardFooter>
      {error && <div className="px-6 pb-4 text-red-500 text-sm">{error}</div>}
    </Card>
  );
}
