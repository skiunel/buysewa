import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Heading, VStack, HStack, Text, Button, Image,
  Divider, Input, FormControl, FormLabel, Alert, AlertIcon, useToast,
  Card, CardBody, SimpleGrid, Icon, useColorModeValue,
} from '@chakra-ui/react';
import { FaShoppingCart, FaTrash, FaMapMarkerAlt } from 'react-icons/fa';
import { useBasket } from '../../contexts/BasketContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { postOrder } from '../../api/index.js';

function Basket() {
  const { items, removeFromBasket, emptyBasket } = useBasket();
  const { loggedIn } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const cardBg = useColorModeValue('white', 'gray.700');

  const total = items.reduce((sum, item) => sum + (item.price || 0), 0);

  const handleOrder = async () => {
    if (!address.trim()) {
      toast({ title: 'Please enter a delivery address', status: 'warning', duration: 3000 });
      return;
    }
    setLoading(true);
    try {
      await postOrder({ address, items: items.map((i) => i._id) });
      emptyBasket();
      setOrdered(true);
      toast({ title: 'Order placed successfully!', description: 'Your order has been placed.', status: 'success', duration: 4000 });
    } catch (err) {
      toast({ title: 'Failed to place order', description: err.response?.data?.message || err.message, status: 'error', duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  if (!loggedIn) {
    return (
      <Container maxW="container.md" py={10}>
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          Please <Button variant="link" colorScheme="blue" onClick={() => navigate('/signin')} mx={1}>sign in</Button> to view your basket.
        </Alert>
      </Container>
    );
  }

  if (ordered) {
    return (
      <Container maxW="container.md" py={10}>
        <Card bg={cardBg} boxShadow="md">
          <CardBody textAlign="center" py={10}>
            <Heading size="lg" mb={4} color="green.500">Order Placed!</Heading>
            <Text mb={6}>Your order has been placed successfully. Once delivered, you'll receive a Standard Delivery Code (SDC) to submit a verified review.</Text>
            <HStack justify="center" spacing={4}>
              <Button colorScheme="blue" onClick={() => navigate('/')}>Continue Shopping</Button>
              <Button variant="outline" onClick={() => navigate('/profile')}>View Orders</Button>
            </HStack>
          </CardBody>
        </Card>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container maxW="container.md" py={10}>
        <Card bg={cardBg} boxShadow="md">
          <CardBody textAlign="center" py={10}>
            <Icon as={FaShoppingCart} boxSize={16} color="gray.300" mb={4} />
            <Heading size="lg" mb={4} color="gray.500">Your basket is empty</Heading>
            <Button colorScheme="blue" onClick={() => navigate('/')}>Shop Now</Button>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading size="lg" mb={6}>Your Basket</Heading>
      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
        {/* Items */}
        <Box gridColumn={{ lg: 'span 2' }}>
          <VStack spacing={4} align="stretch">
            {items.map((item) => (
              <Card key={item._id} bg={cardBg} boxShadow="sm">
                <CardBody>
                  <HStack spacing={4}>
                    <Image src={item.photos?.[0]} alt={item.title} boxSize="80px" objectFit="cover" borderRadius="md" bg="gray.100" />
                    <Box flex={1}>
                      <Text fontWeight="semibold">{item.title}</Text>
                      <Text color="green.500" fontWeight="bold">${item.price?.toFixed(2)}</Text>
                    </Box>
                    <Button size="sm" colorScheme="red" variant="ghost" onClick={() => removeFromBasket(item._id)}>
                      <FaTrash />
                    </Button>
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        </Box>

        {/* Order Summary */}
        <Box>
          <Card bg={cardBg} boxShadow="sm">
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Heading size="md">Order Summary</Heading>
                <Divider />
                <HStack justify="space-between">
                  <Text>Items ({items.length})</Text>
                  <Text fontWeight="bold">${total.toFixed(2)}</Text>
                </HStack>
                <Divider />
                <FormControl isRequired>
                  <FormLabel><HStack><Icon as={FaMapMarkerAlt} /><Text>Delivery Address</Text></HStack></FormLabel>
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your full address" />
                </FormControl>
                <Button colorScheme="blue" size="lg" onClick={handleOrder} isLoading={loading} loadingText="Placing Order...">
                  Place Order - ${total.toFixed(2)}
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </Box>
      </SimpleGrid>
    </Container>
  );
}

export default Basket;
