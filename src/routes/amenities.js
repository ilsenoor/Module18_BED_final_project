import express from "express";
import createAmenity from "../services/amenities/createAmenity.js";
import getAmenities from "../services/amenities/getAmenities.js";
import getAmenityById from "../services/amenities/getAmenityByID.js";
import deleteAmenity from "../services/amenities/deleteAmenity.js";
import updateAmenityById from "../services/amenities/updateAmenityByID.js";
import notFoundErrorHandler from "../middleware/notFoundErrorHandler.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const {} = req.query;
  const amenities = await getAmenities();
  res.status(200).json(amenities);
});

router.post("/", authMiddleware, async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required." });
  }

  const newAmenity = await createAmenity(name);
  res.status(201).json(newAmenity);
});

router.get(
  "/:id",
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const amenity = await getAmenityById(id);

      res.status(200).json(amenity);
    } catch (error) {
      next(error);
    }
  },
  notFoundErrorHandler
);

router.put(
  "/:id",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const updatedAmenity = await updateAmenityById(id, name);
      res.status(200).json(updatedAmenity);
    } catch (error) {
      next(error);
    }
  },
  notFoundErrorHandler
);

router.delete(
  "/:id",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedAmenityId = await deleteAmenity(id);

      res.status(200).json({
        message: `Amenity with id ${deletedAmenityId} was deleted!`,
      });
    } catch (error) {
      next(error);
    }
  },
  notFoundErrorHandler
);

export default router;
