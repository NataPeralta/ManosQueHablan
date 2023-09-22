
import {Box, Flex, HStack, IconButton, useDisclosure, useColorModeValue, Stack} from "@chakra-ui/react";
import {HamburgerIcon, CloseIcon} from "@chakra-ui/icons";
import {NavLink, Link} from "react-router-dom";

const Links = [
  {label: "Home", href: ""},
  {label: "Pagos", href: "payments"},
  {label: "Estudiantes", href: "students"},
  {label: "Cursos", href: "courses"},
];


export default function Simple() {
  const {isOpen, onOpen, onClose} = useDisclosure();

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton size={"md"} icon={isOpen ? <CloseIcon /> : <HamburgerIcon />} aria-label={"Open Menu"} display={{md: "none"}} onClick={isOpen ? onClose : onOpen} />
          <HStack spacing={8} alignItems={"center"}>
            <HStack as={"nav"} spacing={4} display={{base: "none", md: "flex"}}>
              {Links.map(({label, href}) => (
                <NavLink key={label}>
                  <Link
                    to={`/${href}`}
                    as="a"
                    px={2}
                    py={1}
                    rounded={"md"}
                    _hover={{
                      textDecoration: "none",
                    }}
                    href={`/${href}`}
                  >
                    {label}
                  </Link>
                </NavLink>
              ))}
            </HStack>
          </HStack>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{md: "none"}}>
            <Stack as={"nav"} spacing={4}>
              {Links.map(({label, href}) => (
                <NavLink key={label}>
                  <Link
                    to={`/${href}`}
                    as="a"
                    px={2}
                    py={1}
                    rounded={"md"}
                    _hover={{
                      textDecoration: "none",
                    }}
                    href={`/${href}`}
                    onClick={() => {
                      onClose();
                    }}
                  >
                    {label}
                  </Link>
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}

