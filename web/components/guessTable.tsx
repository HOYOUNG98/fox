import { Box } from "@chakra-ui/react";
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/table";
import { FC, useEffect, useState } from "react";

import { guessResult } from "../types";

interface GuessTableProps {
  guesses: Array<guessResult>;
}

export const GuessTable: FC<GuessTableProps> = ({ guesses }) => {
  const boldGuess = (response: guessResult) => {
    return response.response === "You got it!" ? "bold" : "normal";
  };

  return (
    <TableContainer overflowY="auto">
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Guess#</Th>
            <Th>Color</Th>
            <Th>HexCode</Th>
            <Th>Message</Th>
          </Tr>
        </Thead>
        <Tbody>
          {guesses.map((guess, idx) => (
            <Tr key={idx}>
              <Td fontWeight={boldGuess(guess)}>{guesses.length - idx}</Td>
              <Td>
                <Box bg={"#" + guess.guess} w="10px" h="10px"></Box>
              </Td>
              <Td fontWeight={boldGuess(guess)}>
                {"#" + guess.guess.toUpperCase()}
              </Td>
              <Td fontWeight={boldGuess(guess)}>{guess.response}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
