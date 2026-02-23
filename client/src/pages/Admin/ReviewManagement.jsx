import React, { useState, useEffect } from 'react';
import {
  Box, Container, Heading, Table, Thead, Tbody, Tr, Th, Td,
  Badge, Button, Text, Spinner, Center, HStack, Icon, useToast,
  useColorModeValue, Card, CardBody, Tag, TagLabel, TagLeftIcon,
  SimpleGrid, Stat, StatLabel, StatNumber,
} from '@chakra-ui/react';
import { FaEthereum, FaStar, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import AdminNavigation from '../../components/AdminNavigation/index.jsx';

const BASE = process.env.REACT_APP_BASE_ENDPOINT || 'http://localhost:5000/api';

function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const pageBg = useColorModeValue('gray.50', 'gray.800');

  const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('access-token')}` });

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE}/review/admin/all`, { headers: getHeaders() });
      setReviews(data);
    } catch (err) {
      toast({ title: 'Error loading reviews', description: err.response?.data?.message || err.message, status: 'error', duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (review) => {
    try {
      await axios.delete(`${BASE}/review/${review._id}`, { headers: getHeaders() });
      toast({ title: review.blockchain_stored ? 'Blockchain review hidden' : 'Review deleted', status: 'success', duration: 3000 });
      fetchReviews();
    } catch (err) {
      toast({ title: 'Error', description: err.response?.data?.message || err.message, status: 'error', duration: 3000 });
    }
  };

  const handleToggleVisibility = async (review) => {
    try {
      await axios.put(`${BASE}/review/${review._id}`, { hidden: !review.hidden }, { headers: getHeaders() });
      toast({ title: `Review ${review.hidden ? 'shown' : 'hidden'}`, status: 'success', duration: 2000 });
      fetchReviews();
    } catch (err) {
      toast({ title: 'Error updating visibility', description: err.response?.data?.message || err.message, status: 'error', duration: 3000 });
    }
  };

  const blockchainCount = reviews.filter((r) => r.blockchain_stored).length;
  const visibleCount = reviews.filter((r) => !r.hidden).length;

  if (loading) return <Box bg={pageBg} minH="100vh"><AdminNavigation /><Center py={20}><Spinner size="xl" /></Center></Box>;

  return (
    <Box bg={pageBg} minH="100vh">
      <AdminNavigation />
      <Container maxW="container.xl" py={4}>
        <Heading size="lg" mb={6}>Review Management</Heading>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
          <Card><CardBody><Stat><StatLabel>Total Reviews</StatLabel><StatNumber>{reviews.length}</StatNumber></Stat></CardBody></Card>
          <Card><CardBody><Stat><StatLabel>Blockchain Verified</StatLabel><StatNumber>{blockchainCount}</StatNumber></Stat></CardBody></Card>
          <Card><CardBody><Stat><StatLabel>Visible</StatLabel><StatNumber>{visibleCount}</StatNumber></Stat></CardBody></Card>
        </SimpleGrid>

        <Card>
          <CardBody>
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr><Th>User</Th><Th>Product</Th><Th>Rating</Th><Th>Comment</Th><Th>Type</Th><Th>Status</Th><Th>Actions</Th></Tr>
                </Thead>
                <Tbody>
                  {reviews.map((r) => (
                    <Tr key={r._id}>
                      <Td fontSize="xs">{r.user?.email || 'Anonymous'}</Td>
                      <Td><Text noOfLines={1} maxW="120px">{r.product?.title || 'N/A'}</Text></Td>
                      <Td><HStack spacing={1}>{Array(5).fill(0).map((_, i) => <Icon key={i} as={FaStar} color={i < r.rating ? 'yellow.400' : 'gray.300'} boxSize={3} />)}</HStack></Td>
                      <Td><Text noOfLines={2} maxW="200px">{r.comment}</Text></Td>
                      <Td>
                        {r.blockchain_stored ? (
                          <Tag colorScheme="purple" size="sm"><TagLeftIcon as={FaEthereum} /><TagLabel>Blockchain</TagLabel></Tag>
                        ) : <Tag size="sm" colorScheme="gray"><TagLabel>Standard</TagLabel></Tag>}
                      </Td>
                      <Td>
                        <Badge colorScheme={r.hidden ? 'red' : 'green'}>{r.hidden ? 'Hidden' : 'Visible'}</Badge>
                      </Td>
                      <Td>
                        <HStack spacing={1}>
                          <Button size="xs" colorScheme={r.hidden ? 'green' : 'gray'} variant="outline"
                            leftIcon={r.hidden ? <FaEye /> : <FaEyeSlash />}
                            onClick={() => handleToggleVisibility(r)}>
                            {r.hidden ? 'Show' : 'Hide'}
                          </Button>
                          <Button size="xs" colorScheme="red" leftIcon={<FaTrash />} onClick={() => handleDelete(r)}>
                            {r.blockchain_stored ? 'Hide' : 'Del'}
                          </Button>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              {reviews.length === 0 && <Center py={8}><Text color="gray.500">No reviews found</Text></Center>}
            </Box>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}

export default ReviewManagement;
