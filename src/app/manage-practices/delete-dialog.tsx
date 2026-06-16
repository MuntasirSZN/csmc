'use client'

import type { Practice } from './practice-types'
import { Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface DeleteConfirmDialogProps {
  open: boolean
  practiceToDelete: Practice | null
  loading: boolean
  onConfirm: () => void
  onClose: () => void
}

export function DeleteConfirmDialog({ open, practiceToDelete, loading, onConfirm, onClose }: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={open => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this practice?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            practice "
            {practiceToDelete?.title}
            " and all its associated
            questions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              onConfirm()
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={loading}
          >
            {loading
              ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {' '}
                    Deleting...
                  </>
                )
              : (
                  'Delete'
                )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
