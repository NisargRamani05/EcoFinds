// src/app/dashboard/profile/[...slug]/page.tsx

import MyListings from './_components/MyListings';
import MyPurchases from './_components/MyPurchases'; // 1. Import the new component
import Profile from './_components/Profile';

export default function page({ params }: { params: { slug: string[] } }) {
  const activeTab = params.slug ? params.slug[0] : 'profile';

  return (
    <div>
      {activeTab === 'profile' && <Profile />}
      {activeTab === 'my-listings' && <MyListings />}
      
      {/* 2. Add this line to render your new component */}
      {activeTab === 'my-purchases' && <MyPurchases />}
    </div>
  );
}