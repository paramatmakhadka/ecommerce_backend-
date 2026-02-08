const express = require("express");
const router = express.Router();
const {
	addOrderItems,
	getOrders,
	getOrderById,
	updateOrderStatus,
	deleteOrder,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

// Allow guests to post, but if token is present, protect will set req.user
const optionalProtect = (req, res, next) => {
    if (req.headers.authorization) {
        return protect(req, res, next);
    }
    next();
};

router.route("/").post(optionalProtect, addOrderItems).get(protect, admin, getOrders);
router.route("/:id").get(getOrderById).delete(protect, admin, deleteOrder);
router.route("/:id/status").put(protect, admin, updateOrderStatus);

module.exports = router;
