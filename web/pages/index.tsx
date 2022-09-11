import { Container } from "@chakra-ui/layout";
import type { NextPage } from "next";
import { useState } from "react";

import { GuessForm } from "../components/guessForm";
import { GuessTable } from "../components/guessTable";
import { guessResult } from "../types";

const Home: NextPage = () => {
  const [guesses, setGuesses] = useState<Array<guessResult>>([]);

  return (
    <Container maxW="5xl" marginTop="20px">
      <GuessForm guesses={guesses} setGuesses={setGuesses} />

      <GuessTable guesses={guesses} />
    </Container>
  );
};

export default Home;
