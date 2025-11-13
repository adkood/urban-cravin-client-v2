"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import {
  filterProductsAction,
  type FilterProductsData,
  type Product,
} from "@/data/product"
import {
  deleteProductAdmin,
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
import { PlusIcon, RefreshCcwIcon, ImageIcon, TrashIcon } from "lucide-react"
import AddProductDialog from "./components/add-product-dialog"
import ManageProductAssetsDialog from "./components/manage-product-assets-dialog"

const PAGE_SIZE = 9
const formatCurrency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
})

export default function AdminProductsClientPage() {
  const [pageData, setPageData] = useState<FilterProductsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [assetDialogProduct, setAssetDialogProduct] = useState<Product | null>(null)
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null)
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
      setPageData(response)
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
        toast.error(response.error ?? "Failed to load categories")
        return
      }
      if (!response.data) {
        toast.error("Failed to load categories")
        return
      }
      setCategories(response.data.categories)
    } catch (err) {
      console.error("Failed to load categories:", err)
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
    setAssetDialogProduct(product)
    setCurrentPage(1)
    loadProducts(1)
  }

  const handleImageUploaded = (updatedProduct: Product) => {
    toast.success("Image uploaded successfully.")
    setAssetDialogProduct(updatedProduct)
    setPageData((prev) =>
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
    setAssetDialogProduct((prev) =>
      prev && prev.id === productId ? { ...prev, tags } : prev
    )
    setPageData((prev) =>
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
    setAssetDialogProduct((prev) =>
      prev && prev.id === productId
        ? {
            ...prev,
            images: prev.images.filter((image) => image.id !== imageId),
          }
        : prev
    )
    setPageData((prev) =>
      prev
        ? {
            ...prev,
            products: prev.products.map((product) =>
              product.id === productId
                ? {
                    ...product,
                    images: product.images.filter((image) => image.id !== imageId),
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

    if (!confirmed) return

    setDeletingProductId(product.id)
    try {
      const response = await deleteProductAdmin(product.id)

      if (!response.success) {
        toast.error(response.error || "Failed to delete product")
        return
      }

      toast.success("Product deleted successfully.")

      if (assetDialogProduct?.id === product.id) {
        setAssetDialogProduct(null)
      }

      const shouldGoToPreviousPage =
        currentPage > 1 && (pageData?.products.length ?? 0) === 1

      if (shouldGoToPreviousPage) {
        setCurrentPage((prev) => Math.max(prev - 1, 1))
      } else {
        await loadProducts(currentPage)
      }
    } catch (error) {
      console.error("Failed to delete product:", error)
      toast.error("Failed to delete product")
    } finally {
      setDeletingProductId(null)
    }
  }

  const productCount = useMemo(
    () => pageData?.totalElements ?? 0,
    [pageData?.totalElements]
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
              View existing products, add new listings, and manage product gallery images.
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
                className={isRefreshing ? "mr-2 size-4 animate-spin" : "mr-2 size-4"}
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
            <p className="text-sm text-muted-foreground">Loading products...</p>
          </div>
        ) : pageData && pageData.products.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {pageData.products.map((product) => (
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
                        <p className="font-medium">{product.taxPercentage}%</p>
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
                      onClick={() => setAssetDialogProduct(product)}
                    >
                      <ImageIcon className="mr-2 size-4" />
                      Manage Product
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="sm:w-auto"
                      onClick={() => handleDeleteProduct(product)}
                      disabled={deletingProductId === product.id}
                    >
                      {deletingProductId === product.id ? (
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
                Showing page {(pageData.currentPage ?? 0) + 1} of{" "}
                {pageData.totalPages || 1} ({productCount} products)
              </p>
              {pageData.totalPages > 1 && (
                <OrdersPagination
                  currentPage={currentPage}
                  totalPages={pageData.totalPages}
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

      <ManageProductAssetsDialog
        product={assetDialogProduct}
        onClose={() => setAssetDialogProduct(null)}
        onUploaded={handleImageUploaded}
        onTagsUpdated={handleTagsUpdated}
        onImageDeleted={handleImageDeleted}
        onDeleteProduct={handleDeleteProduct}
        deletingProductId={deletingProductId}
      />
    </main>
  )
}

