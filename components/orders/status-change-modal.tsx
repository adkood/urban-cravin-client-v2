"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"

interface StatusChangeModalProps {
  open: boolean
  orderId: string
  currentStatus: string
  newStatus: string
  onConfirm: () => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function StatusChangeModal({
  open,
  orderId,
  currentStatus,
  newStatus,
  onConfirm,
  onCancel,
  isLoading = false,
}: StatusChangeModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change Order Status</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to change the status of order <strong>{orderId}</strong> from{" "}
            <strong>{currentStatus}</strong> to <strong>{newStatus}</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3 justify-end">
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading} className="bg-red-600 hover:bg-red-700">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                Updating...
              </div>
            ) : (
              "Change Status"
            )}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
