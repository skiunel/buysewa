import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box, Flex, Container, Tabs, TabList, Tab, HStack, Text, Icon,
  useColorModeValue, Heading, Button,
} from '@chakra-ui/react';
import { FaHome, FaBoxOpen, FaShoppingCart, FaStar, FaEthereum, FaPlus } from 'react-icons/fa';

function AdminNavigation({ showAddButton = false }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const headerBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const getTabIndex = () => {
    if (currentPath.includes('/admin/products')) return 1;
    if (currentPath.includes('/admin/orders')) return 2;
    if (currentPath.includes('/admin/reviews')) return 3;
    if (currentPath.includes('/admin/blockchain-reviews')) return 4;
    return 0;
  };

  return (
    <Box bg={headerBg} borderBottom="1px" borderColor={borderColor} py={4} mb={6} position="sticky" top={0} zIndex={10}>
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="lg">Admin Panel</Heading>
          {showAddButton && (
            <Link to="/admin/products/new">
              <Button leftIcon={<FaPlus />} colorScheme="blue">Add Product</Button>
            </Link>
          )}
        </Flex>
        <Tabs index={getTabIndex()} variant="soft-rounded" colorScheme="blue" isLazy>
          <TabList flexWrap="wrap" gap={1}>
            <Link to="/admin"><Tab><HStack spacing={2}><Icon as={FaHome} /><Text>Dashboard</Text></HStack></Tab></Link>
            <Link to="/admin/products"><Tab><HStack spacing={2}><Icon as={FaBoxOpen} /><Text>Products</Text></HStack></Tab></Link>
            <Link to="/admin/orders"><Tab><HStack spacing={2}><Icon as={FaShoppingCart} /><Text>Orders</Text></HStack></Tab></Link>
            <Link to="/admin/reviews"><Tab><HStack spacing={2}><Icon as={FaStar} /><Text>Reviews</Text></HStack></Tab></Link>
            <Link to="/admin/blockchain-reviews"><Tab><HStack spacing={2}><Icon as={FaEthereum} /><Text>Blockchain</Text></HStack></Tab></Link>
          </TabList>
        </Tabs>
      </Container>
    </Box>
  );
}

export default AdminNavigation;
