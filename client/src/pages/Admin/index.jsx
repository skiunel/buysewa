import React from 'react';
import { useQuery } from 'react-query';
import { fetchProductList, fetchOrders } from '../../api/index.js';
import AdminNavigation from '../../components/AdminNavigation/index.jsx';
import {
  Box, Container, Heading, SimpleGrid, Stat, StatLabel, StatNumber,
  StatHelpText, Card, CardBody, HStack, Icon, Text, useColorModeValue, Spinner, Center,
} from '@chakra-ui/react';
import { FaBoxOpen, FaShoppingCart, FaDollarSign, FaEthereum } from 'react-icons/fa';

function AdminHome() {
  const pageBg = useColorModeValue('gray.50', 'gray.800');
  const { data: products, isLoading: productsLoading } = useQuery('admin:products', fetchProductList);
  const { data: orders, isLoading: ordersLoading } = useQuery('admin:orders', fetchOrders);

  const deliveredOrders = orders?.filter((o) => o.deliveryStatus === 'Delivered').length || 0;
  const avgPrice = products?.length ? (products.reduce((s, p) => s + p.price, 0) / products.length).toFixed(2) : 0;

  return (
    <Box bg={pageBg} minH="100vh">
      <AdminNavigation showAddButton />
      <Container maxW="container.xl" py={4}>
        <Heading size="lg" mb={6}>Dashboard Overview</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <Card><CardBody><Stat>
            <StatLabel>Total Products</StatLabel>
            <StatNumber>{productsLoading ? <Spinner size="sm" /> : products?.length || 0}</StatNumber>
            <StatHelpText><HStack><Icon as={FaBoxOpen} /><Text>All Products</Text></HStack></StatHelpText>
          </Stat></CardBody></Card>
          <Card><CardBody><Stat>
            <StatLabel>Total Orders</StatLabel>
            <StatNumber>{ordersLoading ? <Spinner size="sm" /> : orders?.length || 0}</StatNumber>
            <StatHelpText><HStack><Icon as={FaShoppingCart} /><Text>All Orders</Text></HStack></StatHelpText>
          </Stat></CardBody></Card>
          <Card><CardBody><Stat>
            <StatLabel>Delivered Orders</StatLabel>
            <StatNumber>{ordersLoading ? <Spinner size="sm" /> : deliveredOrders}</StatNumber>
            <StatHelpText><HStack><Icon as={FaEthereum} color="purple.400" /><Text>SDC Generated</Text></HStack></StatHelpText>
          </Stat></CardBody></Card>
          <Card><CardBody><Stat>
            <StatLabel>Avg Product Price</StatLabel>
            <StatNumber>${productsLoading ? '...' : avgPrice}</StatNumber>
            <StatHelpText><HStack><Icon as={FaDollarSign} /><Text>Per product</Text></HStack></StatHelpText>
          </Stat></CardBody></Card>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Card><CardBody>
            <Heading size="md" mb={4}>Recent Products</Heading>
            {productsLoading ? <Center py={4}><Spinner /></Center> : (
              products?.slice(0, 5).map((p) => (
                <HStack key={p._id} justify="space-between" py={2} borderBottomWidth="1px">
                  <Text noOfLines={1}>{p.title}</Text>
                  <Text fontWeight="bold" color="green.500">${p.price}</Text>
                </HStack>
              )) || <Text color="gray.500">No products</Text>
            )}
          </CardBody></Card>
          <Card><CardBody>
            <Heading size="md" mb={4}>Recent Orders</Heading>
            {ordersLoading ? <Center py={4}><Spinner /></Center> : (
              orders?.slice(0, 5).map((o) => (
                <HStack key={o._id} justify="space-between" py={2} borderBottomWidth="1px">
                  <Text fontSize="sm" fontFamily="mono">{o._id?.substring(0, 10)}...</Text>
                  <Text fontSize="sm" color={o.deliveryStatus === 'Delivered' ? 'green.500' : 'orange.400'}>
                    {o.deliveryStatus || 'Pending'}
                  </Text>
                </HStack>
              )) || <Text color="gray.500">No orders</Text>
            )}
          </CardBody></Card>
        </SimpleGrid>
      </Container>
    </Box>
  );
}

export default AdminHome;
