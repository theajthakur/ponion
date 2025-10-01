import Footer from "./_components/Footer";
import Navbar from "./_components/Navbar";
import { Toaster } from "sonner";

export default function LayoutProvider({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <div className="navbar-container">
        <Navbar />
      </div>

      {/* Main Body */}
      <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-6">
        {children}
      </main>

      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  );
}
