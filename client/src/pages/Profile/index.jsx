import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, VStack, Heading, Text, Avatar, Box, Card, CardBody,
  Divider, Badge, Table, Thead, Tbody, Tr, Th, Td, Spinner, Center,
  HStack, useColorModeValue, Alert, AlertIcon,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { fetchUserOrders, fetchUserDeliveries } from '../../api/index.js';

function Profile() {
  const { user, loggedIn } = useAuth();
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.700');

  const { data: orders, isLoading: ordersLoading } = useQuery('userOrders', fetchUserOrders, { enabled: loggedIn });
  const { data: deliveries, isLoading: deliveriesLoading } = useQuery('userDeliveries', fetchUserDeliveries, { enabled: loggedIn });

  if (!loggedIn) return (
    <Container maxW="container.md" py={10}>
      <Alert status="warning"><AlertIcon />Please sign in to view your profile.</Alert>
    </Container>
  );

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Profile Header */}
        <Card bg={cardBg} boxShadow="sm">
          <CardBody>
            <HStack spacing={4}>
              <Avatar size="xl" name={user?.email} bg="blue.500" />
              <Box>
                <Heading size="md">{user?.email}</Heading>
                <Badge colorScheme={user?.role === 'admin' ? 'red' : 'green'} mt={1}>
                  {user?.role?.toUpperCase()}
                </Badge>
              </Box>
            </HStack>
          </CardBody>
        </Card>

        {/* Orders */}
        <Card bg={cardBg} boxShadow="sm">
          <CardBody>
            <Heading size="md" mb={4}>My Orders</Heading>
            {ordersLoading ? <Center py={6}><Spinner /></Center> : (
              orders && orders.length > 0 ? (
                <Box overflowX="auto">
                  <Table variant="simple" size="sm">
                    <Thead><Tr><Th>Order ID</Th><Th>Items</Th><Th>Address</Th><Th>Status</Th></Tr></Thead>
                    <Tbody>
                      {orders.map((order) => (
                        <Tr key={order._id}>
                          <Td fontFamily="mono" fontSize="xs">{order._id?.substring(0, 8)}...</Td>
                          <Td>{order.items?.length || 0} items</Td>
                          <Td>{order.adress}</Td>
                          <Td><Badge colorScheme={order.deliveryStatus === 'Delivered' ? 'green' : 'yellow'}>{order.deliveryStatus || 'Pending'}</Badge></Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              ) : <Text color="gray.500">No orders yet.</Text>
            )}
          </CardBody>
        </Card>

        {/* Deliveries & SDC */}
        <Card bg={cardBg} boxShadow="sm">
          <CardBody>
            <Heading size="md" mb={2}>Delivery Codes (SDC)</Heading>
            <Text fontSize="sm" color="gray.500" mb={4}>Use these codes to submit verified reviews</Text>
            {deliveriesLoading ? <Center py={6}><Spinner /></Center> : (
              deliveries && deliveries.length > 0 ? (
                <Box overflowX="auto">
                  <Table variant="simple" size="sm">
                    <Thead><Tr><Th>Product</Th><Th>Status</Th><Th>SDC Code</Th></Tr></Thead>
                    <Tbody>
                      {deliveries.map((d) => (
                        <Tr key={d._id}>
                          <Td>{d.product?.title || 'Product'}</Td>
                          <Td><Badge colorScheme={d.delivery_status === 'Delivered' ? 'green' : 'gray'}>{d.delivery_status}</Badge></Td>
                          <Td><Text fontFamily="mono" fontWeight="bold" color="blue.600">{d.standard_delivery_code || '-'}</Text></Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              ) : <Text color="gray.500">No deliveries yet.</Text>
            )}
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}

export default Profile;
