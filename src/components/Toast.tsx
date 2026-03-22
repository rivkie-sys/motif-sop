"use client";

export default function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 toast-enter">
      <div className="bg-gray-900 text-white px-5 py-2.5 rounded-lg shadow-xl text-sm font-medium">
        {message}
      </div>
    </div>
  );
}
