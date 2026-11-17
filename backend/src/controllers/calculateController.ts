import type { NextFunction, Request, Response } from "express";
import { calculateSchema } from "../validators/calculateSchema";
import { aggregateReport } from "../services/reportAggregator";

export function postCalculate(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = calculateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Validation failed",
        details: parsed.error.flatten(),
      });
      return;
    }
    const report = aggregateReport(parsed.data);
    res.json(report);
  } catch (error) {
    next(error);
  }
}
