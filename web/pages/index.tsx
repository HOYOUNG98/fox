import { Button, Flex, Heading, Input, Spacer } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useCallback, useEffect, useRef, useState } from "react";

import { GuessForm } from "../components/guessForm";
import { GuessTable } from "../components/guessTable";
import { guessResult } from "../types";

const URL = "wss://45dl55ctc3.execute-api.us-east-1.amazonaws.com/production/";

const Home: NextPage = () => {
  const [guesses, setGuesses] = useState<Array<guessResult>>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [team, setTeam] = useState<string>("");

  const socket = useRef<WebSocket | null>(null);

  const onSocketOpen = useCallback(() => {
    setIsConnected(true);
  }, []);

  const onSocketClose = useCallback(() => {
    setIsConnected(false);
  }, []);

  const onConnect = useCallback(() => {
    if (!socket.current || socket.current?.readyState == WebSocket.OPEN) {
      socket.current = new WebSocket(URL + `?team_name=${team}`);
      socket.current.addEventListener("open", onSocketOpen);
      socket.current.addEventListener("close", onSocketClose);
      socket.current.addEventListener("message", (event) => {
        var response = JSON.parse(event.data);
        setGuesses((guesses) => [
          { guess: response.guess, response: response.response },
          ...guesses,
        ]);
      });
    }
  }, [guesses, team]);

  const onDisconnect = useCallback(() => {
    if (isConnected) {
      socket.current?.close();
    }
  }, [isConnected]);

  const onSendResponse = useCallback((guess: string, response: string) => {
    socket.current?.send(
      JSON.stringify({
        action: "send_team",
        guess,
        response,
      })
    );
  }, []);

  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTeam(e.target.value);
  };

  return (
    <div>
      {!isConnected ? (
        <Flex>
          <Input onChange={handleTeamNameChange} />
          <Button onClick={onConnect}>Join</Button>
        </Flex>
      ) : (
        <Button onClick={onDisconnect}>Disconnect</Button>
      )}
      <GuessForm
        guesses={guesses}
        setGuesses={setGuesses}
        isConnected={isConnected}
        onSendResponse={onSendResponse}
      />

      <GuessTable guesses={guesses} />
    </div>
  );
};

export default Home;
