// // pages/api/users/profile.ts
// import connectDB from '@/app/lib/mongoose';
// import UserModel from '@/app/models/User.model';
// import { NextApiRequest, NextApiResponse } from 'next';


// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   await connectDB();

//   if (req.method === 'GET') {
//     const { userId } = req.query;

//     try {
//       // Fetch user data
//       const user = await UserModel.findOne({ clerkId: userId })
//         .populate('borrowedBooks')
//         .populate('wishlist');

//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }

//       return res.status(200).json({
//         name: user.name,
//         email: user.email,
//         profileImage: user.profileImage,
//         borrowedBooks: user.borrowedBooks,
//         wishlist: user.wishlist,
//       });
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//       return res.status(500).json({ message: 'Internal server error' });
//     }
//   }

//   return res.status(405).json({ message: 'Method not allowed' });
// }