'use client'

import type { Practice } from './practice-types'
import { Eye, Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface PracticeListProps {
  practices: Practice[]
  fetchingPractices: boolean
  onCreate: () => void
  onView: (practice: Practice) => void
  onEdit: (practice: Practice) => void
  onDelete: (practice: Practice) => void
}

function renderLoadingState() {
  return (
    <div className="flex justify-center my-8">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}

export function PracticeList({ practices, fetchingPractices, onCreate, onView, onEdit, onDelete }: PracticeListProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">All Practices</h2>
        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {' '}
          New Practice
        </Button>
      </div>

      {fetchingPractices
        ? (
            renderLoadingState()
          )
        : practices.length === 0
          ? (
              <div className="text-center p-8 border rounded-md bg-muted/50">
                <p className="text-muted-foreground">
                  No practices found. Create your first practice!
                </p>
              </div>
            )
          : (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Time Limit</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="w-[120px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {practices.map(practice => (
                        <TableRow key={practice.id}>
                          <TableCell className="font-medium">
                            {practice.title}
                          </TableCell>
                          <TableCell>
                            {practice.timeLimit}
                            {' '}
                            minutes
                          </TableCell>
                          <TableCell>
                            {new Date(practice.updatedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => onView(practice)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => onEdit(practice)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => onDelete(practice)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
    </div>
  )
}
