"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

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
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DialogFooter } from "@/components/ui/dialog"
import { TrashIcon } from "lucide-react"

import {
  deleteProductImageAdmin,
  uploadProductImageAdmin,
} from "@/data/admin"
import type { Product } from "@/data/product"
import { BASE_URL } from "@/lib/urls"

const IMAGE_TAG_OPTIONS = ["front", "back", "info", "bg"] as const

const imageFormSchema = z.object({
  altText: z.string().min(1, "Alt text is required"),
  isPrimary: z.boolean(),
  tag: z.enum(IMAGE_TAG_OPTIONS),
})

type ImageFormValues = z.infer<typeof imageFormSchema>

const imageFormDefaultValues: ImageFormValues = {
  altText: "",
  isPrimary: false,
  tag: "front",
}

type ProductImagesSectionProps = {
  product: Product | null
  onClose: () => void
  onUploaded: (product: Product) => void
  onImageDeleted: (productId: string, imageId: string) => void
  deletingProductId: string | null
  onBusyChange: (busy: boolean) => void
}

export default function ProductImagesSection({
  product,
  onClose,
  onUploaded,
  onImageDeleted,
  deletingProductId,
  onBusyChange,
}: ProductImagesSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<ImageFormValues>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: imageFormDefaultValues,
  })

  const resetState = useCallback(() => {
    form.reset({ ...imageFormDefaultValues })
    setSelectedFile(null)
    setDeletingImageId(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [form])

  useEffect(() => {
    if (!product) {
      resetState()
      return
    }

    resetState()
  }, [product, resetState])

  useEffect(() => {
    onBusyChange(isSubmitting || deletingImageId !== null)
  }, [isSubmitting, deletingImageId, onBusyChange])

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
      resetState()
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

  if (!product) {
    return null
  }

  return (
    <section className="space-y-4 rounded-lg border p-4">
      <h3 className="flex items-center gap-2 text-lg font-semibold">
        Upload Image
      </h3>
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
                      src={`${BASE_URL}${image.url}`}
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
                    deletingImageId === image.id || deletingProductId === product.id
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
                <Select onValueChange={field.onChange} value={field.value}>
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
                    onCheckedChange={(checked) => field.onChange(!!checked)}
                  />
                </FormControl>
                <div className="space-y-0.5">
                  <FormLabel className="!mt-0 font-medium">
                    Primary image
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    The primary image is shown first in product galleries.
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
              ref={fileInputRef}
              onChange={(event) => {
                const file = event.target.files?.[0]
                setSelectedFile(file ?? null)
              }}
            />
            <p className="text-xs text-muted-foreground">
              Upload high-quality images (JPG, PNG, or WEBP). Maximum size 5MB.
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
                deletingImageId !== null ||
                deletingProductId === product.id
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
                deletingImageId !== null ||
                deletingProductId === product.id
              }
            >
              {isSubmitting && <Spinner className="mr-2 size-4" />}
              Upload Image
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </section>
  )
}

