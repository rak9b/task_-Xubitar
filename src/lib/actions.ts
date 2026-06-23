"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function toggleStatus(id: string, currentStatus: string) {
  const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
  try {
    await prisma.preorder.update({
      where: { id },
      data: { status: newStatus },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function deletePreorder(id: string) {
  try {
    await prisma.preorder.delete({
      where: { id },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete preorder:", error);
    return { success: false, error: "Failed to delete preorder" };
  }
}

export async function createOrUpdatePreorder(data: {
  id?: string;
  name: string;
  productCount: number;
  preorderWhen: string;
  startsAt: Date;
  endsAt?: Date | null;
  status: string;
}) {
  try {
    if (data.id) {
      await prisma.preorder.update({
        where: { id: data.id },
        data: {
          name: data.name,
          productCount: data.productCount,
          preorderWhen: data.preorderWhen,
          startsAt: data.startsAt,
          endsAt: data.endsAt,
          status: data.status,
        },
      });
    } else {
      await prisma.preorder.create({
        data: {
          name: data.name,
          productCount: data.productCount,
          preorderWhen: data.preorderWhen,
          startsAt: data.startsAt,
          endsAt: data.endsAt,
          status: data.status,
        },
      });
    }
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to save preorder:", error);
    return { success: false, error: "Failed to save preorder" };
  }
}
