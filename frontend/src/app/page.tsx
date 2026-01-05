
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 selection:bg-indigo-500/30">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative isolate pt-14">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ec4899] to-[#6366f1] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
              Mzansi's Premier <span className="bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">Event Platform</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              From the Soweto Derby to the Cape Town Jazz Fest. Secure your seat at South Africa’s biggest events in real-time. 
              <span className="block mt-2 text-indigo-400">Powered by local tech. Built for Africa.</span>
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a href="/events/1" className="rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:scale-105">
                Browse SA Events
              </a>
              <a href="#" className="text-sm font-semibold leading-6 text-white hover:text-indigo-400 transition-colors">
                List Your Event <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        
        {/* Features / Glass Cards */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="glass-card">
                <div className="h-12 w-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 text-2xl">
                    🇿🇦
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">Local & Lekker</h3>
                <p className="text-slate-400">Optimized for SA networks and payment gateways like PayFast and Ozow.</p>
             </div>
             <div className="glass-card">
                <div className="h-12 w-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4 text-2xl">
                    ⚡
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">Flash Sales Ready</h3>
                <p className="text-slate-400">Our engine handles the load when tickets for the Derby drop.</p>
             </div>
             <div className="glass-card">
                <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 text-2xl">
                    🎟️
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">Smart Tickets</h3>
                <p className="text-slate-400">Secure QR codes sent directly to WhatsApp or Email.</p>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}
