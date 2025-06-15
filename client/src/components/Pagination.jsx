import React from "react";
import {  useSearchParams } from "react-router";

const Pagination = ({ page, limit, totalPages }) => {
  if (totalPages <= 1) return null; 
  const [searchParams, setSearchParams] = useSearchParams();

  const updateQueryParams = (newPage) => {
    setSearchParams({ page: newPage, limit });
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (totalPages > maxPagesToShow) {
      if (endPage === totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex justify-center space-x-2 mt-4">
      {page > 1 && (
        <button
          onClick={() => updateQueryParams(page - 1)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Prev
        </button>
      )}

      {generatePageNumbers().map((num) => (
        <button
          key={num}
          onClick={() => updateQueryParams(num)}
          className={`px-4 py-2 rounded ${
            page === num ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {num}
        </button>
      ))}

      {page < totalPages && (
        <button
          onClick={() => updateQueryParams(page + 1)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Pagination;
