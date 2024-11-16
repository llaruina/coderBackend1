import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        products: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true, default: 1 }
            }
        ]
    },
    {
        timestamps: true, // Crea automáticamente 'createdAt' y 'updatedAt'
    }
);

export const cartsModelo = mongoose.model('Cart', cartSchema);