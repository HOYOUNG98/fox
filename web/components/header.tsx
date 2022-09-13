import { Dispatch, FC } from "react";
import { Flex, Heading, Stack, Text, Spacer, Box } from "@chakra-ui/react";
import { ConnectModal } from "./connectModal";

interface HeaderProps {
  isConnected: boolean;
  onConnect: (team: string) => void;
  onDisconnect: () => void;
  setTeam: Dispatch<React.SetStateAction<string>>;
  team: string;
}

export const Header: FC<HeaderProps> = ({
  isConnected,
  onConnect,
  onDisconnect,
  setTeam,
  team,
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
            setTeam={setTeam}
            team={team}
          />
        </Box>
      </Flex>
      <Box>
        <Text marginRight="50px">
          Try guessing hexcode of today's color. It can range from #FFFFFF to
          #000000. Note that each digit of hexcode is from 0 to F. Response
          message will notify you which of Red, Green, or Blue is off. The first
          two digits are for R, next two are G, and last is B.
        </Text>
      </Box>
    </Stack>
  );
};
