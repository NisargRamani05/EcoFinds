import Navbar from '@/components/Navbar';
import HomePageClient from './HomePageClient';

export default function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* All content is now inside the client component for interactivity */}
        <HomePageClient />
      </main>
    </div>
  );
}