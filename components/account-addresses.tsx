"use client"

import { useEffect, useState } from "react"
import { Plus, Edit2, Trash2, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import AddressFormDialog, { FormData } from "@/components/address-form-dialog"
import { getUserAddresses, addUserAddress, deleteUserAddress, updateUserAddress } from "@/data/user" 

interface Address {
  id: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  defaultAddress: boolean
}

export default function AccountAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await getUserAddresses()
        if (res.success) {
          setAddresses(res.data)
        } else {
          setError(res.error)
        }
      } catch (err) {
        setError("Failed to load addresses")
      } finally {
        setLoading(false)
      }
    }
    fetchAddresses()
  }, [])

  const handleAddAddress = async (formData: FormData) => {
    try {
      setIsSubmitting(true)
      let res;

      if(editingId) {
          res = await updateUserAddress(editingId,{
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          defaultAddress: formData.defaultAddress,
        })
      }
      else {
        res = await addUserAddress({
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          defaultAddress: formData.defaultAddress,
        })
      }
      if (res.success) {
        console.log(res)

        if(editingId) {
            setAddresses((prev) =>
              prev.map((a) => (a.id === editingId ? res.data : a))
            )
        }
        else {
          setAddresses((prev) => {
            if(res.data.defaultAddress) {
              prev.forEach((p) => p.defaultAddress = false)
            }

            return [...prev, res.data]
          })
        }
      } else {
        alert(`Error adding address: ${res.error}`)
      }
    } catch (err) {
      alert("Something went wrong while adding address")
    } finally {
      setEditingId(null);
      setIsSubmitting(false)
      setIsDialogOpen(false)
    }
  }

  const handleDeleteAddress = async (id: string) => {
    const res  = await deleteUserAddress(id)
    if(res.success) setAddresses((prev) => prev.filter((addr) => addr.id !== id))
    else setError(res.error)
  }

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({ ...addr, defaultAddress: addr.id === id })),
    )
  }

  const editingAddress = addresses.find((addr) => addr.id === editingId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-6">
        <h1 className="text-2xl font-semibold font-mono">My Addresses</h1>
        <Button
          onClick={() => {
            setEditingId(null)
            setIsDialogOpen(true)
          }}
          className="gap-2 bg-black text-white hover:bg-gray-800"
          disabled={isSubmitting}
        >
          <Plus className="w-4 h-4" />
          Add New
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          <p>{error}</p>
        </div>
      )}

      {/* Loading Shimmer */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 rounded-lg border border-gray-200"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <div
                key={address.id}
                className="border border-gray-200 p-6 hover:border-gray-300 transition-colors group rounded-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    {address.city}, {address.state}
                  </h3>
                  {address.defaultAddress && (
                    <div className="flex items-center gap-1 text-xs font-medium bg-[#e5e7eb] px-2 py-2 rounded-md">
                      <Home className="w-3 h-3" />
                      Default
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-4 text-sm text-gray-700">
                  <p>{address.street}</p>
                  <p>
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingId(address.id)
                      setIsDialogOpen(true)
                    }}
                    className="gap-2 text-gray-700 hover:bg-gray-100"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAddress(address.id)}
                    className="gap-2 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="border border-dashed border-gray-300 p-12 text-center rounded-lg">
              <p className="text-gray-500 mb-4">No addresses saved yet</p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-black text-white hover:bg-gray-800"
              >
                Add Your First Address
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Address Form Dialog */}
      <AddressFormDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingId(null)
        }}
        onSubmit={handleAddAddress}
        initialData={editingAddress}
      />
    </div>
  )
}
