import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { retailerApplicationSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = retailerApplicationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid application" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  if (!isSupabaseConfigured()) {
    // Demo mode: nothing to persist to. The UI still shows the real
    // "application submitted" confirmation state.
    return NextResponse.json({ ok: true, demo: true });
  }

  const supabase = createClient()!;

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: data.businessEmail,
    password: data.password,
  });

  if (signUpError || !signUpData.user) {
    return NextResponse.json(
      { error: signUpError?.message ?? "Could not create account" },
      { status: 400 }
    );
  }

  const userId = signUpData.user.id;

  // The `on_auth_user_created` trigger already inserted a bare profile row —
  // fill it in with the business details from the application.
  await supabase
    .from("profiles")
    .update({
      business_name: data.businessName,
      contact_first_name: data.contactFirstName,
      contact_last_name: data.contactLastName,
      phone: data.phone,
      business_type: data.businessType,
    })
    .eq("id", userId);

  const { error: applicationError } = await supabase.from("retailer_applications").insert({
    profile_id: userId,
    business_name: data.businessName,
    contact_first_name: data.contactFirstName,
    contact_last_name: data.contactLastName,
    business_email: data.businessEmail,
    phone: data.phone,
    website: data.website || null,
    address: data.address,
    city: data.city,
    state: data.state,
    postal_code: data.postalCode,
    country: data.country,
    business_type: data.businessType,
    status: "pending",
  });

  if (applicationError) {
    return NextResponse.json({ error: applicationError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
