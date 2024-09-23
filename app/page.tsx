import ImageConverter from "./components/image-converter";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
          Image Converter
        </h1>
        <ImageConverter />
      </div>
    </div>
  );
}
