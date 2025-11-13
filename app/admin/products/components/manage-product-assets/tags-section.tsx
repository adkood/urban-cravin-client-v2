"use client"

import { useEffect, useMemo, useState } from "react"
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
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { DialogFooter } from "@/components/ui/dialog"
import { TrashIcon } from "lucide-react"

import { updateProductTagsAdmin } from "@/data/admin"
import type { Product } from "@/data/product"

const tagsFormSchema = z.object({
  tags: z.string().min(1, "Enter at least one tag"),
})

type TagsFormValues = z.infer<typeof tagsFormSchema>

const tagsFormDefaultValues: TagsFormValues = {
  tags: "",
}

type ProductTagsSectionProps = {
  product: Product | null
  onClose: () => void
  onTagsUpdated: (productId: string, tags: string[]) => void
  deletingProductId: string | null
  onBusyChange: (busy: boolean) => void
}

export default function ProductTagsSection({
  product,
  onClose,
  onTagsUpdated,
  deletingProductId,
  onBusyChange,
}: ProductTagsSectionProps) {
  const [isTagSubmitting, setIsTagSubmitting] = useState(false)
  const [isClearingTags, setIsClearingTags] = useState(false)

  const tagsForm = useForm<TagsFormValues>({
    resolver: zodResolver(tagsFormSchema),
    defaultValues: tagsFormDefaultValues,
  })

  useEffect(() => {
    if (!product) {
      tagsForm.reset({ ...tagsFormDefaultValues })
      return
    }

    tagsForm.reset({
      tags:
        product.tags && product.tags.length > 0
          ? product.tags.join(", ")
          : "",
    })
  }, [product, tagsForm])

  useEffect(() => {
    onBusyChange(isTagSubmitting || isClearingTags)
  }, [isTagSubmitting, isClearingTags, onBusyChange])

  const hasExistingTags = useMemo(
    () => Boolean(product?.tags?.length),
    [product]
  )

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

  if (!product) {
    return null
  }

  return (
    <section className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center gap-2">
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
                    value={field.value ?? ""}
                    onChange={(event) => field.onChange(event.target.value)}
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
                deletingProductId === product.id
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
                deletingProductId === product.id
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
                deletingProductId === product.id
              }
            >
              {isTagSubmitting && <Spinner className="mr-2 size-4" />}
              Update Tags
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </section>
  )
}

