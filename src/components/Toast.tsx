"use client";

export default function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 toast-enter">
      <div className="bg-motif-charcoal text-white px-6 py-3 rounded-pill shadow-xl font-commuters text-xs uppercase tracking-wider">
        {message}
      </div>
    </div>
  );
}
