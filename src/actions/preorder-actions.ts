"use server";

import { revalidatePath } from "next/cache";
import * as service from "@/lib/preorder-service";
import { preorderSchema, PreorderFormValues } from "@/lib/validations";

export async function togglePreorderStatusAction(id: string) {
  try {
    const updated = await service.togglePreorderStatus(id);
    revalidatePath("/preorders");
    return { success: true, active: updated.active };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to toggle status" };
  }
}

export async function deletePreorderAction(id: string) {
  try {
    await service.deletePreorder(id);
    revalidatePath("/preorders");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete preorder" };
  }
}

export async function createPreorderAction(data: PreorderFormValues) {
  try {
    const validated = preorderSchema.parse(data);
    const created = await service.createPreorder(validated);
    revalidatePath("/preorders");
    return { success: true, data: created };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create preorder" };
  }
}

export async function updatePreorderAction(id: string, data: PreorderFormValues) {
  try {
    const validated = preorderSchema.parse(data);
    const updated = await service.updatePreorder(id, validated);
    revalidatePath("/preorders");
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update preorder" };
  }
}
