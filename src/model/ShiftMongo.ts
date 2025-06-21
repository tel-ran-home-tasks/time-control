import mongoose from "mongoose";

const BreakSchema = new mongoose.Schema({
    type: { type: String, enum: ["15m", "30m"], required: true },
    startedAt: { type: String, required: true },
    endedAt: String,
});

const ShiftSchema = new mongoose.Schema({
    employeeId: { type: String, required: true },
    start: { type: String, required: true },
    end: String,
    breaks: [BreakSchema]
});
export const ShiftModel = mongoose.model("Shift", ShiftSchema,'shift-collection');