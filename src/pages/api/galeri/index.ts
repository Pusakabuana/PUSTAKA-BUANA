import { NextApiRequest, NextApiResponse } from "next";
import Galeri from "@/lib/models/galeri";
import { connectDB } from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const data = await Galeri.find().sort({ createdAt: -1 });
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: "Gagal mengambil data galeri" });
    }
  } else {
    res.status(405).json({ error: "Metode tidak diizinkan" });
  }
}
