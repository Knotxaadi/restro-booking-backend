import express from "express";
import cors from "cors";
import { supabase } from "../supabase/supbase_connect";
import { sendToAll } from "../websockets/websockets";

const router = express.Router();
router.use(express.json());

router.get("/", (req, res) => {
  res.send("working!");
});

router.post("/order-info", async (req, res) => {
  try {
    const id_info = req.body;
    // console.log(id);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id_info.id)
      .single();

    res.json({ success: true, data: data });
  } catch (err) {
    console.error("FULL ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : err,
    });
  }
});

router.post("/add-order", async (req, res) => {
  try {
    const order = req.body;

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          id: order.id,
          tableNumber: order.tableNumber,
          customerName: order.customerName,
          items: order.items,
          status: order.status,
          created_at: order.createdAt,
          totalAmount: order.totalAmount,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    sendToAll({
      type: "NEW_ORDER",
      new_order: {
        id: data.id,
        tableNumber: data.tableNumber,
        customerName: data.customerName,
        items: data.items,
        status: data.status,
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        totalAmount: data.totalAmount,
      },
    });
    res.json({ success: true, data: data.id });
  } catch (err) {
    console.error("FULL ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : err,
    });
  }
});

export default router;
