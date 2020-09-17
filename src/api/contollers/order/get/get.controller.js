const {Order} = require("../../../models");

const getAllOrders = async (req, res) => {
    const ordersHistory = await Order.find({$or: [{status: "cancelled"}, {status: "done"}]})
        .populate({
            path: "userID",
            select: "fName lName phone email -_id",
        })

    const activeOrders = await Order.find({status: "created"})
        .populate({
            path: "userID",
            select: "fName lName phone email -_id",
        })

    res.json({ordersHistory, activeOrders});
};

const getOrder = async (req, res) => {
    const {id} = req.params;
    return await Order.findById(id).populate({
        path: "userID",
        select: "fName lName phone email _id",
    }).exec((err, order) => {
        if (err) {
            console.error(err)
            res.sendStatus(400)
        }
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
                        createdAt: {$gte: monthFrom, $lte: monthTo}
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

const getOrdersHistory = async (req, res) => {
    const {from, to, status, sort, search} = req.query;

    const sortByDate = () => {
        if ((from === undefined && to === undefined) ||( from === "undefined"&& to === "undefined")) {
            return {
                createdAt: {$gte: new Date(0), $lte: new Date()}
            }
        } else {
            return {
                createdAt: {$gte: new Date(from), $lte: new Date(to)}
            }
        }
    }
    console.log(sortByDate())

    const sortForSearch = () => {
        if (sort === "up") return {
            createdAt: -1
        }
        if (sort === "down") return {createdAt: 1}
        if (sort === undefined) return {createdAt: -1}
    }

    const formattedStatus = () => {
        if (!status) {
            return {status: {$in: ['done', 'cancelled']}}
        }
        return {status: status}
    };

    if (search) {
        const searchedHistory = await Order.aggregate([
            {
                $match: {status: {$in: ['done', 'cancelled']}}
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userID",
                    foreignField: "_id",
                    as: "userID",
                },
            },
            {
                $match: {
                    $or: [
                        {"userID.email": {$regex: search}},
                        {"userID.phone": +search},
                        {"numOfOrder": {$regex: search}}
                    ]
                }
            },
        ])
        res.send({history: searchedHistory});
    } else {

        const filteredHistory = await Order.aggregate([
            {
                $match: sortByDate()
            },
            {
                $match: formattedStatus()
            },
            {
                $sort: sortForSearch()
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userID",
                    foreignField: "_id",
                    as: "userID",
                },
            },
        ]);
        res.send({history: filteredHistory});
    }

}

module.exports = {getAllOrders, getOrder, userOrderHistory, orderStats, getOrdersHistory};