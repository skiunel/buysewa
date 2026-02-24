import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  Box, Container, Heading, Text, Image, Button, VStack, HStack, Divider,
  Spinner, Center, Badge, FormControl, FormLabel, Textarea, Select,
  useToast, Flex, SimpleGrid, Icon, Tag, TagLabel,
  useColorModeValue, Card, CardBody,
} from '@chakra-ui/react';
import { FaShoppingCart, FaEthereum, FaCheckCircle } from 'react-icons/fa';
import { fetchProduct, fetchReviews, submitReview, submitWeb3Review } from '../../api/index.js';
import { useBasket } from '../../contexts/BasketContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import StarRating from '../../components/StarRating/index.jsx';

function ProductDetail() {
  const { product_id } = useParams();
  const { addToBasket } = useBasket();
  const { loggedIn } = useAuth();
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.700');

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [useBlockchain] = useState(true);

  const { data: product, isLoading: productLoading } = useQuery(['product', product_id], () => fetchProduct(product_id));
  const { data: reviews, isLoading: reviewsLoading, refetch: refetchReviews } = useQuery(
    ['reviews', product_id], () => fetchReviews(product_id), { staleTime: 30000 }
  );

  const handleAddToBasket = () => {
    if (!loggedIn) {
      toast({ title: 'Login Required', description: 'Please login first', status: 'warning', duration: 3000 });
      return;
    }
    addToBasket(product);
    toast({ title: 'Added to Basket', status: 'success', duration: 2000 });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!loggedIn) {
      toast({ title: 'Login Required', description: 'Please login to submit a review', status: 'warning', duration: 3000 });
      return;
    }
    if (!comment.trim()) {
      toast({ title: 'Review content is required', status: 'error', duration: 3000 });
      return;
    }
    setSubmitting(true);
    try {
      if (useBlockchain) {
        await submitWeb3Review(product_id, { rating, comment });
      } else {
        await submitReview(product_id, { rating, comment });
      }
      toast({ title: 'Review submitted successfully!', description: useBlockchain ? 'Stored on blockchain' : 'Review saved', status: 'success', duration: 4000 });
      setComment('');
      setRating(5);
      refetchReviews();
    } catch (err) {
      toast({ title: 'Failed to submit review', description: err.response?.data?.message || err.message, status: 'error', duration: 5000 });
    } finally {
      setSubmitting(false);
    }
  };

  if (productLoading) return <Center py={20}><Spinner size="xl" color="blue.500" /></Center>;
  if (!product) return <Center py={20}><Text>Product not found</Text></Center>;

  return (
    <Container maxW="container.xl" py={8}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mb={10}>
        {/* Product Image */}
        <Box>
          <Image src={product.photos?.[0]} alt={product.title} borderRadius="lg" objectFit="cover"
            w="100%" h={{ base: '300px', md: '450px' }} bg="gray.100"
            fallback={<Center h="300px" bg="gray.100"><FaShoppingCart size={60} color="#CBD5E0" /></Center>} />
        </Box>

        {/* Product Info */}
        <VStack align="stretch" spacing={4}>
          <Heading size="xl">{product.title}</Heading>
          <HStack>
            <StarRating rating={product.overall_rating || 0} reviewCount={product.review_count || 0} size="md" />
            <Badge colorScheme={product.inStock ? 'green' : 'red'}>{product.inStock ? 'In Stock' : 'Out of Stock'}</Badge>
          </HStack>
          <Text fontSize="3xl" fontWeight="bold" color="green.500">${product.price?.toFixed(2)}</Text>
          <Text color="gray.600">{product.description || 'No description available.'}</Text>
          {product.category && <Tag colorScheme="blue" size="md" alignSelf="flex-start"><TagLabel>Category: {product.category}</TagLabel></Tag>}
          <Button colorScheme="blue" size="lg" leftIcon={<FaShoppingCart />} onClick={handleAddToBasket} isDisabled={!product.inStock}>
            Add to Basket
          </Button>
        </VStack>
      </SimpleGrid>

      <Divider mb={8} />

      {/* Reviews Section */}
      <Box>
        <Heading size="lg" mb={6}>Reviews</Heading>

        {/* Submit Review Form */}
        {loggedIn && (
          <Card bg={cardBg} mb={8} boxShadow="sm">
            <CardBody>
              <Heading size="md" mb={4}>Write a Review</Heading>
              <Box as="form" onSubmit={handleSubmitReview}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Rating</FormLabel>
                    <Select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                      <option value={5}>5 - Excellent</option>
                      <option value={4}>4 - Good</option>
                      <option value={3}>3 - Average</option>
                      <option value={2}>2 - Below Average</option>
                      <option value={1}>1 - Poor</option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Your Review</FormLabel>
                    <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience with this product..." rows={4} />
                  </FormControl>
                  <HStack w="100%" justify="space-between">
                    <HStack>
                      <Icon as={FaEthereum} color="purple.500" />
                      <Text fontSize="sm" color="gray.500">Blockchain verified</Text>
                    </HStack>
                    <Button type="submit" colorScheme="blue" isLoading={submitting} loadingText="Submitting...">
                      Submit Review
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            </CardBody>
          </Card>
        )}

        {/* Review List */}
        {reviewsLoading ? (
          <Center py={10}><Spinner /></Center>
        ) : reviews && reviews.length > 0 ? (
          <VStack spacing={4} align="stretch">
            {reviews.map((review) => (
              <Card key={review._id} bg={cardBg} boxShadow="sm">
                <CardBody>
                  <Flex justify="space-between" align="flex-start">
                    <VStack align="start" spacing={1}>
                      <HStack>
                        <StarRating rating={review.rating} showCount={false} size="sm" />
                        <Text fontSize="sm" color="gray.500">{review.user?.email || 'Anonymous'}</Text>
                        {review.blockchain_stored && (
                          <HStack spacing={1}>
                            <Icon as={FaEthereum} color="purple.500" boxSize={3} />
                            <Text fontSize="xs" color="purple.500">Blockchain Verified</Text>
                            <Icon as={FaCheckCircle} color="green.400" boxSize={3} />
                          </HStack>
                        )}
                      </HStack>
                      <Text>{review.comment}</Text>
                      {review.transaction_hash && (
                        <Text fontSize="xs" color="gray.400">TX: {review.transaction_hash?.substring(0, 20)}...</Text>
                      )}
                    </VStack>
                    <Text fontSize="xs" color="gray.400">{new Date(review.createdAt).toLocaleDateString()}</Text>
                  </Flex>
                </CardBody>
              </Card>
            ))}
          </VStack>
        ) : (
          <Center py={10}>
            <VStack>
              <Text color="gray.500">No reviews yet.</Text>
              {loggedIn && <Text fontSize="sm" color="gray.400">Be the first to review this product!</Text>}
            </VStack>
          </Center>
        )}
      </Box>
    </Container>
  );
}

export default ProductDetail;
