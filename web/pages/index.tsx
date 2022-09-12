import { Button } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useCallback, useEffect, useRef, useState } from "react";

import { GuessForm } from "../components/guessForm";
import { GuessTable } from "../components/guessTable";
import { guessResult } from "../types";

const URL = "wss://45dl55ctc3.execute-api.us-east-1.amazonaws.com/production/";

const Home: NextPage = () => {
  const [guesses, setGuesses] = useState<Array<guessResult>>([]);

  const [isConnected, setIsConnected] = useState(false);
  const socket = useRef<WebSocket | null>(null);

  const onConnect = useCallback(() => {
    if (!socket.current || socket.current?.readyState == WebSocket.OPEN) {
      socket.current = new WebSocket(URL + "?team_name=love");
      socket.current.addEventListener("message", (event) => {
        console.log(event.data);
      });
    }
    setIsConnected(true);
  }, []);

  const onDisconnect = useCallback(() => {
    socket.current?.close();
  }, []);

  useEffect(() => {
    return () => {
      socket.current?.close();
      setIsConnected(false);
    };
  }, []);

  return (
    <div>
      {isConnected ? (
        <Button onClick={onConnect}>Connect</Button>
      ) : (
        <Button onClick={onDisconnect}>Disconnect</Button>
      )}
      <GuessForm guesses={guesses} setGuesses={setGuesses} />

      <GuessTable guesses={guesses} />
    </div>
  );
};

export default Home;
