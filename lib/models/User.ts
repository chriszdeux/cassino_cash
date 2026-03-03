import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es obligatorio'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Correo electrónico inválido'],
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: 6,
  },
  isOver16: {
    type: Boolean,
    required: [true, 'Debes confirmar que eres mayor de 16 años'],
  },
  termsAccepted: {
    type: Boolean,
    required: [true, 'Debes aceptar los términos y condiciones'],
  },
  balance: {
    type: Number,
    default: 1000, // Saldo inicial por registro
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true,
    minlength: 8,
    maxlength: 8,
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
