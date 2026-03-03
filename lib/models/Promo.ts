import mongoose from 'mongoose';

const PromoSchema = new mongoose.Schema({
  promoId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  }
}, { timestamps: true });

export default mongoose.models.Promo || mongoose.model('Promo', PromoSchema);
