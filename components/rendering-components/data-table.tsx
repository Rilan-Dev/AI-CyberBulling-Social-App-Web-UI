// components/ui/data-table.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import SearchBox from "../ui-components/search";
import { Button } from "../ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "../ui/pagination";

export interface ColumnDef<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyField: keyof T;
  onEdit?: (item: T) => void;
  onDelete?: (id: any) => void;
  className?: string;
  pagination?: {
    currentPage: number;
    pageCount: number;
    hasNext: boolean;
    hasPrevious: boolean;
    onPageChange: (page: number) => void;
  };
  onSearch?: (query: string) => void;
  initialSearchQuery?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyField,
  onEdit,
  onDelete,
  className,
  pagination,
  onSearch,
  initialSearchQuery,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div>
       {onSearch && (
          <div className="mb-4">
            <SearchBox onSearch={handleSearch} />
          </div>
        )}
      <div className={className}>
        <Table>
          {/* Table content remains the same */}
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.header.toString()}>
                  {column.header}
                </TableHead>
              ))}
              {(onEdit || onDelete) && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell
                    key={column.header.toString()}
                    className={column.className}
                  >
                    {typeof column.accessor === "function"
                      ? column.accessor(item)
                      : String(item[column.accessor])}
                  </TableCell>
                ))}
                {(onEdit || onDelete) && (
                  <TableCell className="text-right space-x-2">
                    {onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(item)}
                      >
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(item[keyField])}
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="ghost"
                className={
                  !pagination.hasPrevious ? "opacity-50 cursor-not-allowed" : ""
                }
                onClick={() => {
                  if (pagination.hasPrevious) {
                    pagination.onPageChange(pagination.currentPage - 1);
                  }
                }}
                disabled={!pagination.hasPrevious}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            </PaginationItem>

            {Array.from(
              { length: Math.min(5, pagination.pageCount) },
              (_, i) => {
                let pageNum;
                if (pagination.pageCount <= 5) {
                  pageNum = i + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (pagination.currentPage >= pagination.pageCount - 2) {
                  pageNum = pagination.pageCount - 4 + i;
                } else {
                  pageNum = pagination.currentPage - 2 + i;
                }

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      isActive={pageNum === pagination.currentPage}
                      onClick={() => pagination.onPageChange(pageNum)}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
            )}

            <PaginationItem>
              <Button
                variant="ghost"
                className={
                  !pagination.hasNext ? "opacity-50 cursor-not-allowed" : ""
                }
                onClick={() => {
                  if (pagination.hasNext) {
                    pagination.onPageChange(pagination.currentPage + 1);
                  }
                }}
                disabled={!pagination.hasNext}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
