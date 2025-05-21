"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface CustomPaginationProps {
  totalPages: number;
  key?: string;
}

const CustomPagination = ({
  totalPages,
  key = "page",
}: CustomPaginationProps) => {
  const [page, setPage] = useQueryState(key, parseAsInteger.withDefault(0));

  const maxPagesToShow = 5; // 표시할 최대 페이지 수
  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= maxPagesToShow) {
      // 총 페이지 수가 표시할 최대 페이지 수보다 작거나 같으면 모든 페이지 번호 표시
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // 총 페이지 수가 표시할 최대 페이지 수보다 크면 현재 페이지를 기준으로 페이지 번호 표시
      const startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // 시작 페이지가 1보다 크면 "..." 표시
      if (startPage > 1) {
        pageNumbers.unshift("...");
        pageNumbers.unshift(1);
      }

      // 마지막 페이지가 totalPages보다 작으면 "..." 표시
      if (endPage < totalPages) {
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;
  const isCurrentOrDefaultPage = (pageNumber: number | string) => {
    if (page === 0 && pageNumber === 1) return true;
    return pageNumber === page;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent className="gap-x-2">
        {/* 첫 페이지 */}
        <PaginationItem>
          <PaginationLink
            onClick={() => setPage(1)}
            aria-label="Go to first page"
            aria-disabled={isFirstPage}
          >
            <ChevronsLeft size={16} />
            <span className="sr-only">Go to first page</span>
          </PaginationLink>
        </PaginationItem>

        {/* 앞 페이지 */}
        <PaginationItem>
          <PaginationLink
            onClick={() => setPage(Math.max(1, page - 1))}
            aria-label="Go to previous page"
            aria-disabled={isFirstPage}
          >
            <ChevronLeft size={16} />
            <span className="sr-only">Go to previous page</span>
          </PaginationLink>
        </PaginationItem>

        {/*
          페이지 번호 표시
          - 페이지 번호가 "..."이면 페이지 번호 대신 "..." 표시
          - 현재 페이지는 isActive로 표시
        */}
        {pageNumbers.map((pageNumber, index) => (
          <PaginationItem key={index}>
            {pageNumber === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                onClick={() => setPage(Number(pageNumber))}
                className={cn(
                  isCurrentOrDefaultPage(pageNumber) &&
                    "bg-secondary text-white hover:bg-secondary hover:text-white"
                )}
                aria-label={`Go to page ${pageNumber}`}
                isActive={isCurrentOrDefaultPage(pageNumber)}
              >
                {pageNumber}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* 뒷 페이지 */}
        <PaginationItem>
          <PaginationLink
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            aria-label="Go to next page"
            aria-disabled={isLastPage}
          >
            <ChevronRight size={16} />
            <span className="sr-only">Go to next page</span>
          </PaginationLink>
        </PaginationItem>

        {/* 마지막 페이지 */}
        <PaginationItem>
          <PaginationLink
            onClick={() => setPage(totalPages)}
            aria-label="Go to last page"
            aria-disabled={isLastPage}
          >
            <ChevronsRight size={16} />
            <span className="sr-only">Go to last page</span>
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
