import { useInfiniteQuery } from "react-query";
import axios from "axios";
import { Fragment } from "react";


const fetchColors = ({ pageParam = 1 }) => {
  return axios.get(`http://localhost:4000/colors?_limit=2&_page=${pageParam}`);
};

export const InfiniteQueriesPage = () => {
  const { data, isLoading, isError, error, hasNextPage, fetchNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery(
    ["colors"],
    fetchColors,
    {
      // getNextPageParam gives us a prop called hasNextPage which we can use to determine if there are more pages to fetch
      getNextPageParam: (_lastPage, pages) => {
        if (pages.length < 5) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div>
        {data?.pages.map((group, i) => {
          return (
            <Fragment key={i}>
                {group.data.map((color) => {
                    return (
                    <h2 key={color.id}>{color.id} {color.name}</h2> 
                );
                })}
            </Fragment>
          );
        })}
      </div>
      <div>
        <button disabled={!hasNextPage} onClick={fetchNextPage}>Load more</button>
      </div>
        <div>
            {isFetching && !isFetchingNextPage ? 'Fetching...' : null}
        </div>
    </>
  );
};
