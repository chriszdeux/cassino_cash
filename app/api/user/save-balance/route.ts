import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { userId, balance } = body;

    if (!userId || typeof balance !== 'number') {
      return NextResponse.json({ success: false, message: 'Faltan datos o formato incorrecto.' }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { balance },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: 'Usuario no encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Saldo guardado correctamente.',
      balance: updatedUser.balance
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('Error guardando saldo:', error);
    return NextResponse.json({ 
      success: false, 
      message: (error as Error).message || 'Error en el servidor.' 
    }, { status: 500 });
  }
}
