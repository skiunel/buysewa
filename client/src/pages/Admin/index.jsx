import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import {
  fetchProductList, fetchOrders, fetchAnalyticsSummary, fetchMyStore,
  fetchSalesOverTime,
} from '../../api/index.js';
import AdminNavigation from '../../components/AdminNavigation/index.jsx';
import {
  Box, Container, Heading, SimpleGrid, Stat, StatLabel, StatNumber,
  StatHelpText, Card, CardBody, HStack, Icon, Text, useColorModeValue,
  Spinner, Center, Button, VStack, Badge, Progress, Divider,
} from '@chakra-ui/react';
import {
  FaBoxOpen, FaShoppingCart, FaDollarSign, FaEthereum, FaChartLine,
  FaStore, FaStar, FaArrowRight, FaUsers,
} from 'react-icons/fa';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

function QuickStatCard({ label, value, icon, color, to, helpText }) {
  const cardBg = useColorModeValue('white', 'gray.700');
  const iconBg = useColorModeValue(`${color}.50`, `${color}.900`);
  return (
    <Card bg={cardBg} shadow="sm" _hover={{ shadow: 'md' }} transition="all 0.2s">
      <CardBody>
        <HStack justify="space-between">
          <Stat>
            <StatLabel color="gray.500" fontSize="sm">{label}</StatLabel>
            <StatNumber fontSize="2xl">{value}</StatNumber>
            {helpText && <StatHelpText fontSize="xs">{helpText}</StatHelpText>}
          </Stat>
          <Box bg={iconBg} p={3} borderRadius="xl">
            <Icon as={icon} boxSize={6} color={`${color}.500`} />
          </Box>
        </HStack>
        {to && (
          <Button as={Link} to={to} size="xs" variant="link" colorScheme={color} rightIcon={<FaArrowRight />} mt={2}>
            View details
          </Button>
        )}
      </CardBody>
    </Card>
  );
}

function AdminHome() {
  const pageBg = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');

  const { data: summary, isLoading: summaryLoading } = useQuery('analytics:summary', fetchAnalyticsSummary);
  const { data: products, isLoading: productsLoading } = useQuery('admin:products', fetchProductList);
  const { data: orders, isLoading: ordersLoading } = useQuery('admin:orders', fetchOrders);
  const { data: myStore } = useQuery('myStore', fetchMyStore, { onError: () => {} });
  const { data: salesData } = useQuery(['analytics:sales', 14], () => fetchSalesOverTime(14));

  const deliveredOrders = orders?.filter((o) => o.deliveryStatus === 'Delivered').length || 0;
  const pendingOrders = (orders?.length || 0) - deliveredOrders;
  const deliveryRate = orders?.length ? ((deliveredOrders / orders.length) * 100).toFixed(0) : 0;

  const formatDate = (d) => {
    const date = new Date(d);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <Box bg={pageBg} minH="100vh">
      <AdminNavigation showAddButton />
      <Container maxW="container.xl" py={4}>

        {/* Store Banner */}
        {myStore && (
          <Card bg="blue.500" color="white" mb={6} shadow="md">
            <CardBody>
              <HStack justify="space-between">
                <HStack>
                  <Icon as={FaStore} boxSize={6} />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" fontSize="lg">{myStore.name}</Text>
                    <Text fontSize="sm" opacity={0.85}>Domain: {myStore.domain}</Text>
                  </VStack>
                </HStack>
                <Button as={Link} to="/admin/stores" size="sm" variant="outline" color="white" borderColor="whiteAlpha.600" _hover={{ bg: 'whiteAlpha.200' }}>
                  Manage Store
                </Button>
              </HStack>
            </CardBody>
          </Card>
        )}

        <Heading size="lg" mb={6}>Dashboard Overview</Heading>

        {/* Main Stats */}
        {summaryLoading ? (
          <Center py={8}><Spinner size="xl" /></Center>
        ) : (
          <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4} mb={8}>
            <QuickStatCard label="Total Revenue" value={`$${(summary?.totalRevenue || 0).toFixed(0)}`} icon={FaDollarSign} color="green" to="/admin/analytics" />
            <QuickStatCard label="Monthly Revenue" value={`$${(summary?.monthlyRevenue || 0).toFixed(0)}`} icon={FaDollarSign} color="teal" helpText="Last 30 days" />
            <QuickStatCard label="Total Orders" value={summary?.totalOrders || 0} icon={FaShoppingCart} color="blue" to="/admin/orders" />
            <QuickStatCard label="Products" value={summary?.totalProducts || 0} icon={FaBoxOpen} color="purple" to="/admin/products" />
            <QuickStatCard label="Customers" value={summary?.totalUsers || 0} icon={FaUsers} color="orange" />
            <QuickStatCard label="Reviews" value={summary?.totalReviews || 0} icon={FaStar} color="yellow" to="/admin/reviews" />
          </SimpleGrid>
        )}

        {/* Mini Charts + Quick Lists */}
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6} mb={6}>

          {/* Sales Sparkline */}
          <Card bg={cardBg} shadow="sm" gridColumn={{ lg: 'span 2' }}>
            <CardBody>
              <HStack justify="space-between" mb={4}>
                <Heading size="sm">Sales (Last 14 days)</Heading>
                <Button as={Link} to="/admin/analytics" size="xs" colorScheme="blue" variant="outline" rightIcon={<FaChartLine />}>
                  Full Analytics
                </Button>
              </HStack>
              {salesData ? (
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(v, n) => [n === 'revenue' ? `$${v.toFixed(2)}` : v, n]} />
                    <Line type="monotone" dataKey="orders" stroke="#4299E1" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Center h="150px"><Spinner /></Center>
              )}
            </CardBody>
          </Card>

          {/* Delivery Rate */}
          <Card bg={cardBg} shadow="sm">
            <CardBody>
              <Heading size="sm" mb={4}>Order Status</Heading>
              {ordersLoading ? (
                <Center py={4}><Spinner /></Center>
              ) : (
                <VStack spacing={4}>
                  <Box w="full">
                    <HStack justify="space-between" mb={1}>
                      <Text fontSize="sm">Delivered</Text>
                      <Text fontWeight="bold" color="green.500">{deliveredOrders}</Text>
                    </HStack>
                    <Progress value={deliveryRate} colorScheme="green" borderRadius="full" size="sm" />
                  </Box>
                  <Box w="full">
                    <HStack justify="space-between" mb={1}>
                      <Text fontSize="sm">Pending</Text>
                      <Text fontWeight="bold" color="orange.400">{pendingOrders}</Text>
                    </HStack>
                    <Progress value={100 - deliveryRate} colorScheme="orange" borderRadius="full" size="sm" />
                  </Box>
                  <Divider />
                  <HStack justify="space-between" w="full">
                    <Text fontSize="sm" color="gray.500">Delivery Rate</Text>
                    <Badge colorScheme={deliveryRate >= 70 ? 'green' : 'orange'} fontSize="md">{deliveryRate}%</Badge>
                  </HStack>
                </VStack>
              )}
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Recent Products & Orders */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Card bg={cardBg} shadow="sm">
            <CardBody>
              <HStack justify="space-between" mb={4}>
                <Heading size="sm">Recent Products</Heading>
                <Button as={Link} to="/admin/products" size="xs" variant="ghost" colorScheme="blue">View all</Button>
              </HStack>
              {productsLoading ? (
                <Center py={4}><Spinner /></Center>
              ) : (
                products?.slice(0, 5).map((p) => (
                  <HStack key={p._id} justify="space-between" py={2} borderBottomWidth="1px">
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" noOfLines={1} fontWeight="medium">{p.title}</Text>
                      <Text fontSize="xs" color="gray.500">{p.category || 'Uncategorized'}</Text>
                    </VStack>
                    <HStack>
                      <Badge colorScheme={p.inStock ? 'green' : 'red'} fontSize="xs">{p.inStock ? 'In Stock' : 'Out'}</Badge>
                      <Text fontWeight="bold" color="green.500" fontSize="sm">${p.price}</Text>
                    </HStack>
                  </HStack>
                )) || <Text color="gray.500">No products</Text>
              )}
            </CardBody>
          </Card>

          <Card bg={cardBg} shadow="sm">
            <CardBody>
              <HStack justify="space-between" mb={4}>
                <Heading size="sm">Recent Orders</Heading>
                <Button as={Link} to="/admin/orders" size="xs" variant="ghost" colorScheme="blue">View all</Button>
              </HStack>
              {ordersLoading ? (
                <Center py={4}><Spinner /></Center>
              ) : (
                orders?.slice(0, 5).map((o) => (
                  <HStack key={o._id} justify="space-between" py={2} borderBottomWidth="1px">
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontFamily="mono">{o._id?.substring(0, 12)}...</Text>
                      <Text fontSize="xs" color="gray.500" noOfLines={1}>{o.adress}</Text>
                    </VStack>
                    <Badge
                      colorScheme={o.deliveryStatus === 'Delivered' ? 'green' : 'orange'}
                      fontSize="xs"
                    >
                      {o.deliveryStatus || 'Pending'}
                    </Badge>
                  </HStack>
                )) || <Text color="gray.500">No orders</Text>
              )}
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Quick Links */}
        <Card bg={cardBg} shadow="sm" mt={6}>
          <CardBody>
            <Heading size="sm" mb={4}>Quick Navigation</Heading>
            <SimpleGrid columns={{ base: 2, md: 4, lg: 7 }} spacing={3}>
              {[
                { to: '/admin/analytics', label: 'Analytics', icon: FaChartLine, color: 'green' },
                { to: '/admin/stores', label: 'Stores', icon: FaStore, color: 'blue' },
                { to: '/admin/products', label: 'Products', icon: FaBoxOpen, color: 'purple' },
                { to: '/admin/orders', label: 'Orders', icon: FaShoppingCart, color: 'orange' },
                { to: '/admin/reviews', label: 'Reviews', icon: FaStar, color: 'yellow' },
                { to: '/admin/blockchain', label: 'Blockchain', icon: FaEthereum, color: 'teal' },
                { to: '/', label: 'Storefront', icon: FaStore, color: 'gray' },
              ].map((item) => (
                <Button
                  key={item.to}
                  as={Link}
                  to={item.to}
                  leftIcon={<item.icon />}
                  colorScheme={item.color}
                  variant="outline"
                  size="sm"
                >
                  {item.label}
                </Button>
              ))}
            </SimpleGrid>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}

export default AdminHome;
