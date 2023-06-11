import { useState } from "react";
import { Link } from "react-router-dom";
import { useAddSuperHeroData, useSuperHeroesData } from "../hooks/useSuperHeroesData";

export const RQSuperHeroesPage = () => {
  const [name, setName] = useState("");
  const [alterEgo, setAlterEgo] = useState("");

  const onSuccess = (data) => {
    console.log("success", data);
  };
  const onError = (error) => {
    console.log("success", error);
  };
  const { isLoading, data, isError, error, isFetching, refetch } = useSuperHeroesData(onSuccess, onError);

 // if you have multiple mutations, you can alias the mutate function. ie. const { mutate: addHero } = useAddSuperHeroData(); then you can call addHero({ name, alterEgo });
  const { mutate } = useAddSuperHeroData();

  const handleAddHeroClick = () => {
    console.log({ name, alterEgo });
    // or const hero = { name, alterEgo }; mutate(hero);
    mutate({ name, alterEgo });
  };

  if (isLoading || isFetching) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  return (
    <>
      <h2>React Query Super Heroes Page</h2> 
      <div>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" value={alterEgo} onChange={(e) => setAlterEgo(e.target.value)} />
        <button onClick={handleAddHeroClick}>Add Hero</button>
      </div>
      <button onClick={refetch}>Fetch heros</button>
      {data.data.map((hero) => {
        return <div key={hero.id}>
          <Link to={`/rq-super-heroes/${hero.id}`}>{hero.name}</Link>
          </div>;
      })}

      {/* updated jsx for transforming query */}
      {/* {data.map((heroName) => {
        return <div key={heroName}>{heroName}</div>
      })} */}
    </>
  );
};
