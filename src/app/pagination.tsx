import React, { useState } from "react";
import './globals.css';

type Props = {
  currentPage: number;
    pageCount: number;
    handle: (pageNumber: number) => void;
  };

const Pagination: React.FC<Props> = ({ currentPage, pageCount, handle }) => {
    return (
        <div className="pagination">
            <button
                key={'First'}
                name="first"
                className="pagination__item"
                onClick={() => {
                  handle(1);
                } }
            >
                {'First'}
            </button>
            <button
                key={'Prev'}
                name="previous"
                className="pagination__item"
                onClick={() => {
                    if (currentPage > 1) {
                      handle(currentPage - 1);
                    }
                } }
            >
                {'Prev'}
            </button>

            {Array.from({ length: currentPage >= pageCount - 2 ? 5 :currentPage <= 3 ? Math.min(5, pageCount) : Math.min(currentPage + 2, pageCount) - Math.max(currentPage - 2, 1) + 1 as number}, (_, i) => {
              let pageNumber: number = currentPage >= pageCount - 2 ? pageCount - 4 + i : Math.max(currentPage - 2, 1) + i;
              if (pageNumber > 0 && pageNumber <= pageCount) {
                return (  
                  <button
                    key={pageNumber}
                    name={'page-'+pageNumber}
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
                key={'Next'}
                name="next"
                className="pagination__item"
                onClick={() => {
                    if (currentPage < pageCount) {
                      handle(currentPage + 1);
                    }
                } }
            >
                {'Next'}
            </button>
            <button
                key={'Last'}
                name="last"
                className="pagination__item"
                onClick={() => {
                  handle(pageCount);
                } }
            >
                {'Last'}
            </button>
        </div>
  );
};

export default Pagination;