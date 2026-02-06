"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import type { ResortInput } from "@/types";
import { revalidatePath } from "next/cache";

export async function createResort(input: ResortInput) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  if (!input.name?.trim()) {
    return { error: "Resort name is required" };
  }

  const { error } = await supabase.from("resorts").insert({
    name: input.name.trim(),
    height_m: input.height_m ?? null,
    lifts: input.lifts ?? null,
    skislopes_km: input.skislopes_km ?? null,
    location_area: input.location_area ?? null,
    location_city: input.location_city ?? null,
    location_country: input.location_country ?? null,
    approved: false,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function approveResort(resortId: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("resorts")
    .update({ approved: true })
    .eq("id", resortId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/adminDashboard");
  revalidatePath("/info");
  revalidatePath("/dashboard/add-day");
  
  return { success: true };
}

export async function declineResort(resortId: string, message: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Get resort details and submitter before deleting
  const { data: resort, error: fetchError } = await supabase
    .from("resorts")
    .select("name, created_by")
    .eq("id", resortId)
    .single();

  if (fetchError || !resort) {
    return { error: "Resort not found" };
  }

  // TODO: Create notification for the user who submitted the resort
  // This will be implemented once the notifications table is created
  // await createNotification({
  //   user_id: resort.created_by,
  //   type: 'resort_declined',
  //   title: 'Resort Declined',
  //   message: `Your resort "${resort.name}" was declined. Reason: ${message}`,
  //   resort_id: resortId
  // });

  const { error } = await supabase
    .from("resorts")
    .delete()
    .eq("id", resortId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/adminDashboard");
  
  return { success: true };
}
