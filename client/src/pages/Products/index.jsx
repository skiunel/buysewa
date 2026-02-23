import React from 'react';
import { useQuery } from 'react-query';
import { SimpleGrid, Container, Heading, Spinner, Center, Text, VStack, Box } from '@chakra-ui/react';
import { fetchProductList } from '../../api/index.js';
import Cards from '../../components/Card/index.jsx';

function Products() {
  const { isLoading, isError, data, error } = useQuery('products', fetchProductList);

  if (isLoading) return <Center py={20}><Spinner size="xl" color="blue.500" thickness="4px" /></Center>;
  if (isError) return <Center py={20}><Text color="red.500">Error: {error?.message}</Text></Center>;

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Products</Heading>
          <Text color="gray.500">Browse our collection of verified products with blockchain-backed reviews</Text>
        </Box>
        {data && data.length > 0 ? (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
            {data.map((item) => <Cards key={item._id} item={item} />)}
          </SimpleGrid>
        ) : (
          <Center py={20}>
            <VStack>
              <Text fontSize="xl" color="gray.500">No products found</Text>
              <Text color="gray.400">Products will appear here once added by admin</Text>
            </VStack>
          </Center>
        )}
      </VStack>
    </Container>
  );
}

export default Products;
