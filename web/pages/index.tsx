import { Container } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useCallback, useRef, useState } from "react";

import { GuessForm } from "../components/guessForm";
import { GuessTable } from "../components/guessTable";
import { Header } from "../components/header";
import { guessResult } from "../types";

const URL = "wss://45dl55ctc3.execute-api.us-east-1.amazonaws.com/production/";

const Home: NextPage = () => {
  const [guesses, setGuesses] = useState<Array<guessResult>>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [team, setTeam] = useState<string>("");
  const toast = useToast();

  const socket = useRef<WebSocket | null>(null);

  const onSocketOpen = useCallback(() => {
    toast({
      title: "Connection Established!",
      description: `You have joined ${team}`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    setIsConnected(true);
  }, []);

  const onSocketClose = useCallback(() => {
    toast({
      title: "You Left the Team",
      status: "warning",
      duration: 5000,
      isClosable: true,
    });

    setIsConnected(false);
  }, []);

  const onConnect = useCallback(
    (team: string) => {
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
    },
    [guesses]
  );

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

  return (
    <Container maxW="5xl" marginTop="20px">
      <Header
        isConnected={isConnected}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
        setTeam={setTeam}
        team={team}
      />

      <GuessForm
        guesses={guesses}
        setGuesses={setGuesses}
        isConnected={isConnected}
        onSendResponse={onSendResponse}
      />

      <GuessTable guesses={guesses} />
    </Container>
  );
};

export default Home;
