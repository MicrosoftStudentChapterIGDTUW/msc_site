import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";

export async function GET() {
  try {
    console.log("🔄 Attempting to connect to MongoDB...");
    const conn = await connectToDatabase();
    
    console.log("✅ Connection successful!");
    
    return NextResponse.json({
      success: true,
      message: "MongoDB connected successfully ✅",
      database: conn.connection.db.databaseName,
      host: conn.connection.host,
    });
  } catch (error: any) {
    console.error("❌ DB Connection Error:", error.message);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        hint: "Make sure .env.local has correct MONGODB_URI",
      },
      { status: 500 }
    );
  }
}
