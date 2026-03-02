import express from "express";
import cors from "cors";
import { supabase } from "../supabase/supbase_connect";
import { sendToAll } from "../websockets/websockets";

const router = express.Router();
router.use(express.json());

router.get("/", (req, res) => {
  res.send("working!");
});

router.get("/orders", async (req, res) => {
  try {
  } catch {}
});

router.get("/order-history", async (req, res) => {
  const today = new Date();
  const start = today.toISOString().split("T")[0]; // YYYY-MM-DD

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const end = tomorrow.toISOString().split("T")[0];
  try {
    // const order = req.body;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .gte("created_at", start)
      .lte("created_at", end)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ success: true, Orders: data });
  } catch (err) {
    console.error("FULL ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : err,
    });
  }
});

router.post("/update-order", async (req, res) => {
  try {
    const order = req.body;

    const { data, error } = await supabase
      .from("orders")
      .update({ status: order.status })
      .eq("id", order.id);

    if (error) throw error;
    sendToAll({
      type: "UPDATE_ORDER",
      id: order.id,
      status: order.status,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("FULL ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : err,
    });
  }
});

export default router;
