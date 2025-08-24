import express from "express";
import oracledb from "oracledb";
import ExpressError from "../utils/ExpressError.js";
import { wrapAsync } from "../utils/ExpressError.js";
const router = express.Router();
const configureDBObject = {
    user: "food_delivery",
    password: "pass",
    connectString: "localhost/XEPDB1"
}
router.use("/", (req, res, next)=> {
     if (!req.session.customer_id) res.status(401).send("Unauthozied");
     else next();
    });
router.post("/", wrapAsync(async (req, res) => {
    console.log("NEW ORDER");
    let database;
    const { dish_id, address_id, paymentType } = req.body;
    const customer_id = req.session.customer_id;
    const SQL_GET_RESTAURANT_ID = `SELECT restaurant_id FROM DISH WHERE dish_id = :dish_id`;
    const SQL_INSERT = `
        INSERT INTO "ORDER" (customer_id, restaurant_id, address_id, order_date, payment_type)
        VALUES (:customer_id, :restaurant_id, :address_id, SYSDATE, :paymentType)
        RETURNING order_id INTO :order_id
    `;

    try {
        database = await oracledb.getConnection(configureDBObject);
        const getRestaurantId = await database.execute(SQL_GET_RESTAURANT_ID, { dish_id });
        const restaurant_id = getRestaurantId.rows[0][0];
        const result = await database.execute(
            SQL_INSERT,
            {
                customer_id,
                restaurant_id,
                address_id,
                paymentType,
                order_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            },
            { autoCommit: true }
        );

        const order_id = result.outBinds.order_id[0];
        console.log("Inserted order ID:", order_id);
        req.session.order_id = order_id;
        return res.status(201).json({ message: " success"});

    } catch (e) {
        console.log(e);
        throw new ExpressError(401, "Server side error, order failed");
    } finally {
        try {
            if (database) await database.close();
        } catch (e) {
            console.error("Error closing DB:", e);
        }
    }
}));
router.post("/items", wrapAsync(async (req, res) => {
    console.log("NEW ITEMS ORDER");
    const { dish_id, quantity, price } = req.body;
    const order_id = req.session.order_id;
    let database;
    const SQL_INSERT = `
        INSERT INTO ORDERITEM (order_id, dish_id, quantity, price)
        VALUES (:order_id, :dish_id, :quantity, :price)
    `;

    try {
        database = await oracledb.getConnection(configureDBObject);

        const result = await database.execute(
            SQL_INSERT,
            { order_id, dish_id, quantity, price },
            { autoCommit: true }
        );
        return res.status(201).json(result);

    } catch (e) {
      throw new ExpressError(401, "Server side error, order_id not found");
    } finally {
        try {
            if (database) await database.close();
        } catch (e) {
            console.error("Error closing DB:", e);
        }
    }
}));

export default router;