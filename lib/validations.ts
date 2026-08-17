import { z } from "zod";

export const businessTypes = [
  { value: "retail_store", label: "Retail Store" },
  { value: "gun_range", label: "Gun Range" },
  { value: "distributor", label: "Distributor" },
  { value: "sporting_goods", label: "Sporting Goods Retailer" },
  { value: "ecommerce_retailer", label: "Ecommerce Retailer" },
  { value: "other", label: "Other" },
] as const;

export const retailerApplicationSchema = z
  .object({
    businessName: z.string().min(2, "Business name is required"),
    contactFirstName: z.string().min(1, "First name is required"),
    contactLastName: z.string().min(1, "Last name is required"),
    businessEmail: z.string().email("Enter a valid email address"),
    phone: z.string().min(7, "Enter a valid phone number"),
    website: z.string().optional().or(z.literal("")),
    address: z.string().min(2, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State / province is required"),
    postalCode: z.string().min(3, "Postal / ZIP code is required"),
    country: z.string().min(1, "Country is required"),
    businessType: z.enum([
      "retail_store",
      "gun_range",
      "distributor",
      "sporting_goods",
      "ecommerce_retailer",
      "other",
    ]),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    confirmLegitimate: z.literal(true, {
      errorMap: () => ({ message: "You must confirm this before applying" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RetailerApplicationInput = z.infer<typeof retailerApplicationSchema>;
