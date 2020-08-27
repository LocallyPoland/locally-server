const updateOrder = async (res, req) => {
  const { id } = req.params;
  const { status, products } = req.body;
  if (status === 'cancelled') {
    await Order.findByIdAndUpdate(id, { status }).exec(err => {
      if (err) {
        console.log(err);
        res.sendStatus(400)
      }
    })
    await products.forEach((prod) => {
      Product.findByIdAndUpdate(prod.id, { $inc: { quantity: +prod.quantity } }).exec(err => {
        if (err) {
          console.log(err);
          res.sendStatus(400)
        }
        res.sendStatus(200)
      })
    })
  } else {
    res.sendStatus(200)
  }
}

module.exports = {
  updateOrder
}