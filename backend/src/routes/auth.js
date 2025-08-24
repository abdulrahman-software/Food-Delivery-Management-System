import express from "express";
import oracledb from "oracledb";
import bcrypt from "bcrypt";
import ExpressError from "../utils/ExpressError.js";
import { wrapAsync } from "../utils/ExpressError.js";
const router = express.Router();
const configureDBObject = {
    user: "food_delivery",
    password: "pass",
    connectString: "localhost/XEPDB1"
}
const hashPassword = async (password)=> (await bcrypt.hash(password, 12));
const verifyPassword = async (password, hashedPassword) => (await bcrypt.compare(password, hashedPassword));
router.post("/customers", wrapAsync(async (req, res) => {
    console.log("LOGIN CUSTOMER");
    const { email, password } = req.body;
    let database;
    let response;

    const SQL = "SELECT customer_id, password FROM CUSTOMER WHERE email = :email";

    try {
        database = await oracledb.getConnection(configureDBObject);
        response = await database.execute(
            SQL,
            { email },
            { autoCommit: true }
        );

        if (response.rows.length === 0) return res.status(401).send(false);
        else {
            const DBPassword = response.rows[0][1];
            const passwordMatch = await verifyPassword(password, DBPassword);
            if (!passwordMatch) return res.send(false);
            const customer_id = response.rows[0][0];
            req.session.customer_id = customer_id;
            return res.send(true);
        }
    } catch (e) {
        throw new ExpressError(401, "Server side error");
    } finally {
        try {
            if (database) await database.close();
        } catch (e) {
            console.error("Error closing DB:", e);
        }
    }
}));

router.post("/restaurants", wrapAsync(async (req, res) => {
    console.log("LOGIN RESTAURANT");
    const { email, password } = req.body;
    let database;
    let response;

    const SQL = "SELECT restaurant_id, password FROM RESTAURANT WHERE email = :email";

    try {
        database = await oracledb.getConnection(configureDBObject);
        response = await database.execute(
            SQL,
            { email },
            { autoCommit: true }
        );
        if (response.rows.length === 0) return res.status(401).send(false);
        else {
            const DBPassword = response.rows[0][1];
            const passwordMatch = await verifyPassword(password, DBPassword);
            if (!passwordMatch) return res.send(false);
            const restaurant_id = response.rows[0][0];
            req.session.restaurant_id = restaurant_id;
            return res.send(true);
        }
    } catch (e) {
        throw new ExpressError(401, "Server side error");
    } finally {
        try {
            if (database) await database.close();
        } catch (e) {
            console.error("Error closing DB:", e);
        }
    }
}));
router.get("/logout", (req, res)=> { 
    try {
        req.session.destroy();
        return res.status(201).send("Destroyed");
    } catch (e) {
        throw new ExpressError(500, "Failed to destroy cookie");
    }
});
export default router;
export { hashPassword, verifyPassword };