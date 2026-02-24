import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  Box, Container, Heading, Text, SimpleGrid, Card, CardBody, Image,
  Badge, Button, HStack, VStack, Spinner, Center, Alert, AlertIcon,
  Flex, Avatar, Tag, useColorModeValue, Divider, Icon,
} from '@chakra-ui/react';
import { FaStar, FaShoppingCart, FaArrowLeft, FaGlobe } from 'react-icons/fa';
import axios from 'axios';

const BASE = process.env.REACT_APP_BASE_ENDPOINT || 'http://localhost:5000/api';

const fetchStoreByDomain = async (domain) => {
  const { data } = await axios.get(`${BASE}/public/store/${domain}`);
  return data;
};

const fetchStoreProducts = async () => {
  const { data } = await axios.get(`${BASE}/product`);
  return data;
};

function ProductCard({ product }) {
  const cardBg = useColorModeValue('white', 'gray.700');
  return (
    <Card bg={cardBg} shadow="sm" _hover={{ shadow: 'md', transform: 'translateY(-2px)' }} transition="all 0.2s">
      <CardBody>
        {product.photos?.[0] ? (
          <Image
            src={product.photos[0]}
            alt={product.title}
            h="180px"
            w="full"
            objectFit="cover"
            borderRadius="md"
            mb={3}
            fallback={<Box h="180px" bg="gray.100" borderRadius="md" mb={3} display="flex" alignItems="center" justifyContent="center">
              <Text color="gray.400" fontSize="sm">No image</Text>
            </Box>}
          />
        ) : (
          <Box h="180px" bg="gray.100" borderRadius="md" mb={3} display="flex" alignItems="center" justifyContent="center">
            <Text color="gray.400" fontSize="sm">No image</Text>
          </Box>
        )}
        <VStack align="start" spacing={2}>
          <HStack justify="space-between" w="full">
            <Badge colorScheme="blue" fontSize="xs">{product.category || 'General'}</Badge>
            <HStack spacing={1}>
              <Icon as={FaStar} color="yellow.400" boxSize={3} />
              <Text fontSize="xs">{product.overall_rating?.toFixed(1) || '0.0'}</Text>
              <Text fontSize="xs" color="gray.400">({product.review_count || 0})</Text>
            </HStack>
          </HStack>
          <Text fontWeight="semibold" noOfLines={2} fontSize="sm">{product.title}</Text>
          <HStack justify="space-between" w="full">
            <Text fontWeight="bold" color="green.500" fontSize="lg">${product.price}</Text>
            <Badge colorScheme={product.inStock ? 'green' : 'red'} fontSize="xs">
              {product.inStock ? `${product.quantity} in stock` : 'Out of stock'}
            </Badge>
          </HStack>
          <Button
            as={Link}
            to={`/product/${product._id}`}
            size="sm"
            w="full"
            colorScheme="blue"
            leftIcon={<FaShoppingCart />}
            isDisabled={!product.inStock}
          >
            View Product
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
}

function StoreFront() {
  const { domain } = useParams();
  const pageBg = useColorModeValue('gray.50', 'gray.800');
  const headerBg = useColorModeValue('white', 'gray.900');

  const { data: store, isLoading: storeLoading, error: storeError } = useQuery(
    ['store', domain],
    () => fetchStoreByDomain(domain),
    { enabled: Boolean(domain) }
  );

  const { data: products, isLoading: productsLoading } = useQuery(
    'storefront:products',
    fetchStoreProducts
  );

  if (storeLoading) {
    return <Center minH="100vh"><Spinner size="xl" /></Center>;
  }

  if (storeError) {
    return (
      <Center minH="100vh" flexDirection="column" gap={4}>
        <Alert status="error" maxW="400px" borderRadius="md">
          <AlertIcon />
          Store not found: <strong>{domain}</strong>
        </Alert>
        <Button as={Link} to="/" leftIcon={<FaArrowLeft />}>Back to Main Store</Button>
      </Center>
    );
  }

  const primaryColor = store?.theme?.primaryColor || '#3182CE';
  const categories = [...new Set((products || []).map((p) => p.category).filter(Boolean))];

  return (
    <Box bg={pageBg} minH="100vh">
      {/* Store Header */}
      <Box bg={headerBg} shadow="sm" borderBottom="4px" borderColor={primaryColor}>
        <Container maxW="container.xl" py={4}>
          <HStack justify="space-between">
            <HStack spacing={4}>
              <Avatar
                size="lg"
                name={store?.name}
                src={store?.logo}
                bg={primaryColor}
              />
              <VStack align="start" spacing={0}>
                <Heading size="lg" color={primaryColor}>{store?.name}</Heading>
                {store?.description && (
                  <Text color="gray.500" fontSize="sm">{store.description}</Text>
                )}
                <HStack spacing={1} mt={1}>
                  <Icon as={FaGlobe} boxSize={3} color="gray.400" />
                  <Text fontSize="xs" color="gray.400">{store?.domain}</Text>
                </HStack>
              </VStack>
            </HStack>
            <HStack>
              <Button as={Link} to="/" variant="ghost" size="sm" leftIcon={<FaArrowLeft />}>
                All Stores
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        {/* Categories */}
        {categories.length > 0 && (
          <Box mb={6}>
            <HStack flexWrap="wrap" spacing={2}>
              <Tag size="md" colorScheme="blue" cursor="pointer">All</Tag>
              {categories.map((cat) => (
                <Tag key={cat} size="md" cursor="pointer" _hover={{ bg: `${primaryColor}22` }}>
                  {cat}
                </Tag>
              ))}
            </HStack>
          </Box>
        )}

        <HStack justify="space-between" mb={4}>
          <Text color="gray.500">
            {productsLoading ? '...' : `${products?.length || 0} products available`}
          </Text>
        </HStack>

        {productsLoading ? (
          <Center py={16}><Spinner size="xl" /></Center>
        ) : !products?.length ? (
          <Center py={16}>
            <VStack>
              <Text color="gray.400" fontSize="lg">No products yet</Text>
              <Text color="gray.400" fontSize="sm">Check back soon!</Text>
            </VStack>
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
}

export default StoreFront;
