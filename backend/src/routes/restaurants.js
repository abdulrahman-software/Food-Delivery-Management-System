import express from "express";
import oracledb from "oracledb";
import ExpressError from "../utils/ExpressError.js";
import { wrapAsync } from "../utils/ExpressError.js";
import { hashPassword } from "./auth.js";
const router = express.Router();
const configureDBObject = {
    user: "food_delivery",
    password: "pass",
    connectString: "localhost/XEPDB1"
}
router.post("/", wrapAsync(async (req, res) => {
    console.log("CREATE NEW RESTAURANT");
    const { name, email, password, city } = req.body;
    let database;

    const SQL_INSERT = `
        INSERT INTO RESTAURANT (name, email, password, city)
        VALUES (:name, :email, :hashedPassword, :city)
        RETURNING restaurant_id INTO :restaurant_id
    `;
    const hashedPassword = await hashPassword(password);
    try {
        database = await oracledb.getConnection(configureDBObject);

        const result = await database.execute(
            SQL_INSERT,
            {
                name,
                email,
                hashedPassword,
                city,
                restaurant_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            },
            { autoCommit: true }
        );

        const restaurant_id = result.outBinds.restaurant_id[0];
        console.log("Inserted restaurant ID:", restaurant_id);
        req.session.restaurant_id = restaurant_id;
        return res.status(201).send(true);

    } catch (e) {
        console.error("Error creating restaurant:", e);
        throw new ExpressError(401, "Server side error");
    } finally {
        try {
            if (database) await database.close();
        } catch (e) {
            console.error("Error closing DB:", e);
        }
    }
}));
router.get("/dishes", wrapAsync(async (req, res)=> {
    console.log("GET CUSTOMER MENU");
    let database;
    let response;
    const SQL = "SELECT dish_id, name, description, photo_url, price, quantity FROM DISH";
    try {
        database = await oracledb.getConnection(configureDBObject);
        response = await database.execute(SQL);
         if (response.rows.length === 0) return res.status(201).send([[]]);
         else {
         console.log("Success");
         return res.json(response.rows);
         }
        } catch(e) {
        console.log(e)
        throw new ExpressError(401, "Server side error");
    } finally {
        try {
            if (database) await database.close();
        } catch(e) {
            console.log(e);
        }
    }
}));
router.use("/", (req, res, next)=> {
     if (!req.session.restaurant_id) res.status(401).send("Unauthozied");
     else next();
    });
router.get("/current/dishes", wrapAsync(async (req, res)=> {
    console.log("GET RESTAURANT MENU");
    const restaurant_id = req.session.restaurant_id;
    let database;
    let response;
    const SQL = "SELECT dish_id, name, description, photo_url, price, quantity FROM DISH WHERE restaurant_id = :restaurant_id";
    try {
        database = await oracledb.getConnection(configureDBObject);
        response = await database.execute(SQL, {restaurant_id},
            {autoCommit: true });
         if (response.rows.length === 0) return res.status(201).send([[]]);
         else return res.json(response.rows);
        } catch(e) {
        console.log(e)
        throw new ExpressError(401, "Server side error");
    } finally {
        try {
            if (database) await database.close();
        } catch(e) {
            console.log(e);
        }
    }
}));
router.post("/dishes", wrapAsync(async (req, res) => {
  console.log("ADD A NEW DISH MENU");
  const { name, description, photo_url, price, quantity } = req.body;
  const restaurant_id = req.session.restaurant_id;
  let database;
    console.log(restaurant_id);
  const SQL_INSERT = `
    INSERT INTO DISH (restaurant_id, name, description, photo_url, price, quantity)
    VALUES (:restaurant_id, :name, :description, :photo_url, :price, :quantity)
    RETURNING dish_id INTO :dish_id
  `;

  try {
    database = await oracledb.getConnection(configureDBObject);

    const result = await database.execute(
      SQL_INSERT,
      {
        restaurant_id,
        name,
        description,
        photo_url,
        price,
        quantity,
        dish_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );
    const dish_id = result.outBinds.dish_id[0];
    return res.status(201).json({
      message: "Dish added successfully",
      dish_id: dish_id
    });

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

router.delete("/dishes/:dish_id", wrapAsync(async (req, res)=> {
    console.log("DELETE DISH");
    const {dish_id} = req.params;
    if (!dish_id) res.status(400).send([[]]);
    console.log("Dish id: "+dish_id);
    let database;
    let response;
    const SQL = "DELETE FROM DISH WHERE dish_id = :dish_id";
    try {
        database = await oracledb.getConnection(configureDBObject);
        response = await database.execute(SQL, {dish_id},
            {autoCommit: true });
         if (response.rowsAffected === 1) res.status(201).send([[]]);
         else {
         console.log("Failed");
         return res.json(response.rows);
         }
        } catch(e) {
            throw new ExpressError(401, "Server side error");
    } finally {
        try {
            if (database) await database.close();
        }
            catch(e) {
            console.log(e);
        }
    }
}));

export default router;