// components/Loader.tsx
import { ClipLoader } from "react-spinners";

export default function Loader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500">
      <ClipLoader
        color="#ffffff"
        size={50}
        speedMultiplier={0.8}
        className="mb-4"
      />
      <p className="text-white font-mono text-lg animate-pulse">
        Loading beautiful experience...
      </p>
    </div>
  );
}
