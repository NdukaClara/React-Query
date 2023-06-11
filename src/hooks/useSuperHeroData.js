import { useQuery, useQueryClient } from "react-query";
import axios from "axios";

const fetchSuperHero = ({ queryKey }) => {
    const heroId = queryKey[1];
    return axios.get(`http://localhost:4000/superheroes/${heroId}`);
}

export const useSuperHeroData = (heroId) => {
    // useQueryClient is used to get the data from the cache and use it as initial data for the query if it exists in the cache already. This prevents the need to make an extra request to the server to get the data that we already have in the cache. so the user will see the data immediately.
    const queryClient = useQueryClient();
    return useQuery(["super-hero", heroId], fetchSuperHero, {
        initialData: () => {
            const hero = queryClient.getQueryData("super-heroes")?.data?.find((hero) => hero.id === parseInt(heroId));

            if (hero) {
            return { data: hero };
            } else {
            return undefined;
            }
        }
    });
}