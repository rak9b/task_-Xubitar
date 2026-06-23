// Re-export Prisma-generated types for convenience
export type { Preorder } from "@prisma/client";

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
