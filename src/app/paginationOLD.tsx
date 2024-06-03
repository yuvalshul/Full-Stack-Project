import { useEffect, useState } from 'react';

type Pagination ={
    numOfPages: number;
    currentPage: number;
  }
  
  const Pagination: React.FC<Pagination> = (numOfPages, currentPage) => {
    return(
      <div>
        <button>Next</button>
        <button>Prev</button>
        <button>First</button>
        <button>Last</button>
        <span>{currentPage-2}</span>
        <span>{currentPage-1}</span>
        <span>{currentPage}</span>
        <span>{currentPage+1}</span>
        <span>{currentPage+2}</span>
      </div>
    );
  }

  export default Pagination;