import React, { useState } from "react";
import './globals.css';

type Props = {
    page: number;
    pageCount: number;
  };

const Pagination: React.FC<Props> = (props) => {
    const { page, pageCount } = props;
    const [currentPage, setCurrentPage] = useState<number>(page);

    return (
        <div className="pagination">
            <button
                key={'<<'}
                className="pagination__item"
                onClick={() => {
                    setCurrentPage(1);
                } }
            >
                {'<<'}
            </button>
            <button
                key={'<'}
                className="pagination__item"
                onClick={() => {
                    if (currentPage > 1) {
                        setCurrentPage(currentPage - 1);
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
                    onClick={() => setCurrentPage(pageNumber)}
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
                        setCurrentPage(currentPage + 1);
                    }
                } }
            >
                {'>'}
            </button>
            <button
                key={'>>'}
                className="pagination__item"
                onClick={() => {
                    setCurrentPage(pageCount);
                } }
            >
                {'>>'}
            </button>
        </div>
  );
};

export default Pagination;