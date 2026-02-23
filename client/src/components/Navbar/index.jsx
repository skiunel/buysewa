import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Flex, Text, Button, IconButton, Stack, Badge,
  Avatar, Menu, MenuButton, MenuList, MenuItem, MenuDivider,
  useColorModeValue, HStack,
} from '@chakra-ui/react';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaCog, FaHome } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useBasket } from '../../contexts/BasketContext.jsx';

function Navbar() {
  const { loggedIn, user, logout } = useAuth();
  const { items } = useBasket();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box
      as="nav"
      position="sticky"
      top="0"
      zIndex="sticky"
      bg={bgColor}
      boxShadow="sm"
      borderBottom="1px"
      borderColor={borderColor}
      px={{ base: 4, md: 8 }}
    >
      <Flex minH="64px" align="center" justify="space-between">
        {/* Logo */}
        <Link to="/">
          <Text fontWeight="bold" fontSize="xl" color="blue.600" _hover={{ color: 'blue.700' }}>
            BuySewa
          </Text>
        </Link>

        {/* Nav links */}
        <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
          <Link to="/"><Button variant="ghost" leftIcon={<FaHome />}>Home</Button></Link>
          {loggedIn && user?.role === 'admin' && (
            <Link to="/admin"><Button variant="ghost" leftIcon={<FaCog />}>Admin</Button></Link>
          )}
        </HStack>

        {/* Right side */}
        <HStack spacing={3}>
          {loggedIn ? (
            <>
              <Link to="/basket">
                <Box position="relative">
                  <IconButton icon={<FaShoppingCart />} variant="ghost" aria-label="Basket" />
                  {items.length > 0 && (
                    <Badge colorScheme="red" position="absolute" top="-1" right="-1" borderRadius="full" fontSize="xs">
                      {items.length}
                    </Badge>
                  )}
                </Box>
              </Link>
              <Menu>
                <MenuButton as={Button} variant="link" cursor="pointer" minW={0}>
                  <Avatar size="sm" name={user?.email || 'User'} bg="blue.500" />
                </MenuButton>
                <MenuList>
                  <Link to="/profile"><MenuItem icon={<FaUser />}>Profile & Orders</MenuItem></Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin"><MenuItem icon={<FaCog />}>Admin Dashboard</MenuItem></Link>
                  )}
                  <MenuDivider />
                  <MenuItem icon={<FaSignOutAlt />} onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <Stack direction="row" spacing={2}>
              <Link to="/signin"><Button colorScheme="blue" size="sm">Sign In</Button></Link>
              <Link to="/signup"><Button colorScheme="green" size="sm">Sign Up</Button></Link>
            </Stack>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}

export default Navbar;
