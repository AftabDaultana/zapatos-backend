import { getProductsByCategoryId } from "../controllers/productController.js";
import Order from "../models/order.js";
import { getLocalDateBoundaries } from "../utils/date.js";

const revenueStatuses = ["confirmed", "processing", "shipped", "delivered"];

export const salesService = async () => {
  const { startOfYesterday, startOfToday, startOfTomorrow, startOfMonth } =
    getLocalDateBoundaries();
  const result = await Order.aggregate([
    {
      $match: {
        status: { $in: revenueStatuses },
      },
    },
    {
      $facet: {
        today: [
          {
            $match: {
              createdAt: {
                $gte: startOfToday,
                $lt: startOfTomorrow,
              },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$total" },
            },
          },
        ],
        yesterday: [
          {
            $match: {
              createdAt: {
                $gte: startOfYesterday,
                $lt: startOfToday,
              },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$total" },
            },
          },
        ],
        thisMonth: [
          {
            $match: {
              createdAt: {
                $gte: startOfMonth,
                $lt: startOfTomorrow,
              },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$total" },
            },
          },
        ],
        allTime: [
          {
            $group: {
              _id: null,
              total: { $sum: "$total" },
            },
          },
        ],
      },
    },
  ]);

  const sales = {
    today: result[0]?.today[0]?.total ?? 0,
    yesterday: result[0]?.yesterday[0]?.total ?? 0,
    thisMonth: result[0]?.thisMonth[0]?.total ?? 0,
    allTime: result[0]?.allTime[0]?.total ?? 0,
  };

  return sales;
};

export const orderSummaryService = async () => {
  const { startOfToday, startOfTomorrow } = getLocalDateBoundaries();

  const result = await Order.aggregate([
    {
      $facet: {
        today: [
          {
            $match: {
              createdAt: {
                $gte: startOfToday,
                $lt: startOfTomorrow,
              },
            },
          },
          {
            $count: "count",
          },
        ],
        pending: [
          {
            $match: {
              status: "pending",
            },
          },
          {
            $count: "count",
          },
        ],
        delivered: [
          {
            $match: {
              status: "delivered",
            },
          },
          {
            $count: "count",
          },
        ],
      },
    },
  ]);

  const orders = {
    today: result[0]?.today[0]?.count ?? 0,
    pending: result[0]?.pending[0]?.count ?? 0,
    delivered: result[0]?.delivered[0]?.count ?? 0,
  };

  return orders;
};

export const weeklyOrdersService = async () => {
  const { startOfWeek, startOfNextWeek } = getLocalDateBoundaries();
  const result = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfWeek,
          $lt: startOfNextWeek,
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
            timezone: "Asia/Karachi",
          },
        },
        total: {
          $sum: 1,
        },
        cancelled: {
          $sum: {
            $cond: [
              {
                $eq: ["$status", "cancelled"],
              },
              1,
              0,
            ],
          },
        },
        delivered: {
          $sum: {
            $cond: [
              {
                $eq: ["$status", "delivered"],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startOfWeek);
    date.setUTCDate(date.getUTCDate() + index);

    return date;
  });

  const weeklyOrders = weekDays.map((date) => {
    const dateString = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Karachi",
    }).format(date);

    const dayData = result.find((item) => item._id === dateString);

    return {
      date: dateString,
      total: dayData?.total ?? 0,
      cancelled: dayData?.cancelled ?? 0,
      delivered: dayData?.delivered ?? 0,
    };
  });

  return weeklyOrders;
};

export const bestSellingCategoriesService = async () => {
  const result = await Order.aggregate([
    {
      $match: {
        status: {
          $in: revenueStatuses,
        },
      },
    },
    {
      $unwind: "$items",
    },
    {
      $project: {
        _id: 1,
        status: 1,
        productId: "$items.productId",
        quantity: "$items.quantity",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $lookup: {
        from: "subcategories",
        localField: "product.subCategoryId",
        foreignField: "_id",
        as: "subcategory",
      },
    },
    {
      $unwind: "$subcategory",
    },
    {
      $lookup: {
        from: "categories",
        localField: "subcategory.categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $group: {
        _id: "$category._id",
        name: { $first: "$category.name" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
    {
      $group: {
        _id: null,
        categories: {
          $push: "$$ROOT",
        },
        total: {
          $sum: "$count",
        },
      },
    },
    {
      $project: {
        _id: 0,
        categories: {
          $map: {
            input: "$categories",
            as: "category",
            in: {
              name: "$$category.name",
              count: "$$category.count",
              percentage: {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$$category.count", "$total"] },
                      100,
                    ],
                  },
                  2,
                ],
              },
            },
          },
        },
      },
    },
  ]);

  return result[0]?.categories ?? [];
};

export const annualRevenueService = async () => {
  const result = await Order.aggregate([
    {
      $match: {
        status: {
          $in: revenueStatuses,
        },
      },
    },
    {
      $group: {
        _id: {
          $year: {
            date: "$createdAt",
            timezone: "Asia/Karachi",
          },
        },
        revenue: {
          $sum: "$total",
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id",
        revenue: 1,
      },
    },
  ]);

  return result;
};

export const monthlyRevenueService = async () => {
  const result = await Order.aggregate([
    {
      $match: {
        status: {
          $in: revenueStatuses,
        },
      },
    },
  ]);

  return result;
};
