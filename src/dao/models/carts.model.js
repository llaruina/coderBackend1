import mongoose from "mongoose"

const cartSchema = new mongoose.Schema(
    {
        products: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
                quantity: { type: Number, required: true, default: 1 }
            }
        ]
    },
    {
        timestamps: true,
    }
);

cartSchema.pre("find", function () {
    this.populate("products.product");
});

cartSchema.pre("findOne", function () {
    this.populate("products.product");
});


cartSchema.pre("findById", function () {
    this.populate("products.product");
});

export const cartsModelo = mongoose.model('Cart', cartSchema);