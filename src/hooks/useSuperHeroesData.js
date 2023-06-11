import { useQuery, useMutation, useQueryClient } from "react-query";
// import axios from "axios";
import { request } from "../utils/axios-utils";

const fetchSuperHeroes = () => {
 // return axios.get("http://localhost:4000/superheroes");
  return request({ url: "/superheroes" });
};

const addSuperHero = (newHero) => {
  // return axios.post("http://localhost:4000/superheroes", newHero);
  return request({ url: "/superheroes", method: "POST", data: newHero });
};

export const useSuperHeroesData = (onSuccess, onError) => {
  return useQuery("super-heroes", fetchSuperHeroes, {
    // callbacks to run when the query is successful or when the query fails. these callbacks are useful for things like showing a toast message or a notification when the query is successful or when the query fails.
    onSuccess,
    onError,

    //data transformation is used to convert query response to a format that the frontend can consume easily. for example, you may want to convert the response to an array of objects or you may want to convert the response to an object with the id as the key and the rest of the data as the value. you can also use this to filter out some data from the response.
    // select: (data) => {
    //   const superHeroNames = data.data.map((hero) => hero.name)
    //   return superHeroNames
    // },

    // cacheTime: 10000, // optionally changing react-query's default cache time of 5 minutes to 10 seconds. cachTime stores the data in the cache for the specified amount of time. after the cache time expires, the data will be refetched. if the cache time is set to 0, the data will be refetched every time the component is rendered.

    // staleTime: 10000, // staleTime helps to prevent the "loading" state from flashing on the screen. used when you want to keep showing the old data while the new data is being fetched. used to reduce the network calls or requests for the same data. default staleTime is 0, which means that the data will be refetched every time the component is rendered.

    // refetchOnWindowFocus: false, // default is true - refetches the data when the window regains focus (when the user switches back to the browser tab)

    // refetchOnMount: false, // default is true - refetches the data when the component mounts

    //refetchInterval: 10000, // default is false - refetches the data every 10 seconds

    //refetchIntervalInBackground: false, // default is false - refetches the data every 10 seconds even when the browser tab is in the background

    // enabled: false, // default is true - enables or disables the query. when disabled, the query will not run when the component mounts. this is useful when you want to disable a query based on a condition. for example, you may want to disable a query when the user is not logged in or you want to enable a query when the user clicks a button.
  });
};

export const useAddSuperHeroData = () => {
  const queryClient = useQueryClient();
  return useMutation(addSuperHero, {
    // onSuccess: (data) => {
    //   // queryClient.invalidateQueries("super-heroes"); // invalidates the query cache for the "super-heroes" query key. this will refetch the data for the "super-heroes" query key.

    //   //setQueryData is used to update the query cache for the "super-heroes" query key. this will not refetch the data for the "super-heroes" query key.
    //   queryClient.setQueryData("super-heroes", (oldQueryData) => {
    //     return {
    //       ...oldQueryData,
    //       data: [...oldQueryData.data, data.data],
    //     };
    //   });
    // },

    // onMutate, onError, and onSettled are used for optimistic updates. optimistic updates are used to update the UI immediately before the mutation is fired. this is useful when you want to show the user that the data is being updated. for example, you may want to show a toast message or a notification when the user clicks a button to update the data. optimistic updates are also useful when you want to rollback the changes if the mutation fails.
    // onMutate is called before the mutation fn is fired and is passed the same variables the mutation fn receives
    onMutate: async (newHero) => {
      await queryClient.cancelQueries("super-heroes"); // cancels any outgoing queries with the "super-heroes" query key. this is useful when you want to cancel any ongoing queries when the user clicks a button.
      const previousHeroData = queryClient.getQueryData("super-heroes"); // gets the query cache for the "super-heroes" query key. used to get hold of the current data before making any update incase the mutation fails and we want to rollback the changes.

        queryClient.setQueryData("super-heroes", (oldQueryData) => {
        return {
          ...oldQueryData,
         data: [...oldQueryData.data, {
          id: oldQueryData?.data?.length + 1, ...newHero
         }],
        };
      });
      return { previousHeroData };
    },

    // onError is called when the mutation fails and is passed the error and the variables the mutation fn receives
    onError: (_error, _newHero, context) => {
      queryClient.setQueryData("super-heroes", context.previousHeroData); // rollback the changes
    },

    // onSettled is called when the mutation is successful or when the mutation fails. all we have to do here is refetch the "super-heroes" query key to get the latest data. this will ensure that the data is always in sync with the server.
    onSettled: () => {
      queryClient.invalidateQueries("super-heroes");
    }
  });
};
