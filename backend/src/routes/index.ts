import { Router } from "express";
import { getCountriesHandler, getFactors, getHealth, getMeta } from "../controllers/factorsController";
import { postCalculate } from "../controllers/calculateController";

export const router = Router();

router.get("/health", getHealth);
router.get("/countries", getCountriesHandler);
router.get("/factors", getFactors);
router.get("/meta", getMeta);
router.post("/calculate", postCalculate);
