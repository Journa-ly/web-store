import { createShopifyCustomer } from "clients/shopify";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Call the helper function from your pre-configured Axios client
    const data = await createShopifyCustomer(email);

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error("Shopify create customer error:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
