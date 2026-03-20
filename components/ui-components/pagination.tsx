"use client"

import type React from "react"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "../ui/button"

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
}

const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  ({ className, currentPage, totalPages, onPageChange, siblingCount = 1, ...props }, ref) => {
    // Generate page numbers to display
    const generatePagination = () => {
      // Always show first and last page
      const firstPage = 1
      const lastPage = totalPages

      // Calculate range of pages to show around current page
      const leftSiblingIndex = Math.max(currentPage - siblingCount, firstPage)
      const rightSiblingIndex = Math.min(currentPage + siblingCount, lastPage)

      // Determine if we need to show ellipses
      const shouldShowLeftDots = leftSiblingIndex > firstPage + 1
      const shouldShowRightDots = rightSiblingIndex < lastPage - 1

      // Generate the page numbers array
      const pageNumbers: (number | string)[] = []

      // Always add first page
      pageNumbers.push(firstPage)

      // Add left ellipsis if needed
      if (shouldShowLeftDots) {
        pageNumbers.push("leftEllipsis")
      }

      // Add page numbers between ellipses
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        if (i !== firstPage && i !== lastPage) {
          pageNumbers.push(i)
        }
      }

      // Add right ellipsis if needed
      if (shouldShowRightDots) {
        pageNumbers.push("rightEllipsis")
      }

      // Always add last page if it's not the same as first page
      if (lastPage !== firstPage) {
        pageNumbers.push(lastPage)
      }

      return pageNumbers
    }

    const pages = generatePagination()

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center space-x-2", className)}
        dir="ltr" // Always LTR for pagination
        {...props}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>

        {pages.map((page, index) => {
          if (page === "leftEllipsis" || page === "rightEllipsis") {
            return (
              <div key={`ellipsis-${index}`} className="flex h-10 w-10 items-center justify-center">
                <MoreHorizontal className="h-4 w-4" />
              </div>
            )
          }

          return (
            <Button
              key={`page-${page}`}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => onPageChange(page as number)}
              className="h-10 w-10"
            >
              {page}
            </Button>
          )
        })}

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
    )
  },
)
Pagination.displayName = "Pagination"

export { Pagination }
