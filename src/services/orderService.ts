import mongoose from "mongoose";
import AppError from "../utils/AppError.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import Cart from "../models/cart.js";
import User, { type IAddress } from "../models/user.js";
import { sendEmail } from "./emailService.js";
import { getPagination } from "../utils/pagination.js";

interface CreateOrderData {
  userId: mongoose.Types.ObjectId | null;

  customer?: {
    name?: string;
    email?: string;
    phoneNumber?: string;
  };

  billingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };

  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };

  items: {
    productId: string;
    quantity: number;
    color: string;
    size: string;
  }[];
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export const createOrderService = async (data: CreateOrderData) => {
  let customer = data.customer;
  let billingAddress: IAddress | undefined;
  let shippingAddress: IAddress | undefined;

  if (data.userId) {
    const user = await User.findById(data.userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    customer = {
      name: data.customer?.name || user.name,
      email: data.customer?.email || user.email,
      phoneNumber: data.customer?.phoneNumber || user.phoneNumber,
    };

    billingAddress = {
      street: data.billingAddress?.street || user.billingAddress?.street,
      city: data.billingAddress?.city || user.billingAddress?.city,
      state: data.billingAddress?.state || user.billingAddress?.state,
      postalCode:
        data.billingAddress?.postalCode || user.billingAddress?.postalCode,
      country: data.billingAddress?.country || user.billingAddress?.country,
    };

    shippingAddress = {
      street: data.shippingAddress?.street || user.shippingAddress?.street,
      city: data.shippingAddress?.city || user.shippingAddress?.city,
      state: data.shippingAddress?.state || user.shippingAddress?.state,
      postalCode:
        data.shippingAddress?.postalCode || user.shippingAddress?.postalCode,
      country: data.shippingAddress?.country || user.shippingAddress?.country,
    };

    if (!customer.name || !customer.email || !customer.phoneNumber) {
      throw new AppError("Complete customer information is required", 400);
    }

    const isAddressComplete = (
      address: typeof billingAddress,
    ): address is IAddress =>
      !!address &&
      !!address.street &&
      !!address.city &&
      !!address.state &&
      !!address.postalCode &&
      !!address.country;

    if (
      !isAddressComplete(billingAddress) ||
      !isAddressComplete(shippingAddress)
    ) {
      throw new AppError(
        "Complete billing and shipping addresses are required",
        400,
      );
    }

    user.name = customer.name;
    user.email = customer.email;
    user.phoneNumber = customer.phoneNumber;
    user.billingAddress = billingAddress;
    user.shippingAddress = shippingAddress;

    await user.save();
  } else {
    if (!customer?.name || !customer?.email || !customer?.phoneNumber) {
      throw new AppError("Complete customer information is required", 400);
    }

    const isAddressComplete = (
      address: CreateOrderData["billingAddress"],
    ): address is IAddress =>
      !!address &&
      !!address.street &&
      !!address.city &&
      !!address.state &&
      !!address.postalCode &&
      !!address.country;

    if (
      !isAddressComplete(data.billingAddress) ||
      !isAddressComplete(data.shippingAddress)
    ) {
      throw new AppError(
        "Complete billing and shipping addresses are required",
        400,
      );
    }

    billingAddress = data.billingAddress;
    shippingAddress = data.shippingAddress;
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (data.userId) {
      const cart = await Cart.findOne({
        userId: data.userId,
      }).session(session);

      if (!cart || cart.items.length === 0) {
        throw new AppError("Cart is empty or not found", 400);
      }

      if (cart.items.length !== data.items.length) {
        throw new AppError("Checkout items do not match the cart", 400);
      }

      const remainingCartItems = [...cart.items];

      for (const item of data.items) {
        const index = remainingCartItems.findIndex(
          (cartItem) =>
            cartItem.productId.toString() === item.productId &&
            cartItem.color === item.color &&
            cartItem.size === item.size &&
            cartItem.quantity === item.quantity,
        );

        if (index === -1) {
          throw new AppError("Checkout items do not match the cart", 400);
        }

        remainingCartItems.splice(index, 1);
      }
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of data.items) {
      const product = await Product.findById(item.productId).session(session);

      if (!product) {
        throw new AppError(
          `Cannot find product with id of ${item.productId}`,
          404,
        );
      }

      if (item.quantity > product.quantity) {
        throw new AppError(
          `Requested quantity for "${product.name}" is not available`,
          400,
        );
      }

      if (!product.specifications.color.includes(item.color)) {
        throw new AppError(
          `Color "${item.color}" is not available for "${product.name}"`,
          400,
        );
      }

      if (!product.specifications.sizeRange.includes(item.size)) {
        throw new AppError(
          `Size "${item.size}" is not available for "${product.name}"`,
          400,
        );
      }

      const price = product.discountedPrice;

      subtotal += price * item.quantity;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
      });
    }

    const shipping = 0;
    const total = subtotal + shipping;

    const order = await Order.create(
      [
        {
          userId: data.userId,
          customer,
          billingAddress,
          shippingAddress,
          items: orderItems,
          subtotal,
          shipping,
          total,
        },
      ],
      { session },
    );

    for (const item of data.items) {
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: item.productId,
          quantity: { $gte: item.quantity },
        },
        {
          $inc: {
            quantity: -item.quantity,
          },
        },
        {
          returnDocument: "after",
          session,
        },
      );

      if (!updatedProduct) {
        throw new AppError(
          `Insufficient stock for product with id ${item.productId}`,
          400,
        );
      }
    }

    if (data.userId) {
      await Cart.deleteOne(
        {
          userId: data.userId,
        },
        { session },
      );
    }

    await session.commitTransaction();

    const createdOrder = order[0];

    await sendEmail({
      to: createdOrder.customer.email,
      subject: "Order Placed Successfully",
      text: `Dear ${createdOrder.customer.name}, Your Order #${createdOrder._id} has been placed successfully.`,
    });

    return createdOrder;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const getOrderByIdService = async (
  id: string,
  userId: mongoose.Types.ObjectId,
) => {
  const order = await Order.findById(id).select("-createdAt -updatedAt -__v");

  if (!order) {
    throw new AppError("Order dows not exist", 404);
  }

  return order;
};

export const getCurentUserOrdersService = async (
  userId: mongoose.Types.ObjectId,
  page: number,
  limit: number,
) => {
  const { skip } = getPagination({ page, limit });
  const orders = await Order.find({ userId })
    .skip(skip)
    .limit(limit)
    .select("-createdAt -updatedAt -__v");

  const totalOrders = await Order.countDocuments({ userId });
  const totalPages = Math.ceil(totalOrders / limit);

  return {
    orders,
    pagination: {
      page,
      limit,
      totalOrders,
      totalPages,
    },
  };
};

export const getAllOrdersService = async (
  page: number,
  limit: number,
  search?: string,
  status?: string,
) => {
  const { skip } = getPagination({ page, limit });
  const filter: Record<string, any> = {};

  if (search) {
    const searchConditions: Record<string, any>[] = [
      {
        "customer.name": {
          $regex: search,
          $options: "i",
        },
      },
    ];

    if (mongoose.isValidObjectId(search)) {
      searchConditions.push({
        _id: search,
      });
    }

    filter.$or = searchConditions;
  }

  if (status) {
    filter.status = status;
  }

  const orders = await Order.find(filter).skip(skip).limit(limit);

  const totalOrders = await Order.countDocuments(filter);
  const totalPages = Math.ceil(totalOrders / limit);

  return {
    orders,
    pagination: {
      page,
      limit,
      totalOrders,
      totalPages,
    },
  };
};

export const updateOrderStatusService = async (
  status: OrderStatus,
  id: string,
) => {
  const order = await Order.findById(id).select("-createdAt -__v");

  if (!order) {
    throw new AppError("Order not found.", 404);
  }

  order.status = status;

  const updatedOrder = await order.save();

  return updatedOrder;
};

export const cancelOrderService = async (
  id: string,
  userId: mongoose.Types.ObjectId,
) => {
  const order = await Order.findOne({ _id: id, userId: userId }).select(
    "-createdAt -__v",
  );

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (order.status !== "pending") {
    throw new AppError("Your order cannot be cancelled at this stage", 400);
  }

  order.status = "cancelled";

  const cancelledOrder = await order.save();

  return cancelledOrder;
};
