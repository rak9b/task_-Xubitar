import { prisma } from "./prisma";
import { PreorderFormValues } from "./validations";
import { Prisma } from "@prisma/client";

export interface GetPreordersParams {
  status?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export interface SerializedPreorder {
  id: string;
  title: string;
  sku: string;
  customer: string;
  quantity: number;
  price: number;
  description: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function getPreorders({
  status = "all",
  sort = "newest",
  page = 1,
  pageSize = 10,
}: GetPreordersParams) {
  // 1. Where clause (filtering)
  const where: Prisma.PreorderWhereInput = {};
  if (status === "active") {
    where.active = true;
  } else if (status === "inactive") {
    where.active = false;
  }

  // 2. OrderBy clause (sorting)
  let orderBy: Prisma.PreorderOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "oldest") {
    orderBy = { createdAt: "asc" };
  } else if (sort === "title_asc") {
    orderBy = { title: "asc" };
  } else if (sort === "title_desc") {
    orderBy = { title: "desc" };
  } else if (sort === "price_asc") {
    orderBy = { price: "asc" };
  } else if (sort === "price_desc") {
    orderBy = { price: "desc" };
  }

  // 3. Pagination skip/take
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  try {
    const [totalCount, preorders] = await Promise.all([
      prisma.preorder.count({ where }),
      prisma.preorder.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    // Convert Prisma.Decimal to number to avoid Client Component serialization errors
    const serializedPreorders: SerializedPreorder[] = preorders.map((preorder) => ({
      ...preorder,
      price: Number(preorder.price),
    }));

    return {
      preorders: serializedPreorders,
      totalCount,
      currentPage: page,
      totalPages,
    };
  } catch (error) {
    console.error("Error in getPreorders service:", error);
    throw new Error("Failed to fetch preorders");
  }
}

export async function getPreorderById(id: string): Promise<SerializedPreorder | null> {
  try {
    const preorder = await prisma.preorder.findUnique({
      where: { id },
    });
    if (!preorder) return null;
    return {
      ...preorder,
      price: Number(preorder.price),
    };
  } catch (error) {
    console.error("Error in getPreorderById service:", error);
    throw new Error("Failed to fetch preorder");
  }
}

export async function createPreorder(data: PreorderFormValues): Promise<SerializedPreorder> {
  try {
    const preorder = await prisma.preorder.create({
      data: {
        title: data.title,
        sku: data.sku,
        customer: data.customer,
        quantity: data.quantity,
        price: new Prisma.Decimal(data.price),
        description: data.description || null,
        active: data.active,
      },
    });
    return {
      ...preorder,
      price: Number(preorder.price),
    };
  } catch (error) {
    console.error("Error in createPreorder service:", error);
    throw new Error("Failed to create preorder");
  }
}

export async function updatePreorder(id: string, data: PreorderFormValues): Promise<SerializedPreorder> {
  try {
    const preorder = await prisma.preorder.update({
      where: { id },
      data: {
        title: data.title,
        sku: data.sku,
        customer: data.customer,
        quantity: data.quantity,
        price: new Prisma.Decimal(data.price),
        description: data.description || null,
        active: data.active,
      },
    });
    return {
      ...preorder,
      price: Number(preorder.price),
    };
  } catch (error) {
    console.error("Error in updatePreorder service:", error);
    throw new Error("Failed to update preorder");
  }
}

export async function deletePreorder(id: string): Promise<void> {
  try {
    await prisma.preorder.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error in deletePreorder service:", error);
    throw new Error("Failed to delete preorder");
  }
}

export async function togglePreorderStatus(id: string): Promise<SerializedPreorder> {
  try {
    const existing = await prisma.preorder.findUnique({
      where: { id },
      select: { active: true },
    });
    if (!existing) throw new Error("Preorder not found");

    const preorder = await prisma.preorder.update({
      where: { id },
      data: { active: !existing.active },
    });

    return {
      ...preorder,
      price: Number(preorder.price),
    };
  } catch (error) {
    console.error("Error in togglePreorderStatus service:", error);
    throw new Error("Failed to toggle preorder status");
  }
}
