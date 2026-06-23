import Link from "next/link";

export default function ProductsPage() {
  return (
    <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/"
            className="text-sm text-foreground/50 hover:text-foreground/80 transition-colors"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold mt-2">Products</h1>
          <p className="text-foreground/60 mt-1">
            Manage your product catalog
          </p>
        </div>
        <button className="rounded-lg bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity">
          + Add Product
        </button>
      </div>

      <div className="rounded-xl border border-foreground/10 p-12 text-center text-foreground/40">
        <p className="text-lg">Product list will appear here</p>
        <p className="text-sm mt-1">
          Run the database migration and seed to get started
        </p>
      </div>
    </main>
  );
}
