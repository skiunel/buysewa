import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Box, Container, Heading, SimpleGrid, Card, CardBody, CardHeader,
  Select, HStack, Text, Stat, StatLabel, StatNumber, StatHelpText,
  StatArrow, Badge, Table, Thead, Tbody, Tr, Th, Td, Spinner, Center,
  useColorModeValue, Icon, Flex, VStack,
} from '@chakra-ui/react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { FaDollarSign, FaShoppingCart, FaBoxOpen, FaStar, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import {
  fetchAnalyticsSummary, fetchSalesOverTime, fetchRevenueByCategory,
  fetchOrderStatus, fetchTopProducts,
} from '../../api/index.js';
import AdminNavigation from '../../components/AdminNavigation/index.jsx';

const COLORS = ['#4299E1', '#48BB78', '#ECC94B', '#F56565', '#805AD5', '#ED8936', '#38B2AC', '#FC8181'];

const StatCard = ({ label, value, icon, helpText, change, colorScheme = 'blue' }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const iconBg = useColorModeValue(`${colorScheme}.50`, `${colorScheme}.900`);
  return (
    <Card bg={cardBg} shadow="sm">
      <CardBody>
        <HStack justify="space-between">
          <Stat>
            <StatLabel color="gray.500" fontSize="sm">{label}</StatLabel>
            <StatNumber fontSize="2xl">{value}</StatNumber>
            {helpText && (
              <StatHelpText>
                {change !== undefined && <StatArrow type={change >= 0 ? 'increase' : 'decrease'} />}
                {helpText}
              </StatHelpText>
            )}
          </Stat>
          <Box bg={iconBg} p={3} borderRadius="xl">
            <Icon as={icon} boxSize={6} color={`${colorScheme}.500`} />
          </Box>
        </HStack>
      </CardBody>
    </Card>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box bg="white" p={3} borderRadius="md" shadow="lg" border="1px" borderColor="gray.200">
        <Text fontWeight="bold" mb={1}>{label}</Text>
        {payload.map((p, i) => (
          <Text key={i} color={p.color} fontSize="sm">
            {p.name}: {p.name === 'revenue' || p.name === 'Revenue' ? `$${p.value.toFixed(2)}` : p.value}
          </Text>
        ))}
      </Box>
    );
  }
  return null;
};

function SalesAnalytics() {
  const [days, setDays] = useState(30);
  const pageBg = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');

  const { data: summary, isLoading: summaryLoading } = useQuery(
    ['analytics:summary'], fetchAnalyticsSummary, { refetchInterval: 60000 }
  );
  const { data: salesData, isLoading: salesLoading } = useQuery(
    ['analytics:sales', days], () => fetchSalesOverTime(days), { refetchInterval: 60000 }
  );
  const { data: categoryData, isLoading: catLoading } = useQuery(
    ['analytics:category'], fetchRevenueByCategory, { refetchInterval: 60000 }
  );
  const { data: statusData, isLoading: statusLoading } = useQuery(
    ['analytics:status'], fetchOrderStatus, { refetchInterval: 60000 }
  );
  const { data: topProducts, isLoading: topLoading } = useQuery(
    ['analytics:top'], () => fetchTopProducts(8), { refetchInterval: 60000 }
  );

  const formatDate = (d) => {
    const date = new Date(d);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const formatCurrency = (v) => `$${(v || 0).toFixed(2)}`;

  return (
    <Box bg={pageBg} minH="100vh">
      <AdminNavigation />
      <Container maxW="container.xl" py={6}>
        <HStack justify="space-between" mb={6}>
          <VStack align="start" spacing={0}>
            <Heading size="lg">Sales Analytics</Heading>
            <Text color="gray.500" fontSize="sm">Real-time store performance overview</Text>
          </VStack>
          <Badge colorScheme="green" p={2} borderRadius="md">Live</Badge>
        </HStack>

        {/* Summary Stats */}
        {summaryLoading ? (
          <Center py={8}><Spinner size="xl" /></Center>
        ) : (
          <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4} mb={8}>
            <StatCard
              label="Total Revenue"
              value={`$${(summary?.totalRevenue || 0).toFixed(0)}`}
              icon={FaDollarSign}
              helpText={`$${(summary?.monthlyRevenue || 0).toFixed(0)} this month`}
              colorScheme="green"
            />
            <StatCard
              label="Total Orders"
              value={summary?.totalOrders || 0}
              icon={FaShoppingCart}
              helpText={`${summary?.monthlyOrders || 0} this month`}
              colorScheme="blue"
            />
            <StatCard
              label="Products"
              value={summary?.totalProducts || 0}
              icon={FaBoxOpen}
              helpText="In catalog"
              colorScheme="purple"
            />
            <StatCard
              label="Customers"
              value={summary?.totalUsers || 0}
              icon={FaBoxOpen}
              helpText="Registered users"
              colorScheme="orange"
            />
            <StatCard
              label="Reviews"
              value={summary?.totalReviews || 0}
              icon={FaStar}
              helpText="Total reviews"
              colorScheme="yellow"
            />
            <StatCard
              label="Monthly Revenue"
              value={`$${(summary?.monthlyRevenue || 0).toFixed(0)}`}
              icon={FaDollarSign}
              helpText="Last 30 days"
              colorScheme="teal"
            />
          </SimpleGrid>
        )}

        {/* Sales Over Time + Order Status */}
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6} mb={6}>
          <Card bg={cardBg} shadow="sm" gridColumn={{ lg: 'span 2' }}>
            <CardHeader pb={0}>
              <HStack justify="space-between">
                <Heading size="md">Sales Over Time</Heading>
                <Select
                  size="sm"
                  width="120px"
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value))}
                >
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                  <option value={90}>90 days</option>
                </Select>
              </HStack>
            </CardHeader>
            <CardBody>
              {salesLoading ? (
                <Center h="250px"><Spinner /></Center>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={salesData || []} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#4299E1" strokeWidth={2} dot={false} name="orders" />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#48BB78" strokeWidth={2} dot={false} name="revenue" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardBody>
          </Card>

          <Card bg={cardBg} shadow="sm">
            <CardHeader pb={0}>
              <Heading size="md">Order Status</Heading>
            </CardHeader>
            <CardBody>
              {statusLoading ? (
                <Center h="250px"><Spinner /></Center>
              ) : (
                <Box>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={statusData || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {(statusData || []).map((entry, index) => (
                          <Cell key={index} fill={entry.color || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <VStack spacing={1} mt={2}>
                    {(statusData || []).map((s, i) => (
                      <HStack key={i} justify="space-between" w="full">
                        <HStack>
                          <Box w={3} h={3} bg={s.color || COLORS[i]} borderRadius="sm" />
                          <Text fontSize="sm">{s.name}</Text>
                        </HStack>
                        <Text fontWeight="bold" fontSize="sm">{s.value}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              )}
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Revenue by Category + Top Products */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
          <Card bg={cardBg} shadow="sm">
            <CardHeader pb={0}>
              <Heading size="md">Revenue by Category</Heading>
            </CardHeader>
            <CardBody>
              {catLoading ? (
                <Center h="250px"><Spinner /></Center>
              ) : !categoryData?.length ? (
                <Center h="200px">
                  <Text color="gray.400">No category data yet</Text>
                </Center>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={categoryData || []} margin={{ top: 5, right: 10, left: 0, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="category" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" interval={0} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                    <Tooltip formatter={(v) => [`$${v.toFixed(2)}`, 'Revenue']} />
                    <Bar dataKey="revenue" name="Revenue" radius={[4, 4, 0, 0]}>
                      {(categoryData || []).map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardBody>
          </Card>

          <Card bg={cardBg} shadow="sm">
            <CardHeader pb={0}>
              <Heading size="md">Top Products</Heading>
            </CardHeader>
            <CardBody>
              {topLoading ? (
                <Center h="250px"><Spinner /></Center>
              ) : !topProducts?.length ? (
                <Center h="200px">
                  <Text color="gray.400">No sales data yet</Text>
                </Center>
              ) : (
                <Box overflowX="auto">
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>#</Th>
                        <Th>Product</Th>
                        <Th isNumeric>Sales</Th>
                        <Th isNumeric>Revenue</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {topProducts.map((p, i) => (
                        <Tr key={p.id}>
                          <Td>
                            <Badge colorScheme={i === 0 ? 'yellow' : i === 1 ? 'gray' : i === 2 ? 'orange' : 'blue'}>
                              #{i + 1}
                            </Badge>
                          </Td>
                          <Td>
                            <VStack align="start" spacing={0}>
                              <Text fontSize="sm" fontWeight="medium" noOfLines={1}>{p.title}</Text>
                              <Text fontSize="xs" color="gray.500">{p.category}</Text>
                            </VStack>
                          </Td>
                          <Td isNumeric fontWeight="bold">{p.sales}</Td>
                          <Td isNumeric color="green.500">${p.revenue.toFixed(2)}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Revenue Over Time Bar Chart */}
        <Card bg={cardBg} shadow="sm">
          <CardHeader pb={0}>
            <Heading size="md">Daily Revenue Bar Chart</Heading>
          </CardHeader>
          <CardBody>
            {salesLoading ? (
              <Center h="250px"><Spinner /></Center>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesData || []} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(v) => [`$${v.toFixed(2)}`, 'Revenue']} />
                  <Bar dataKey="revenue" name="Revenue" fill="#4299E1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}

export default SalesAnalytics;
