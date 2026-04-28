import z from "zod";

export const formSchema = z
  .object({ 
    product_type: z
      .string("Product type is required"),
    include_products: z.array(z.union([z.string(), z.number()])).optional(),
    exclude_products: z.array(z.union([z.string(), z.number()])).optional(),
    include_categories: z.array(z.union([z.string(), z.number()])).optional(),
  })
