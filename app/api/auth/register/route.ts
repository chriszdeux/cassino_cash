import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';

function generateReferralCode() {
  return crypto.randomBytes(4).toString('hex').toUpperCase(); // 8 chars
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { username, email, password, isOver16, termsAccepted, referralCodeInput } = body;

    // Validate inputs
    if (!username || !email || !password || isOver16 === undefined || termsAccepted === undefined) {
      return NextResponse.json({ success: false, message: 'Todos los campos son obligatorios.' }, { status: 400 });
    }

    if (!isOver16) {
      return NextResponse.json({ success: false, message: 'Debes ser mayor de 16 años para registrarte.' }, { status: 400 });
    }

    if (!termsAccepted) {
      return NextResponse.json({ success: false, message: 'Debes aceptar los términos y condiciones.' }, { status: 400 });
    }

    const today = new Date();

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return NextResponse.json({ success: false, message: 'El usuario o correo electrónico ya está registrado.' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    let baseBalance = 1000;
    
    // Promo March 2026
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0 is January, 2 is March
    if (currentYear === 2026 && currentMonth === 2) { 
      baseBalance = 2000;
    }

    // Referral code logic
    if (referralCodeInput && referralCodeInput.length === 8) {
      const parentUser = await User.findOne({ referralCode: referralCodeInput });
      if (parentUser) {
        baseBalance += 1000; 
        parentUser.balance += 1000; 
        await parentUser.save();
      }
    }

    // Generate unique referral code for this new user
    let userReferralCode = generateReferralCode();
    while (await User.exists({ referralCode: userReferralCode })) {
      userReferralCode = generateReferralCode();
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      isOver16,
      termsAccepted,
      balance: baseBalance,
      referralCode: userReferralCode
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Usuario registrado exitosamente.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        balance: user.balance
      }
    }, { status: 201 });

  } catch (error: unknown) {
    console.error('Error in register endpoint:', error);
    return NextResponse.json({ 
      success: false, 
      message: (error as Error).message || 'Ocurrió un error en el servidor.' 
    }, { status: 500 });
  }
}
