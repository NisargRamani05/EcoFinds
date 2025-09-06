import Navbar from '@/components/Navbar';
import HomePageClient from './HomePageClient';
import Footer from '@/components/Footer'; 

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[url('/bg-img2.png')] bg-center flex flex-col min-h-screen">
      <div className="bg-white/80 min-h-screen">
        <Navbar />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
          <HomePageClient />
        </main>

        <Footer />
      </div>
    </div>
  );
}