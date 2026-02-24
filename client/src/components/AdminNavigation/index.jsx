import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box, Flex, Container, Tabs, TabList, Tab, HStack, Text, Icon,
  useColorModeValue, Heading, Button,
} from '@chakra-ui/react';
import {
  FaHome, FaBoxOpen, FaShoppingCart, FaStar, FaEthereum, FaPlus,
  FaChartLine, FaStore,
} from 'react-icons/fa';

function AdminNavigation({ showAddButton = false }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const headerBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const getTabIndex = () => {
    if (currentPath.includes('/admin/products')) return 1;
    if (currentPath.includes('/admin/orders')) return 2;
    if (currentPath.includes('/admin/reviews')) return 3;
    if (currentPath.includes('/admin/blockchain')) return 4;
    if (currentPath.includes('/admin/analytics')) return 5;
    if (currentPath.includes('/admin/stores')) return 6;
    return 0;
  };

  return (
    <Box bg={headerBg} borderBottom="1px" borderColor={borderColor} py={4} mb={6} position="sticky" top={0} zIndex={10} shadow="sm">
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" mb={4}>
          <HStack spacing={2}>
            <Icon as={FaStore} color="blue.500" />
            <Heading size="md">BuySewa Admin</Heading>
          </HStack>
          {showAddButton && (
            <Link to="/admin/products/new">
              <Button leftIcon={<FaPlus />} colorScheme="blue" size="sm">Add Product</Button>
            </Link>
          )}
        </Flex>
        <Tabs index={getTabIndex()} variant="soft-rounded" colorScheme="blue" isLazy>
          <TabList flexWrap="wrap" gap={1}>
            <Link to="/admin">
              <Tab fontSize="sm"><HStack spacing={1}><Icon as={FaHome} /><Text>Dashboard</Text></HStack></Tab>
            </Link>
            <Link to="/admin/products">
              <Tab fontSize="sm"><HStack spacing={1}><Icon as={FaBoxOpen} /><Text>Products</Text></HStack></Tab>
            </Link>
            <Link to="/admin/orders">
              <Tab fontSize="sm"><HStack spacing={1}><Icon as={FaShoppingCart} /><Text>Orders</Text></HStack></Tab>
            </Link>
            <Link to="/admin/reviews">
              <Tab fontSize="sm"><HStack spacing={1}><Icon as={FaStar} /><Text>Reviews</Text></HStack></Tab>
            </Link>
            <Link to="/admin/blockchain">
              <Tab fontSize="sm"><HStack spacing={1}><Icon as={FaEthereum} /><Text>Blockchain</Text></HStack></Tab>
            </Link>
            <Link to="/admin/analytics">
              <Tab fontSize="sm"><HStack spacing={1}><Icon as={FaChartLine} /><Text>Analytics</Text></HStack></Tab>
            </Link>
            <Link to="/admin/stores">
              <Tab fontSize="sm"><HStack spacing={1}><Icon as={FaStore} /><Text>Stores</Text></HStack></Tab>
            </Link>
          </TabList>
        </Tabs>
      </Container>
    </Box>
  );
}

export default AdminNavigation;
