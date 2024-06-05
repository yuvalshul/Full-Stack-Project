import React, { useState } from "react";
import './globals.css';

type Props = {
  currentPage: number;
    pageCount: number;
    handle: (pageNumber: number) => void;
  };

const Pagination: React.FC<Props> = (props) => {
    const { currentPage, pageCount, handle} = props;

    return (
        <div className="pagination">
            <button
                key={'<<'}
                className="pagination__item"
                onClick={() => {
                  handle(1);
                } }
            >
                {'<<'}
            </button>
            <button
                key={'<'}
                className="pagination__item"
                onClick={() => {
                    if (currentPage > 1) {
                      handle(currentPage - 1);
                    }
                } }
            >
                {'<'}
            </button>

            {Array.from({ length: currentPage <= 3 ? Math.min(5, pageCount) : Math.min(currentPage + 2, pageCount) - Math.max(currentPage - 2, 1) + 1 }, (_, i) => {
              const pageNumber = Math.max(currentPage - 2, 1) + i;
              if (pageNumber > 0 && pageNumber <= pageCount) {
                return (  
                  <button
                    key={pageNumber}
                    onClick={() => handle(pageNumber)}
                    className={pageNumber === currentPage ? 'pagination__item--active' : 'pagination__item'}
                  >
                    {pageNumber}
                  </button>
                );
              } else {
                return null;
              }
            
            })}

            <button
                key={'>'}
                className="pagination__item"
                onClick={() => {
                    if (currentPage < pageCount) {
                      handle(currentPage + 1);
                    }
                } }
            >
                {'>'}
            </button>
            <button
                key={'>>'}
                className="pagination__item"
                onClick={() => {
                  handle(pageCount);
                } }
            >
                {'>>'}
            </button>
        </div>
  );
};

export default Pagination;