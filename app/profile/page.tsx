import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';


import { currentUser } from '@clerk/nextjs/server';

import Image from 'next/image';
import connectDB from '../lib/mongoose';
import UserModel from '../models/User.model';


export default async function ProfilePage() {
  const { userId } =await auth();
  const clerkUser = await currentUser();
  
  if (!userId || !clerkUser) redirect('/sign-in');

  await connectDB();

  // Find or create user in MongoDB
  let dbUser = await UserModel.findOne({ clerkId: userId });
  if (!dbUser) {
    dbUser = await UserModel.create({
      clerkId: userId,
      name: clerkUser.username || 
               `user_${clerkUser.firstName?.toLowerCase()}${Math.floor(Math.random() * 1000)}`,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      profileImage: clerkUser.imageUrl,
    });
  }

  console.log(clerkUser)

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-start gap-6 mb-8">
        <Image
          width={96}
          height={96}
          src={clerkUser.imageUrl}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {clerkUser.firstName} {clerkUser.lastName}
          </h1>
          <p className="text-gray-600">@{dbUser.name}</p>
          <p className="mt-2 text-gray-600">
            {clerkUser.emailAddresses[0]?.emailAddress}
          </p>
        </div>
      </div>

      {/* Rest of your profile content */}

     
    </div>
  );
}