import mongoose from "mongoose";


const productoSchema = new mongoose.Schema(
    {
        id: String,
        title: String,
        description: String,
        price: Number,
        thumbnail: String,
        code: {
            type: String,
            unique: true
        },
        stock: {
            type: Number,
            default: 0
        },
        status: Boolean,
        category: String
    },
    {
        timestamps: true,
    }
)

export const productosModelo = mongoose.model(
    'products',
    productoSchema
)

