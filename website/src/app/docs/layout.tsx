import React from "react";
import { Navbar } from "@/components/Navbar";
import { DocsSidebar } from "@/components/DocsSidebar";
import { Footer } from "@/components/Footer";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#060608] text-zinc-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200">
      <Navbar />

      <div className="flex-1 mx-auto w-full max-w-7xl flex flex-col md:flex-row">
        <DocsSidebar />
        <main className="flex-1 p-6 md:p-10 max-w-4xl overflow-hidden">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
