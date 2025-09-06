import Navbar from '@/components/Navbar';
import HomePageClient from './HomePageClient';
// import Footer from '@/components/Footer'; 

export default function HomePage() {
  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <HomePageClient />
      </main>

      {/* <Footer /> */}
    </div>
  );
}