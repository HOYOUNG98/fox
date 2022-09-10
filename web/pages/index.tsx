import type { NextPage } from "next";
import { useState } from "react";

import { GuessForm } from "../components/guessForm";
import { GuessTable } from "../components/guessTable";
import { guessResult } from "../types";

const Home: NextPage = () => {
  const [guesses, setGuesses] = useState<Array<guessResult>>([]);

  return (
    <div>
      <GuessForm guesses={guesses} setGuesses={setGuesses} />

      <GuessTable guesses={guesses} />
    </div>
  );
};

export default Home;
