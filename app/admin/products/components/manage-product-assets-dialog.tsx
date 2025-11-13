"use client"

import { useCallback, useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { ImageIcon, TagIcon, TrashIcon } from "lucide-react"

import type { Product } from "@/data/product"
import ProductImagesSection from "./manage-product-assets/image-section"
import ProductTagsSection from "./manage-product-assets/tags-section"

export type ManageProductAssetsDialogProps = {
  product: Product | null
  onClose: () => void
  onUploaded: (product: Product) => void
  onTagsUpdated: (productId: string, tags: string[]) => void
  onImageDeleted: (productId: string, imageId: string) => void
  onDeleteProduct: (product: Product) => void
  deletingProductId: string | null
}

export default function ManageProductAssetsDialog({
  product,
  onClose,
  onUploaded,
  onTagsUpdated,
  onImageDeleted,
  onDeleteProduct,
  deletingProductId,
}: ManageProductAssetsDialogProps) {
  const [activeSection, setActiveSection] = useState<"image" | "tags">("image")
  const [isImageBusy, setIsImageBusy] = useState(false)
  const [isTagBusy, setIsTagBusy] = useState(false)

  useEffect(() => {
    if (product) {
      setActiveSection("image")
    }
  }, [product?.id])

  const handleImageBusyChange = useCallback((busy: boolean) => {
    setIsImageBusy(busy)
  }, [])

  const handleTagBusyChange = useCallback((busy: boolean) => {
    setIsTagBusy(busy)
  }, [])

  const isOpen = Boolean(product)
  const canClose = !(isImageBusy || isTagBusy)

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        if (!value && canClose) {
          onClose()
        }
      }}
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
              disabled={deletingProductId === product.id || !canClose}
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
                disabled={isTagBusy}
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
                disabled={isImageBusy}
              >
                <TagIcon className="mr-2 size-4" />
                Update Tags
              </Button>
            </div>
          </div>

          {activeSection === "image" ? (
            <ProductImagesSection
              product={product}
              onClose={onClose}
              onUploaded={onUploaded}
              onImageDeleted={onImageDeleted}
              deletingProductId={deletingProductId}
              onBusyChange={handleImageBusyChange}
            />
          ) : (
            <ProductTagsSection
              product={product}
              onClose={onClose}
              onTagsUpdated={onTagsUpdated}
              deletingProductId={deletingProductId}
              onBusyChange={handleTagBusyChange}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

