import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Image, Text, Button, Flex, Badge, HStack, VStack, Icon,
  useColorModeValue, useToast, AspectRatio, Center, Spinner, Tag, TagLabel, TagLeftIcon,
} from '@chakra-ui/react';
import { FaShoppingCart, FaStar, FaBox, FaTruck } from 'react-icons/fa';
import { useBasket } from '../../contexts/BasketContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

function Cards({ item }) {
  const { addToBasket } = useBasket();
  const { loggedIn } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const handleAddToBasket = async () => {
    if (!loggedIn) {
      toast({ title: 'Login Required', description: 'Please login to add items to your basket', status: 'warning', duration: 3000, isClosable: true });
      return;
    }
    setIsLoading(true);
    addToBasket(item);
    toast({ title: 'Added to Basket', description: `${item.title} added to basket`, status: 'success', duration: 2000, isClosable: true });
    setIsLoading(false);
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg={cardBg} boxShadow="sm"
      transition="all 0.3s" _hover={{ transform: 'translateY(-4px)', boxShadow: 'md', borderColor: 'blue.400' }}>
      <Link to={`/product/${item._id}`}>
        <AspectRatio ratio={1}>
          <Image src={item.photos?.[0]} alt={item.title} objectFit="cover"
            fallback={<Center h="100%" bg="gray.100"><FaBox size={40} color="#CBD5E0" /></Center>} />
        </AspectRatio>
      </Link>

      <Box p={4}>
        <Link to={`/product/${item._id}`}>
          <Text fontSize="md" fontWeight="semibold" noOfLines={2} mb={2} _hover={{ color: 'blue.500' }}>
            {item.title}
          </Text>
        </Link>

        <Flex align="center" mb={2}>
          <Text fontSize="xl" fontWeight="bold" color="green.500" mr={2}>
            ${item.price?.toFixed(2)}
          </Text>
        </Flex>

        <HStack spacing={1} mb={2}>
          <Icon as={FaStar} color="yellow.400" />
          <Text fontSize="sm" color={textColor}>
            {item.overall_rating ? item.overall_rating.toFixed(1) : 'No ratings'}
          </Text>
          <Text fontSize="xs" color="gray.400">({item.review_count || 0})</Text>
        </HStack>

        <HStack spacing={2} mb={3} flexWrap="wrap">
          {item.category && (
            <Tag size="sm" colorScheme="blue" variant="subtle">
              <TagLeftIcon as={FaBox} />
              <TagLabel>{item.category}</TagLabel>
            </Tag>
          )}
          <Tag size="sm" colorScheme={item.inStock ? 'green' : 'red'} variant="subtle">
            <TagLeftIcon as={FaTruck} />
            <TagLabel>{item.inStock ? 'In Stock' : 'Out of Stock'}</TagLabel>
          </Tag>
        </HStack>

        <Button colorScheme="blue" width="100%" leftIcon={<FaShoppingCart />}
          onClick={handleAddToBasket} isLoading={isLoading} isDisabled={!item.inStock}>
          {item.inStock ? 'Add to Basket' : 'Out of Stock'}
        </Button>
      </Box>
    </Box>
  );
}

export default Cards;
