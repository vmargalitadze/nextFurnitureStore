"use client";

import React, { FC, useCallback, Suspense } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface PaginationProps {
  pageCount: number;
}

interface PaginationArrowProps {
  direction: "left" | "right";
  onClick: () => void;
  isDisabled: boolean;
}

const PaginationArrow: FC<PaginationArrowProps> = React.memo(
  ({ direction, onClick, isDisabled }) => {
    const isLeft = direction === "left";

    return (
      <button
        onClick={onClick}
        className="bg-gray-100 cursor-pointer text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded"
        aria-label={isLeft ? "Previous page" : "Next page"}
        disabled={isDisabled}
      >
        {isLeft ? <FaArrowLeft /> : <FaArrowRight />}
      </button>
    );
  }
);

PaginationArrow.displayName = "PaginationArrow";

const PaginationContent: FC<PaginationProps> = ({ pageCount }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = useCallback(
    (pageNumber: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", pageNumber.toString());
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams]
  );

  const goToPage = useCallback(
    (pageNumber: number) => {
      if (pageNumber !== currentPage && pageNumber > 0 && pageNumber <= pageCount) {
        router.push(createPageURL(pageNumber));
      }
    },
    [currentPage, createPageURL, pageCount, router]
  );

  return (
    <div className="flex justify-center mb-9 lg:mb-0 cursor-pointer items-center gap-2 lg:mt-8">
      <PaginationArrow
        direction="left"
        onClick={() => goToPage(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />
      <span className="p-2 font-semibold text-gray-500">
        გვერდი {currentPage}
      </span>
      <PaginationArrow
        direction="right"
        onClick={() => goToPage(currentPage + 1)}
        isDisabled={currentPage >= pageCount}
      />
    </div>
  );
};

// ეს არის საბოლოო export-ერი კომპონენტი
const PaginationComponent: FC<PaginationProps> = ({ pageCount }) => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center">Loading pagination...</div>}>
      <PaginationContent pageCount={pageCount} />
    </Suspense>
  );
};

export default React.memo(PaginationComponent);
