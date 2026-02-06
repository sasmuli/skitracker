"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import type { ResortInput } from "@/types";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/lib/actions/notifications";
import { getAdminUsers } from "@/lib/queries/users";

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

  const { data: newResort, error } = await supabase.from("resorts").insert({
    name: input.name.trim(),
    height_m: input.height_m ?? null,
    lifts: input.lifts ?? null,
    skislopes_km: input.skislopes_km ?? null,
    location_area: input.location_area ?? null,
    location_city: input.location_city ?? null,
    location_country: input.location_country ?? null,
    approved: false,
  }).select().single();

  if (error) {
    return { error: error.message };
  }

  // Notify all admins about the new resort submission
  if (newResort) {
    const adminIds = await getAdminUsers(supabase);
    
    for (const adminId of adminIds) {
      await createNotification({
        user_id: adminId,
        type: 'resort_submitted',
        title: 'New Resort Submission',
        message: `A new resort "${input.name.trim()}" has been submitted for approval.`,
        resort_id: newResort.id
      });
    }
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

  // Get resort details and submitter before approving
  const { data: resort, error: fetchError } = await supabase
    .from("resorts")
    .select("name, created_by")
    .eq("id", resortId)
    .single();

  if (fetchError || !resort) {
    return { error: "Resort not found" };
  }

  const { error } = await supabase
    .from("resorts")
    .update({ approved: true })
    .eq("id", resortId);

  if (error) {
    return { error: error.message };
  }

  // Create notification for the user who submitted the resort
  if (resort.created_by) {
    await createNotification({
      user_id: resort.created_by,
      type: 'resort_approved',
      title: 'Resort Approved',
      message: `Your resort "${resort.name}" has been approved and is now available!`,
      resort_id: resortId
    });
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

  // Create notification for the user who submitted the resort
  if (resort.created_by) {
    const notificationMessage = message.trim() 
      ? `Your resort "${resort.name}" was declined. Reason: ${message}`
      : `Your resort "${resort.name}" was declined.`;
    
    await createNotification({
      user_id: resort.created_by,
      type: 'resort_declined',
      title: 'Resort Declined',
      message: notificationMessage,
      resort_id: resortId
    });
  }

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
