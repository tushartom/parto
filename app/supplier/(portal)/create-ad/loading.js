// app/supplier/loading.tsx
export default function Loading() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-transparent pointer-events-none">
      {/* This bar will now use the '--animate-loading-bar' 
         we just defined in your CSS.
      */}
      <div className="h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.6)] animate-loading-bar" />
    </div>
  );
}
