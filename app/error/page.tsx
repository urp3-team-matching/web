"use client";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center my-10">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Error</h1>
      <p className="text-lg text-gray-700">
        문제가 발생했습니다. 잠시 후 다시 시도해주세요.
      </p>
    </div>
  );
}
