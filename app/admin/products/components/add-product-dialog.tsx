"use client"

import { useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import {
  createProductAdmin,
  type AdminCategory,
} from "@/data/admin"
import type { Product } from "@/data/product"

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL"] as const

const sizeQuantitiesSchema = z.object({
  XS: z.coerce.number().min(0, "Quantity must be >= 0"),
  S: z.coerce.number().min(0, "Quantity must be >= 0"),
  M: z.coerce.number().min(0, "Quantity must be >= 0"),
  L: z.coerce.number().min(0, "Quantity must be >= 0"),
  XL: z.coerce.number().min(0, "Quantity must be >= 0"),
})

const addProductFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  discountPercentage: z.coerce.number().min(0, "Discount must be >= 0"),
  taxPercentage: z.coerce.number().min(0, "Tax must be >= 0"),
  active: z.boolean(),
  sku: z.string().min(1, "SKU is required"),
  categoryId: z.string().min(1, "Category ID is required"),
  sizeQuantities: sizeQuantitiesSchema,
})

type AddProductFormValues = z.infer<typeof addProductFormSchema>

type SizeQuantitiesFormValues = z.infer<typeof sizeQuantitiesSchema>

const createEmptySizeQuantities = (): SizeQuantitiesFormValues => ({
  XS: 0,
  S: 0,
  M: 0,
  L: 0,
  XL: 0,
})

const addProductDefaultValues: AddProductFormValues = {
  name: "",
  description: "",
  price: 0,
  discountPercentage: 0,
  taxPercentage: 0,
  active: true,
  sku: "",
  categoryId: "",
  sizeQuantities: createEmptySizeQuantities(),
}

const addProductResolver = zodResolver(addProductFormSchema) as Resolver<AddProductFormValues>

export type AddProductDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (product: Product) => void
  categories: AdminCategory[]
  isCategoriesLoading: boolean
}

export default function AddProductDialog({
  open,
  onOpenChange,
  onCreated,
  categories,
  isCategoriesLoading,
}: AddProductDialogProps) {
  const form = useForm<AddProductFormValues>({
    resolver: addProductResolver,
    defaultValues: {
      ...addProductDefaultValues,
      sizeQuantities: createEmptySizeQuantities(),
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddProductSubmit = async (values: AddProductFormValues) => {
    setIsSubmitting(true)
    try {
      const normalizedSizeQuantities = SIZE_OPTIONS.reduce<SizeQuantitiesFormValues>(
        (acc, size) => {
          acc[size] = Number(values.sizeQuantities[size]) || 0
          return acc
        },
        createEmptySizeQuantities()
      )

      const payload: AddProductFormValues = {
        ...values,
        sizeQuantities: normalizedSizeQuantities,
      }

      const response = await createProductAdmin(payload)

      if (!response.success) {
        toast.error(response.error || "Failed to create product")
        return
      }

      const product = response.data?.product

      if (!product) {
        toast.error("Product payload missing in response")
        return
      }

      onCreated(product)
      form.reset({
        ...addProductDefaultValues,
        sizeQuantities: createEmptySizeQuantities(),
      })
    } catch (err) {
      console.error("Failed to create product:", err)
      toast.error("Failed to create product")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!isSubmitting) {
          onOpenChange(value)
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Provide core information about the product. You can upload images
            after creating the product.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAddProductSubmit)}
            className="space-y-5"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Shoot Your Shot" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. sp-003" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isCategoriesLoading || categories.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isCategoriesLoading
                                ? "Loading categories..."
                                : categories.length === 0
                                  ? "No categories found"
                                  : "Select a category"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discountPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount (%)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax (%)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      rows={5}
                      className={cn(
                        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
                        "border-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                        "dark:bg-input/30 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] md:text-sm"
                      )}
                      placeholder="Enter a detailed product description..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg border p-4">
              <p className="mb-3 font-medium">Size Quantities</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {SIZE_OPTIONS.map((size) => (
                  <FormField
                    key={size}
                    control={form.control}
                    name={`sizeQuantities.${size}` as const}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{size}</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} step="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                    />
                  </FormControl>
                  <div className="space-y-0.5">
                    <FormLabel className="!mt-0 font-medium">
                      Active Product
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Active products are visible to customers.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Spinner className="mr-2 size-4" />}
                Create Product
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}


