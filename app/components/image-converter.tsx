"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Download } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const imageFormats = ["png", "jpg", "jpeg", "webp", "tiff"];

export default function ImageConverter() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [convertTo, setConvertTo] = useState<string>("png");
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [convertedUrls, setConvertedUrls] = useState<string[]>([]);
  const [manualDownload, setManualDownload] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(files);
      setError(null);
      setConvertedUrls([]);
    }
  };

  const handleFormatChange = (format: string) => {
    setConvertTo(format);
  };

  const handleConvert = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setError("Please select file(s) to convert.");
      return;
    }

    setConverting(true);
    setError(null);
    setConvertedUrls([]);

    try {
      const convertedUrls: string[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("format", convertTo);

        const response = await fetch("/api/convert", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Conversion failed");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        convertedUrls.push(url);

        if (!manualDownload) {
          const a = document.createElement("a");
          a.href = url;
          a.download = `converted_${i + 1}.${convertTo}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      }

      if (manualDownload) {
        setConvertedUrls(convertedUrls);
      } else {
        convertedUrls.forEach((url) => URL.revokeObjectURL(url));
      }
    } catch (err) {
      setError(
        `An error occurred during conversion: ${
          err instanceof Error ? err.message : "Please try again."
        }`
      );
    } finally {
      setConverting(false);
    }
  };

  const handleManualDownload = (url: string, index: number) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted_${index + 1}.${convertTo}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setConvertedUrls((prev) => prev.filter((u) => u !== url));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Convert your image(s)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="file-upload">Select image file(s)</Label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90"
            />
            {selectedFiles && (
              <p className="mt-2 text-sm text-muted-foreground">
                {selectedFiles.length} file(s) selected
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="convert-to">Convert to</Label>
            <Select onValueChange={handleFormatChange} defaultValue={convertTo}>
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
          <div className="flex items-center space-x-2">
            <Switch
              id="manual-download"
              checked={manualDownload}
              onCheckedChange={setManualDownload}
            />
            <Label htmlFor="manual-download">Enable manual download</Label>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-4">
        <Button
          onClick={handleConvert}
          disabled={!selectedFiles || converting}
          className="w-full"
        >
          {converting ? "Converting..." : "Convert"}
        </Button>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {convertedUrls.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Converted Files:</h3>
            {convertedUrls.map((url, index) => (
              <Button
                key={url}
                variant="outline"
                className="w-full flex justify-between items-center"
                onClick={() => handleManualDownload(url, index)}
              >
                <span>File {index + 1}</span>
                <Download className="h-4 w-4" />
              </Button>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
