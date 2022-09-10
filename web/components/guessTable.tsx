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
import { FC } from "react";

import { guessResult } from "../types";

interface GuessTableProps {
  guesses: Array<guessResult>;
}

export const GuessTable: FC<GuessTableProps> = ({ guesses }) => {
  return (
    <TableContainer>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Color</Th>
            <Th>HexCode</Th>
            <Th>Message</Th>
          </Tr>
        </Thead>
        <Tbody>
          {guesses.map((guess, idx) => (
            <Tr key={idx}>
              <Td>
                <Box bg={"#" + guess.guess} w="10px" h="10px"></Box>
              </Td>
              <Td>{guess.guess}</Td>
              <Td>{guess.response}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
