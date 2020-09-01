const {Order} = require("../../../models");

const getAllOrders = async (req, res) => {

    return await Order.find({})
        .populate({
            path: "userID",
            select: "fName lName phone email -_id",
        })
        .exec((err, news) => {
            if (err) return res.send(err);
            res.send(news);
        });
};

const getOrder = async (req, res) => {
    const {id} = req.body;
    return await Order.findById(id).exec((err, order) => {
        if (err) return res.send(err);
        res.send(order);
    });
};

const userOrderHistory = (req, res) => {
    const {id} = req.body;

    Order.find({userID: id})
        .exec((err, orders) => {
            if (err) {
                res.sendStatus(400)
            }
            res.send(orders)
        })
}

const orderStats = async (req, res) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const yearForSearch = new Date(`${year - 1}-01-01`);
    const monthForSearch = new Date(`${year}-0${month}-01`);
    const quarterForSearch = new Date(`${year}-0${month - 3}-01`);

    const ordersPerYear = await Order.aggregate([
        {
            $match: {
                createdAt: {$gte: yearForSearch}
            }
        },
        {
            $group: {
                _id: null,
                totalSum: {$sum: "$sum"}
            }
        },
        {
            $project: {
                _id: 0,
                totalSum: 1
            }
        }
    ]);
    const ordersPerMonth = await Order.aggregate([
        {
            $match: {
                createdAt: {$gte: monthForSearch}
            }
        },
        {
            $group: {
                _id: null,
                totalSum: {$sum: "$sum"}
            }
        },
        {
            $project: {
                _id: 0,
                totalSum: 1
            }
        }
    ]);
    const ordersPerQuarter = await Order.aggregate([
        {
            $match: {
                createdAt: {$gte: quarterForSearch}
            }
        },
        {
            $group: {
                _id: null,
                totalSum: {$sum: "$sum"}
            }
        },
        {
            $project: {
                _id: 0,
                totalSum: 1
            }
        }
    ]);
    const ordersPerAllTime = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalSum: {$sum: "$sum"}
            }
        },
        {
            $project: {
                _id: 0,
                totalSum: 1
            }
        }
    ]);

    const length = await Order.countDocuments();
    const ordersLengthPerYear = await Order.find({createdAt: {$gte: yearForSearch}});
    const ordersLengthPerMonth = await Order.find({createdAt: {$gte: monthForSearch}});
    const ordersLengthPerQuarter = await Order.find({createdAt: {$gte: quarterForSearch}});

    const data = {};

    data.ordersSumPerMonth = ordersPerMonth.length === 0 ? 0 : ordersPerMonth[0].totalSum;
    data.ordersSumPerYear = ordersPerYear.length === 0 ? 0 : ordersPerYear[0].totalSum;
    data.ordersSumPerQuarter = ordersPerQuarter.length === 0 ? 0 : ordersPerQuarter[0].totalSum;
    data.ordersSumPerAllTime = ordersPerAllTime.length === 0 ? 0 : ordersPerAllTime[0].totalSum;
    data.ordersLengthPerAllTime = length;
    data.ordersLengthPerYear = ordersLengthPerYear.length;
    data.ordersLengthPerMonth = ordersLengthPerMonth.length;
    data.ordersLengthPerQuarter = ordersLengthPerQuarter.length;

    const monthsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const months = {};

    monthsArray.map(async (month, i) => {
            const monthFrom = new Date(`${year}-${month}-01`);
            const monthTo = new Date(`${year}-${month}-31`);
            const ordersPerMonth = await Order.aggregate([
                {
                    $match: {
                        createdAt: {$gte: monthFrom, $lte:monthTo }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalSum: {$sum: "$sum"}
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalSum: 1
                    }
                }
            ]);
            months[i + 1] = ordersPerMonth.length === 0 ? 0 : ordersPerMonth[0].totalSum;

            if (i === monthsArray.length - 1) {
                return res.send({data, months});
            }
            // console.log(months)
        }
    )

}

module.exports = {getAllOrders, getOrder, userOrderHistory, orderStats};