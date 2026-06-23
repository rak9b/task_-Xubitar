import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PreorderForm from "../../components/PreorderForm";

export default async function EditPreorderPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const preorder = await prisma.preorder.findUnique({
    where: { id: params.id },
  });

  if (!preorder) {
    notFound();
  }

  return (
    <main className="flex-1 p-8 bg-neutral-100 min-h-screen">
      <PreorderForm initialData={preorder} />
    </main>
  );
}
