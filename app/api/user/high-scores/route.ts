import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    await dbConnect();

    // Fetch the top 10 users sorted by balance descending
    const topUsers = await User.find({})
      .sort({ balance: -1 })
      .limit(10)
      .select('username balance _id')
      .lean();

    return NextResponse.json({ 
      success: true, 
      users: topUsers
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('Error fetching high scores:', error);
    return NextResponse.json({ 
      success: false, 
      message: (error as Error).message || 'Error en el servidor.' 
    }, { status: 500 });
  }
}
