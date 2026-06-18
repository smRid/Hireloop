const express = require("express");
const { database } = require("../config/db");
const { ObjectId } = require("mongodb");
const router = express.Router();

const userCollection = database.collection("user");

router.patch("/set-role", async (req, res) => {
  try {
    const { userId, role } = req.body;
    const filter = { _id: new ObjectId(userId) };
    const updateDoc = {
      $set: {
        role: role,
      },
    };
    const result = await userCollection.updateOne(filter, updateDoc);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
