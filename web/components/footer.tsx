import { FC } from "react";
import { Icon, Center, Box } from "@chakra-ui/react";
import { FiCode } from "react-icons/fi";
import { GiPirateFlag } from "react-icons/gi";
import { AiOutlineHeart } from "react-icons/ai";
import NextLink from "next/link";

export const Footer: FC = () => {
  return (
    <Center minH="50px" maxH="50px">
      Powered by
      <NextLink href="https://github.com/HOYOUNG98/fox" passHref>
        <Icon as={FiCode} marginTop="2px" marginLeft="4px" marginRight="5px" />
      </NextLink>
      · <Box width="5px" />
      Made in
      <Icon as={GiPirateFlag} marginLeft="4px" marginRight="5px" />·{" "}
      <Box width="5px" />
      With
      <NextLink href="https://www.leah-lee.com" passHref>
        <Icon as={AiOutlineHeart} marginTop="0.3px" marginLeft="4px" />
      </NextLink>
    </Center>
  );
};
