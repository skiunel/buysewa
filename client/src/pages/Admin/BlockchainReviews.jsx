import React, { useState } from 'react';
import {
  Box, Container, Heading, Text, Input, Button, VStack, HStack, Table,
  Thead, Tbody, Tr, Th, Td, Badge, Card, CardBody, Spinner, Alert,
  AlertIcon, Icon, Tooltip, useToast, useColorModeValue, Tabs, TabList,
  TabPanels, Tab, TabPanel,
} from '@chakra-ui/react';
import { FaEthereum, FaSearch, FaLink, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
import AdminNavigation from '../../components/AdminNavigation/index.jsx';

const BASE = process.env.REACT_APP_BASE_ENDPOINT || 'http://localhost:5000/api';

function BlockchainReviews() {
  const [productId, setProductId] = useState('');
  const [searchId, setSearchId] = useState('');
  const [bcReviews, setBcReviews] = useState([]);
  const [dbReviews, setDbReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const pageBg = useColorModeValue('gray.50', 'gray.800');

  const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('access-token')}` });

  const handleSearch = async () => {
    if (!productId) {
      toast({ title: 'Enter a Product ID', status: 'warning', duration: 3000 });
      return;
    }
    setLoading(true);
    setError('');
    try {
      const [bcRes, dbRes] = await Promise.allSettled([
        axios.get(`${BASE}/web3-review/product/${productId}`, { headers: getHeaders() }),
        axios.get(`${BASE}/review/admin/all`, { headers: getHeaders() }),
      ]);
      if (bcRes.status === 'fulfilled') setBcReviews(bcRes.value.data.data || []);
      else setBcReviews([]);
      if (dbRes.status === 'fulfilled') {
        const filtered = (dbRes.value.data || []).filter((r) => r.product?._id === productId || r.product === productId);
        setDbReviews(filtered);
      } else setDbReviews([]);
      setSearchId(productId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleString();

  return (
    <Box bg={pageBg} minH="100vh">
      <AdminNavigation />
      <Container maxW="container.xl" py={4}>
        <HStack mb={4}>
          <Icon as={FaEthereum} boxSize={8} color="blue.500" />
          <Heading size="lg">Blockchain-Verified Reviews</Heading>
        </HStack>
        <Text mb={6} color="gray.600">Search and verify reviews stored on Ethereum blockchain and IPFS.</Text>

        <Card mb={6}><CardBody>
          <HStack>
            <Input placeholder="Enter Product ID" value={productId} onChange={(e) => setProductId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()} />
            <Button leftIcon={<FaSearch />} colorScheme="blue" onClick={handleSearch} isLoading={loading}>Search</Button>
          </HStack>
        </CardBody></Card>

        {error && <Alert status="error" mb={4}><AlertIcon />{error}</Alert>}

        {loading && <VStack py={10}><Spinner size="xl" /><Text>Querying blockchain...</Text></VStack>}

        {!loading && searchId && (
          <Tabs variant="enclosed" colorScheme="blue">
            <TabList>
              <Tab>Blockchain ({bcReviews.length})</Tab>
              <Tab>Database ({dbReviews.length})</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {bcReviews.length === 0 ? (
                  <Alert status="info"><AlertIcon />No blockchain reviews found for this product.</Alert>
                ) : (
                  <Card><CardBody><Box overflowX="auto">
                    <Table variant="simple" size="sm">
                      <Thead><Tr><Th>User</Th><Th>Rating</Th><Th>Comment</Th><Th>IPFS Hash</Th><Th>Timestamp</Th></Tr></Thead>
                      <Tbody>
                        {bcReviews.map((r, i) => (
                          <Tr key={i}>
                            <Td fontSize="xs">{r.user_id}</Td>
                            <Td>{r.rating}/5</Td>
                            <Td><Text noOfLines={2} maxW="200px">{r.comment}</Text></Td>
                            <Td>
                              <Tooltip label="View on IPFS">
                                <Button as="a" href={`https://ipfs.io/ipfs/${r.ipfsHash}`} target="_blank"
                                  size="xs" leftIcon={<FaLink />} variant="outline">
                                  {r.ipfsHash?.substring(0, 10)}...
                                </Button>
                              </Tooltip>
                            </Td>
                            <Td fontSize="xs">{formatDate(r.timestamp)}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box></CardBody></Card>
                )}
              </TabPanel>
              <TabPanel>
                {dbReviews.length === 0 ? (
                  <Alert status="info"><AlertIcon />No database reviews found for this product.</Alert>
                ) : (
                  <Card><CardBody><Box overflowX="auto">
                    <Table variant="simple" size="sm">
                      <Thead><Tr><Th>User</Th><Th>Rating</Th><Th>Comment</Th><Th>Blockchain</Th><Th>IPFS Hash</Th><Th>Date</Th></Tr></Thead>
                      <Tbody>
                        {dbReviews.map((r, i) => (
                          <Tr key={i}>
                            <Td fontSize="xs">{r.user?.email || 'N/A'}</Td>
                            <Td>{r.rating}/5</Td>
                            <Td><Text noOfLines={2} maxW="200px">{r.comment}</Text></Td>
                            <Td><Badge colorScheme={r.blockchain_stored ? 'purple' : 'gray'}>{r.blockchain_stored ? 'Yes' : 'No'}</Badge></Td>
                            <Td fontSize="xs">{r.ipfs_hash ? `${r.ipfs_hash.substring(0, 10)}...` : 'N/A'}</Td>
                            <Td fontSize="xs">{formatDate(r.createdAt)}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box></CardBody></Card>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </Container>
    </Box>
  );
}

export default BlockchainReviews;
