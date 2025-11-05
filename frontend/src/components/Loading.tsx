export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="relative inline-flex">
          <div className="w-16 h-16 border-4 border-indigo-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Yükleniyor...</p>
      </div>
    </div>
  );
}
