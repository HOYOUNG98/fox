import { Dispatch, FC } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

interface ConnectModal {
  isConnected: boolean;
  onConnect: (team: string) => void;
  onDisconnect: () => void;
  setTeam: Dispatch<React.SetStateAction<string>>;
  team: string;
}

export const ConnectModal: FC<ConnectModal> = ({
  isConnected,
  onConnect,
  onDisconnect,
  setTeam,
  team,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTeam(e.target.value);
  };

  return (
    <>
      <Icon
        onClick={onOpen}
        viewBox="0 0 200 200"
        color={isConnected ? "green.500" : "red.500"}
      >
        <path
          fill="currentColor"
          d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
        />
      </Icon>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Play with your friends!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Enter a team name of your choice and join!
            <FormControl marginTop="20px">
              <FormLabel>Team Name</FormLabel>
              <Input
                onChange={handleTeamNameChange}
                placeholder="Team Name"
                disabled={isConnected}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            {isConnected ? (
              <Button mr={3} onClick={onDisconnect}>
                Leave
              </Button>
            ) : (
              <Button colorScheme="blue" mr={3} onClick={() => onConnect(team)}>
                Join
              </Button>
            )}

            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
