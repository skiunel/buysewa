import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box, Container, Heading, Table, Thead, Tbody, Tr, Th, Td,
  Badge, Button, Spinner, Center, Text, HStack, useToast,
  useColorModeValue, Card, CardBody, Alert, AlertIcon,
} from '@chakra-ui/react';
import { fetchOrders, markOrderAsDelivered, deleteOrder } from '../../api/index.js';
import AdminNavigation from '../../components/AdminNavigation/index.jsx';

function Orders() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [processing, setProcessing] = useState(null);
  const pageBg = useColorModeValue('gray.50', 'gray.800');

  const { isLoading, isError, data, error } = useQuery('admin:orders', fetchOrders);

  const deliverMutation = useMutation((order_id) => markOrderAsDelivered(order_id), {
    onSuccess: () => {
      queryClient.invalidateQueries('admin:orders');
      toast({ title: 'Order marked as delivered! SDC generated.', status: 'success', duration: 3000 });
      setProcessing(null);
    },
    onError: (err) => {
      toast({ title: 'Error', description: err.response?.data?.message || err.message, status: 'error', duration: 3000 });
      setProcessing(null);
    },
  });

  const deleteMutation = useMutation((order_id) => deleteOrder(order_id), {
    onSuccess: () => {
      queryClient.invalidateQueries('admin:orders');
      toast({ title: 'Order deleted successfully', status: 'success', duration: 3000 });
    },
    onError: (err) => {
      toast({ title: 'Error deleting order', description: err.response?.data?.message || err.message, status: 'error', duration: 3000 });
    },
  });

  const handleDeliver = (order_id) => {
    setProcessing(order_id);
    deliverMutation.mutate(order_id);
  };

  if (isLoading) return <Box bg={pageBg} minH="100vh"><AdminNavigation /><Center py={20}><Spinner size="xl" /></Center></Box>;
  if (isError) return <Box bg={pageBg} minH="100vh"><AdminNavigation /><Container py={10}><Alert status="error"><AlertIcon />{error.message}</Alert></Container></Box>;

  return (
    <Box bg={pageBg} minH="100vh">
      <AdminNavigation />
      <Container maxW="container.xl" py={4}>
        <Heading size="lg" mb={6}>Order Management</Heading>
        <Card>
          <CardBody>
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>User</Th>
                    <Th>Address</Th>
                    <Th>Items</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.map((order) => {
                    const isDelivered = order.deliveryStatus === 'Delivered';
                    return (
                      <Tr key={order._id}>
                        <Td>{order.user?.email || 'N/A'}</Td>
                        <Td>{order.adress}</Td>
                        <Td>{order.items?.length || 0}</Td>
                        <Td>
                          <Badge colorScheme={isDelivered ? 'green' : 'yellow'}>
                            {isDelivered ? 'Delivered' : 'Pending'}
                          </Badge>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Button size="xs" colorScheme="green"
                              isLoading={processing === order._id}
                              isDisabled={isDelivered || processing !== null}
                              onClick={() => handleDeliver(order._id)}>
                              {isDelivered ? 'Delivered' : 'Mark Delivered'}
                            </Button>
                            <Button size="xs" colorScheme="red" variant="outline"
                              onClick={() => deleteMutation.mutate(order._id)}>
                              Delete
                            </Button>
                          </HStack>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
              {(!data || data.length === 0) && <Center py={8}><Text color="gray.500">No orders found</Text></Center>}
            </Box>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}

export default Orders;
