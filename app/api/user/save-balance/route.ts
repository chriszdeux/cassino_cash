import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { userId, deposit } = body;

    if (!userId || typeof deposit !== 'number') {
      return NextResponse.json({ success: false, message: 'Faltan datos o formato incorrecto.' }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { balance: deposit } },
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
