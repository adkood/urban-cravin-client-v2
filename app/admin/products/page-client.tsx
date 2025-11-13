"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type Resolver } from "react-hook-form"
import {
  PlusIcon,
  RefreshCcwIcon,
  ImageIcon,
  TagIcon,
  TrashIcon,
} from "lucide-react"
import { toast } from "sonner"

import {
  filterProductsAction,
  type FilterProductsData,
  type Product,
} from "@/data/product"
import {
  createProductAdmin,
  uploadProductImageAdmin,
  updateProductTagsAdmin,
  deleteProductAdmin,
  deleteProductImageAdmin,
  getCategoriesAdmin,
  type AdminCategory,
} from "@/data/admin"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { OrdersPagination } from "@/components/orders/orders-pagination"
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
import { cn } from "@/lib/utils"
import { BASE_URL } from "@/lib/urls"

const PAGE_SIZE = 9
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL"] as const
const IMAGE_TAG_OPTIONS = ["front", "back", "info", "bg"] as const
const formatCurrency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
})

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

const imageFormSchema = z.object({
  altText: z.string().min(1, "Alt text is required"),
  isPrimary: z.boolean(),
  tag: z.enum(IMAGE_TAG_OPTIONS),
})

type ImageFormValues = z.infer<typeof imageFormSchema>

const tagsFormSchema = z.object({
  tags: z.string().min(1, "Enter at least one tag"),
})

type TagsFormValues = z.infer<typeof tagsFormSchema>

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

const imageFormDefaultValues: ImageFormValues = {
  altText: "",
  isPrimary: false,
  tag: "front",
}

const tagsFormDefaultValues: TagsFormValues = {
  tags: "",
}

const addProductResolver = zodResolver(addProductFormSchema) as Resolver<AddProductFormValues>
const imageFormResolver = zodResolver(imageFormSchema) as Resolver<ImageFormValues>
const tagsFormResolver = zodResolver(tagsFormSchema) as Resolver<TagsFormValues>

export default function AdminProductsClientPage() {
  const [data, setData] = useState<FilterProductsData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [imageDialogProduct, setImageDialogProduct] = useState<Product | null>(
    null
  )
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDeletingProductId, setIsDeletingProductId] = useState<string | null>(
    null
  )
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false)

  const loadProducts = useCallback(async (page: number) => {
    setIsLoading(true)
    setIsRefreshing(true)
    setError(null)
    try {
      const response = await filterProductsAction({
        page: page - 1,
        size: PAGE_SIZE,
      })
      setData(response)
    } catch (err) {
      console.error("Failed to fetch products:", err)
      setError("Failed to fetch products. Please try again.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadProducts(currentPage)
  }, [currentPage, loadProducts])

  const loadCategories = useCallback(async () => {
    setIsCategoriesLoading(true)
    try {
      const response = await getCategoriesAdmin()
      if (!response.success) {
        toast.error(response.error || "Failed to load categories")
        return
      }
      if (!response.data) {
        toast.error("Failed to load categories")
        return
      }
      setCategories(response.data.categories)
    } catch (error) {
      console.error("Failed to load categories:", error)
      toast.error("Failed to load categories")
    } finally {
      setIsCategoriesLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  const handleProductCreated = (product: Product) => {
    toast.success("Product created successfully. You can now add images.")
    setIsAddProductOpen(false)
    setImageDialogProduct(product)
    setCurrentPage(1)
    loadProducts(1)
  }

  const handleImageUploaded = (updatedProduct: Product) => {
    toast.success("Image uploaded successfully.")
    setImageDialogProduct(updatedProduct)
    setData((prev) =>
      prev
        ? {
            ...prev,
            products: prev.products.map((item) =>
              item.id === updatedProduct.id ? updatedProduct : item
            ),
          }
        : prev
    )
  }

  const handleTagsUpdated = (productId: string, tags: string[]) => {
    toast.success("Tags updated successfully.")
    setImageDialogProduct((prev) =>
      prev && prev.id === productId ? { ...prev, tags } : prev
    )
    setData((prev) =>
      prev
        ? {
            ...prev,
            products: prev.products.map((item) =>
              item.id === productId ? { ...item, tags } : item
            ),
          }
        : prev
    )
  }

  const handleImageDeleted = (productId: string, imageId: string) => {
    toast.success("Image deleted successfully.")
    setImageDialogProduct((prev) =>
      prev && prev.id === productId
        ? {
            ...prev,
            images: prev.images.filter((image) => image.id !== imageId),
          }
        : prev
    )
    setData((prev) =>
      prev
        ? {
            ...prev,
            products: prev.products.map((product) =>
              product.id === productId
                ? {
                    ...product,
                    images: product.images.filter(
                      (image) => image.id !== imageId
                    ),
                  }
                : product
            ),
          }
        : prev
    )
  }

  const handleDeleteProduct = async (product: Product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    setIsDeletingProductId(product.id)
    try {
      const response = await deleteProductAdmin(product.id)

      if (!response.success) {
        toast.error(response.error || "Failed to delete product")
        return
      }

      toast.success("Product deleted successfully.")

      if (imageDialogProduct?.id === product.id) {
        setImageDialogProduct(null)
      }

      const shouldGoToPreviousPage =
        currentPage > 1 && data?.products.length === 1

      if (shouldGoToPreviousPage) {
        setCurrentPage((prev) => Math.max(prev - 1, 1))
      } else {
        await loadProducts(currentPage)
      }
    } catch (error) {
      console.error("Failed to delete product:", error)
      toast.error("Failed to delete product")
    } finally {
      setIsDeletingProductId(null)
    }
  }

  const productCount = useMemo(
    () => data?.totalElements ?? 0,
    [data?.totalElements]
  )

  return (
    <main className="min-h-[calc(100vh-120px)] bg-background">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
              Manage Products
            </h1>
            <p className="text-muted-foreground">
              View existing products, add new listings, and manage product
              gallery images.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button
              variant="outline"
              onClick={() => loadProducts(currentPage)}
              disabled={isLoading}
              className="flex-1 sm:flex-initial"
            >
              <RefreshCcwIcon
                className={cn(
                  "mr-2 size-4",
                  isRefreshing ? "animate-spin" : undefined
                )}
              />
              Refresh
            </Button>
            <Button
              onClick={() => setIsAddProductOpen(true)}
              className="flex-1 sm:flex-initial"
            >
              <PlusIcon className="mr-2 size-4" />
              Add Product
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed">
            <Spinner className="size-8" />
            <p className="text-sm text-muted-foreground">
              Loading products...
            </p>
          </div>
        ) : data && data.products.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {data.products.map((product) => (
                <Card key={product.id} className="flex h-full flex-col">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-xl font-semibold">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="flex flex-col gap-1 text-sm">
                      <span>SKU: {product.sku}</span>
                      <span>Category: {product.category?.name ?? "N/A"}</span>
                    </CardDescription>
                    <CardAction>
                      <Badge variant={product.active ? "default" : "destructive"}>
                        {product.active ? "Active" : "Inactive"}
                      </Badge>
                    </CardAction>
                  </CardHeader>

                  <CardContent className="flex flex-1 flex-col gap-4 pt-6">
                    <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-medium">
                          {formatCurrency.format(product.price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Discount</p>
                        <p className="font-medium">
                          {product.discountPercentage}%{" "}
                          {product.discountAmount
                            ? `(${formatCurrency.format(product.discountAmount)})`
                            : ""}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Tax</p>
                        <p className="font-medium">
                          {product.taxPercentage}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Stock</p>
                        <p className="font-medium">{product.stockQuantity}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">Available Sizes</p>
                      <div className="flex flex-wrap gap-2">
                        {product.availableSizes.length > 0 ? (
                          product.availableSizes.map((size) => (
                            <Badge key={size} variant="secondary">
                              {size}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">
                            No sizes provided
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        Images ({product.images.length})
                      </p>
                      {product.images.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {product.images.slice(0, 3).map((image) => (
                            <Badge key={image.id} variant="outline">
                              {image.tag || "image"}
                            </Badge>
                          ))}
                          {product.images.length > 3 && (
                            <Badge variant="outline">
                              +{product.images.length - 3} more
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          No images uploaded yet
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">Tags</p>
                      {product.tags && product.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {product.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          No tags assigned yet
                        </span>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-wrap gap-3 pt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="sm:w-auto"
                      onClick={() => setImageDialogProduct(product)}
                    >
                      <ImageIcon className="mr-2 size-4" />
                      Manage Product
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="sm:w-auto"
                      onClick={() => handleDeleteProduct(product)}
                      disabled={isDeletingProductId === product.id}
                    >
                      {isDeletingProductId === product.id ? (
                        <Spinner className="mr-2 size-4" />
                      ) : (
                        <TrashIcon className="mr-2 size-4" />
                      )}
                      Delete Product
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="flex flex-col items-center justify-between gap-4 rounded-lg border px-4 py-3 text-sm sm:flex-row">
              <p className="text-muted-foreground">
                Showing page {(data.currentPage ?? 0) + 1} of{" "}
                {data.totalPages || 1} ({productCount} products)
              </p>
              {data.totalPages > 1 && (
                <OrdersPagination
                  currentPage={currentPage}
                  totalPages={data.totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed">
            <p className="text-lg font-medium text-foreground">
              No products found
            </p>
            <p className="text-sm text-muted-foreground">
              Start by adding a new product to populate your catalog.
            </p>
            <Button onClick={() => setIsAddProductOpen(true)}>
              <PlusIcon className="mr-2 size-4" />
              Add Product
            </Button>
          </div>
        )}
      </section>

      <AddProductDialog
        open={isAddProductOpen}
        onOpenChange={setIsAddProductOpen}
        onCreated={handleProductCreated}
        categories={categories}
        isCategoriesLoading={isCategoriesLoading}
      />

      <AddImageDialog
        product={imageDialogProduct}
        onClose={() => setImageDialogProduct(null)}
        onUploaded={handleImageUploaded}
        onTagsUpdated={handleTagsUpdated}
        onImageDeleted={handleImageDeleted}
        onDeleteProduct={handleDeleteProduct}
        deletingProductId={isDeletingProductId}
      />
    </main>
  )
}

interface AddProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (product: Product) => void
  categories: AdminCategory[]
  isCategoriesLoading: boolean
}

function AddProductDialog({
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

interface AddImageDialogProps {
  product: Product | null
  onClose: () => void
  onUploaded: (product: Product) => void
  onTagsUpdated: (productId: string, tags: string[]) => void
  onImageDeleted: (productId: string, imageId: string) => void
  onDeleteProduct: (product: Product) => void
  deletingProductId: string | null
}

function AddImageDialog({
  product,
  onClose,
  onUploaded,
  onTagsUpdated,
  onImageDeleted,
  onDeleteProduct,
  deletingProductId,
}: AddImageDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTagSubmitting, setIsTagSubmitting] = useState(false)
  const [isClearingTags, setIsClearingTags] = useState(false)
  const [activeSection, setActiveSection] = useState<"image" | "tags">("image")
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null)
  const previousProductIdRef = useRef<string | null>(null)

  const form = useForm<ImageFormValues>({
    resolver: imageFormResolver,
    defaultValues: imageFormDefaultValues,
  })

  const tagsForm = useForm<TagsFormValues>({
    resolver: tagsFormResolver,
    defaultValues: tagsFormDefaultValues,
  })

  useEffect(() => {
    if (!product) {
      form.reset({ ...imageFormDefaultValues })
      setSelectedFile(null)
      tagsForm.reset({ ...tagsFormDefaultValues })
      setActiveSection("image")
      setDeletingImageId(null)
      setIsClearingTags(false)
      previousProductIdRef.current = null
      return
    }

    form.reset({ ...imageFormDefaultValues })
    tagsForm.reset({
      tags:
        product.tags && product.tags.length > 0
          ? product.tags.join(", ")
          : "",
    })
    setSelectedFile(null)
    setDeletingImageId(null)
    setIsClearingTags(false)

    if (previousProductIdRef.current !== product.id) {
      setActiveSection("image")
    }

    previousProductIdRef.current = product.id
  }, [product, form, tagsForm])

  const hasExistingTags = Boolean(product?.tags?.length)

  const handleImageSubmit = async (values: ImageFormValues) => {
    if (!product?.id) {
      toast.error("No product selected")
      return
    }

    if (!selectedFile) {
      toast.error("Please select an image to upload")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await uploadProductImageAdmin({
        productId: product.id,
        file: selectedFile,
        altText: values.altText,
        isPrimary: values.isPrimary,
        tag: values.tag,
      })

      if (!response.success) {
        toast.error(response.error || "Failed to upload image")
        return
      }

      const updatedProduct = response.data?.product

      if (!updatedProduct) {
        toast.error("Product payload missing in response")
        return
      }

      onUploaded(updatedProduct)
      form.reset({ ...imageFormDefaultValues })
      setSelectedFile(null)
    } catch (err) {
      console.error("Failed to upload image:", err)
      toast.error("Failed to upload image")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!product?.id) {
      toast.error("No product selected")
      return
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this image? This action cannot be undone."
    )

    if (!confirmed) {
      return
    }

    setDeletingImageId(imageId)
    try {
      const response = await deleteProductImageAdmin(imageId)

      if (!response.success) {
        toast.error(response.error || "Failed to delete image")
        return
      }

      onImageDeleted(product.id, imageId)
    } catch (error) {
      console.error("Failed to delete product image:", error)
      toast.error("Failed to delete image")
    } finally {
      setDeletingImageId(null)
    }
  }

  const handleTagsSubmit = async (values: TagsFormValues) => {
    if (!product?.id) {
      toast.error("No product selected")
      return
    }

    const tagList = values.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)

    if (!tagList.length) {
      toast.error("Please enter at least one tag")
      return
    }

    setIsTagSubmitting(true)
    try {
      const response = await updateProductTagsAdmin(product.id, tagList)

      if (!response.success) {
        toast.error(response.error || "Failed to update tags")
        return
      }

      if (!response.data) {
        toast.error("Failed to update tags")
        return
      }

      tagsForm.reset({
        tags: response.data.tags.join(", "),
      })
      onTagsUpdated(response.data.productId, response.data.tags)
    } catch (err) {
      console.error("Failed to update tags:", err)
      toast.error("Failed to update tags")
    } finally {
      setIsTagSubmitting(false)
    }
  }

  const handleClearTags = async () => {
    if (!product?.id) {
      toast.error("No product selected")
      return
    }

    if (!hasExistingTags) {
      toast.error("No tags to remove")
      return
    }

    const confirmed = window.confirm(
      "Remove all tags from this product? This action cannot be undone."
    )

    if (!confirmed) {
      return
    }

    setIsClearingTags(true)
    try {
      const response = await updateProductTagsAdmin(product.id, [])

      if (!response.success) {
        toast.error(response.error || "Failed to clear tags")
        return
      }

      if (!response.data) {
        toast.error("Failed to clear tags")
        return
      }

      tagsForm.reset({ ...tagsFormDefaultValues })
      onTagsUpdated(response.data.productId, response.data.tags)
      toast.success("All tags cleared successfully.")
    } catch (error) {
      console.error("Failed to clear tags:", error)
      toast.error("Failed to clear tags")
    } finally {
      setIsClearingTags(false)
    }
  }

  const isOpen = Boolean(product)

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) =>
        !value &&
        !isSubmitting &&
        !isTagSubmitting &&
        !isClearingTags &&
        onClose()
      }
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Product Assets</DialogTitle>
          <DialogDescription>
            {product
              ? `Upload images or update tags for ${product.name}`
              : "Select a product"}
          </DialogDescription>
        </DialogHeader>

        {product && (
          <div className="flex flex-col gap-3 rounded-lg border bg-muted/50 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-foreground">{product.name}</p>
              <p className="text-muted-foreground">SKU: {product.sku}</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDeleteProduct(product)}
              disabled={deletingProductId === product.id}
              className="sm:w-auto"
            >
              {deletingProductId === product.id ? (
                <Spinner className="mr-2 size-4" />
              ) : (
                <TrashIcon className="mr-2 size-4" />
              )}
              Delete Product
            </Button>
          </div>
        )}

        <div className="space-y-6 pt-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="flex items-center justify-center">
            <div className="inline-flex rounded-full border bg-muted/60 p-1">
              <Button
                type="button"
                variant={activeSection === "image" ? "default" : "ghost"}
                size="sm"
                className="rounded-full px-4"
                onClick={() => setActiveSection("image")}
              >
                <ImageIcon className="mr-2 size-4" />
                Add Image
              </Button>
              <Button
                type="button"
                variant={activeSection === "tags" ? "default" : "ghost"}
                size="sm"
                className="rounded-full px-4"
                onClick={() => setActiveSection("tags")}
              >
                <TagIcon className="mr-2 size-4" />
                Update Tags
              </Button>
            </div>
          </div>

          {activeSection === "image" ? (
            <section className="space-y-4 rounded-lg border p-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <ImageIcon className="size-4" />
                Upload Image
              </h3>
              {product && (
                <div className="space-y-3">
                  <p className="text-sm font-medium">Existing Images</p>
                  {product.images.length > 0 ? (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {product.images.map((image) => (
                        <div
                          key={image.id}
                          className="flex flex-col gap-3 rounded-lg border bg-background/60 p-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-center gap-3">
                            {image.url ? (
                              <img
                                src={BASE_URL+image.url}
                                alt={image.altText || image.tag || "Product image"}
                                className="h-16 w-16 rounded-md object-cover"
                              />
                            ) : (
                              <div className="flex h-16 w-16 items-center justify-center rounded-md border text-xs text-muted-foreground">
                                No Image
                              </div>
                            )}
                            <div className="space-y-1 text-sm">
                              <p className="font-medium">
                                {(image.tag || "image").toUpperCase()}
                              </p>
                              <p className="text-muted-foreground">
                                {image.altText || "No alt text provided"}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteImage(image.id)}
                            disabled={
                              deletingImageId === image.id ||
                              deletingProductId === product.id
                            }
                          >
                            {deletingImageId === image.id ? (
                              <Spinner className="size-4" />
                            ) : (
                              <TrashIcon className="size-4" />
                            )}
                            <span className="sr-only">Delete image</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No images uploaded yet.
                    </p>
                  )}
                </div>
              )}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleImageSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="altText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alt Text</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Describe the image (e.g., Front view)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image Tag</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select tag" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {IMAGE_TAG_OPTIONS.map((tag) => (
                              <SelectItem key={tag} value={tag}>
                                {tag.toUpperCase()}
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
                    name="isPrimary"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(!!checked)
                            }
                          />
                        </FormControl>
                        <div className="space-y-0.5">
                          <FormLabel className="!mt-0 font-medium">
                            Primary image
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            The primary image is shown first in product
                            galleries.
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Image File
                    </label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0]
                        setSelectedFile(file ?? null)
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Upload high-quality images (JPG, PNG, or WEBP). Maximum
                      size 5MB.
                    </p>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onClose}
                      disabled={
                        isSubmitting ||
                        isTagSubmitting ||
                        isClearingTags ||
                        deletingImageId !== null ||
                        (product ? deletingProductId === product.id : false)
                      }
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={
                        isSubmitting ||
                        !selectedFile ||
                        isClearingTags ||
                        deletingImageId !== null ||
                        (product ? deletingProductId === product.id : false)
                      }
                    >
                      {isSubmitting && <Spinner className="mr-2 size-4" />}
                      Upload Image
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </section>
          ) : (
            <section className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <TagIcon className="size-4" />
                <h3 className="text-lg font-semibold">Update Product Tags</h3>
              </div>
              <p className="rounded-md border border-amber-300 bg-amber-100 px-3 py-2 text-xs text-amber-900">
                Updating tags will overwrite all existing tags on this product.
              </p>
              <Form {...tagsForm}>
                <form
                  onSubmit={tagsForm.handleSubmit(handleTagsSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={tagsForm.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter tags separated by commas (e.g., dhh, new)"
                            {...field}
                            className="text-foreground"
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onClose}
                      disabled={
                        isTagSubmitting ||
                        isClearingTags ||
                        isSubmitting ||
                        deletingImageId !== null ||
                        (product ? deletingProductId === product.id : false)
                      }
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleClearTags}
                      disabled={
                        !hasExistingTags ||
                        isTagSubmitting ||
                        isClearingTags ||
                        isSubmitting ||
                        deletingImageId !== null ||
                        (product ? deletingProductId === product.id : false)
                      }
                    >
                      {isClearingTags ? (
                        <Spinner className="mr-2 size-4" />
                      ) : (
                        <TrashIcon className="mr-2 size-4" />
                      )}
                      Clear Tags
                    </Button>
                    <Button
                      type="submit"
                      variant="default"
                      size="sm"
                      disabled={
                        isTagSubmitting ||
                        isClearingTags ||
                        deletingImageId !== null ||
                        (product ? deletingProductId === product.id : false)
                      }
                    >
                      {isTagSubmitting && <Spinner className="mr-2 size-4" />}
                      Update Tags
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

