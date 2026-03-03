import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { identifier, password } = body; // identifier can be username or email

    if (!identifier || !password) {
      return NextResponse.json({ success: false, message: 'Todos los campos son obligatorios.' }, { status: 400 });
    }

    // Find user by either email or username
    const user = await User.findOne({ 
      $or: [{ email: identifier }, { username: identifier }] 
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'Credenciales inválidas.' }, { status: 401 });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: 'Credenciales inválidas.' }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Inicio de sesión exitoso.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        balance: user.balance
      }
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('Error in login endpoint:', error);
    return NextResponse.json({ 
      success: false, 
      message: (error as Error).message || 'Ocurrió un error en el servidor.' 
    }, { status: 500 });
  }
}
