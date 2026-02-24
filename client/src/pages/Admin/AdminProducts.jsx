import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box, Container, Heading, Table, Thead, Tbody, Tr, Th, Td,
  Button, Image, Text, Spinner, Center, HStack, Badge, useToast,
  useColorModeValue, Card, CardBody,
} from '@chakra-ui/react';
import { fetchProductList, deleteProduct } from '../../api/index.js';
import AdminNavigation from '../../components/AdminNavigation/index.jsx';

function AdminProducts() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const pageBg = useColorModeValue('gray.50', 'gray.800');

  const { isLoading, data } = useQuery('admin:products', fetchProductList);

  const deleteMutation = useMutation((product_id) => deleteProduct(product_id), {
    onSuccess: () => {
      queryClient.invalidateQueries('admin:products');
      toast({ title: 'Product deleted', status: 'success', duration: 2000 });
    },
    onError: (err) => {
      toast({ title: 'Failed to delete', description: err.message, status: 'error', duration: 3000 });
    },
  });

  if (isLoading) return <Box bg={pageBg} minH="100vh"><AdminNavigation showAddButton /><Center py={20}><Spinner size="xl" /></Center></Box>;

  return (
    <Box bg={pageBg} minH="100vh">
      <AdminNavigation showAddButton />
      <Container maxW="container.xl" py={4}>
        <Heading size="lg" mb={6}>Products ({data?.length || 0})</Heading>
        <Card>
          <CardBody>
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr><Th>Image</Th><Th>Title</Th><Th>Price</Th><Th>Stock</Th><Th>Rating</Th><Th>Actions</Th></Tr>
                </Thead>
                <Tbody>
                  {data?.map((p) => (
                    <Tr key={p._id}>
                      <Td><Image src={p.photos?.[0]} boxSize="50px" objectFit="cover" borderRadius="md" bg="gray.100" /></Td>
                      <Td><Text noOfLines={1} maxW="200px">{p.title}</Text></Td>
                      <Td>${p.price}</Td>
                      <Td><Badge colorScheme={p.inStock ? 'green' : 'red'}>{p.inStock ? 'In Stock' : 'Out of Stock'}</Badge></Td>
                      <Td>{p.overall_rating ? p.overall_rating.toFixed(1) : 'N/A'} ({p.review_count || 0})</Td>
                      <Td>
                        <HStack spacing={2}>
                          <Link to={`/admin/products/${p._id}`}><Button size="xs" colorScheme="blue">Edit</Button></Link>
                          <Button size="xs" colorScheme="red" variant="outline" onClick={() => deleteMutation.mutate(p._id)}>Delete</Button>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              {(!data || data.length === 0) && <Center py={8}><Text color="gray.500">No products. <Link to="/admin/products/new"><Text as="span" color="blue.500">Add one</Text></Link></Text></Center>}
            </Box>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}

export default AdminProducts;
