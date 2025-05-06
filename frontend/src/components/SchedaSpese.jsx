import { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { getSchedaSpese } from "../features/schedaSpese/schedaSpeseSlice";
import SingleScheda from "./SingleScheda";

function SchedaSpese() {
  const dispatch = useDispatch();

  const { schedaSpese, isLoading, isError, message } = useSelector(
    (state) => state.schedaSpese
  )

  useEffect(() => {
    if (schedaSpese.length === 0) dispatch(getSchedaSpese());
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p className="text-danger">Error: {message}</p>;

  return (
    // console.log(schedaSpese, isLoading, isError, message, "schedaSpese"), // Debugging;

    <>
      <section>
        {schedaSpese.length > 0 ? (
            schedaSpese.map((scheda) => (
            <SingleScheda key={scheda._id} scheda={scheda}/>
            ))
        ) : (
            <p>No schede available.</p>
        )}
      </section>
    </>
  );
}

export default SchedaSpese