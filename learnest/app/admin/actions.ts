"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

export async function setReportStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const statut = String(formData.get("statut"));
  if (!["corrige", "rejete"].includes(statut)) return;
  await createServiceClient().from("error_reports").update({ statut }).eq("id", id);
  revalidatePath("/admin");
}
