import { FC, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
  Text,
  Spacer,
  Box,
} from "@chakra-ui/react";
import { ConnectModal } from "./connectModal";

interface HeaderProps {
  isConnected: boolean;
  onConnect: any;
  onDisconnect: any;
}

export const Header: FC<HeaderProps> = ({
  isConnected,
  onConnect,
  onDisconnect,
}) => {
  return (
    <Stack>
      <Flex display="flex">
        <Heading size="lg">Guess Today's Color!</Heading>
        <Spacer />
        <Box justifyContent="center" alignItems="center">
          <ConnectModal
            isConnected={isConnected}
            onConnect={onConnect}
            onDisconnect={onDisconnect}
          />
        </Box>
      </Flex>
      <Text>
        Try guessing hexcode of today's color. It can range from #FFFFFF to
        #000000. Note that each digit of hexcode is from 0 to F. Response
        message will notify you which of Red, Green, or Blue is off. The first
        two digits are for R, next two are G, and last is B.
      </Text>
    </Stack>
  );
};
