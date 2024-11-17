import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2"


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

productoSchema.plugin(paginate)

export const productosModelo = mongoose.model(
    'products',
    productoSchema
)

