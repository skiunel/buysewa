import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box, Container, Heading, Text, Button, Input, VStack, HStack, Card, CardBody, CardHeader,
  SimpleGrid, Badge, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  ModalCloseButton, FormControl, FormLabel, useDisclosure, useToast, Spinner, Center,
  Table, Thead, Tbody, Tr, Th, Td, IconButton, Divider, Alert, AlertIcon,
  Tabs, TabList, TabPanels, Tab, TabPanel, useColorModeValue, Flex, Avatar,
} from '@chakra-ui/react';
import { FaPlus, FaEdit, FaTrash, FaUserPlus, FaGlobe, FaStore } from 'react-icons/fa';
import {
  fetchStores, fetchMyStore, createStore, updateStore, deleteStore, assignStoreAdmin,
} from '../../api/index.js';
import AdminNavigation from '../../components/AdminNavigation/index.jsx';

function StoreCard({ store, onEdit, onDelete, onAssign, isOwn }) {
  const cardBg = useColorModeValue('white', 'gray.700');
  return (
    <Card bg={cardBg} shadow="sm" position="relative" overflow="hidden">
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="4px"
        bg={store.theme?.primaryColor || 'blue.500'}
      />
      <CardBody pt={6}>
        <HStack justify="space-between" mb={3}>
          <HStack>
            <Avatar
              size="md"
              name={store.name}
              src={store.logo}
              bg={store.theme?.primaryColor || 'blue.500'}
            />
            <VStack align="start" spacing={0}>
              <HStack>
                <Text fontWeight="bold">{store.name}</Text>
                {isOwn && <Badge colorScheme="green" fontSize="xs">Your Store</Badge>}
                <Badge colorScheme={store.isActive ? 'green' : 'red'} fontSize="xs">
                  {store.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </HStack>
              <HStack spacing={1}>
                <FaGlobe size={10} color="gray" />
                <Text fontSize="xs" color="gray.500">{store.domain}</Text>
              </HStack>
            </VStack>
          </HStack>
          <HStack>
            <IconButton icon={<FaEdit />} size="sm" variant="ghost" onClick={() => onEdit(store)} />
            <IconButton icon={<FaUserPlus />} size="sm" variant="ghost" colorScheme="blue" onClick={() => onAssign(store)} />
            <IconButton icon={<FaTrash />} size="sm" variant="ghost" colorScheme="red" onClick={() => onDelete(store)} />
          </HStack>
        </HStack>
        {store.description && (
          <Text fontSize="sm" color="gray.500" noOfLines={2} mb={2}>{store.description}</Text>
        )}
        <Divider mb={2} />
        <HStack justify="space-between">
          <Text fontSize="xs" color="gray.500">
            Owner: {store.owner?.email || 'Unknown'}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {new Date(store.createdAt).toLocaleDateString()}
          </Text>
        </HStack>
      </CardBody>
    </Card>
  );
}

function CreateStoreModal({ isOpen, onClose, editStore }) {
  const qc = useQueryClient();
  const toast = useToast();
  const isEdit = Boolean(editStore);

  const [form, setForm] = useState({
    name: editStore?.name || '',
    domain: editStore?.domain || '',
    description: editStore?.description || '',
    logo: editStore?.logo || '',
    adminEmail: '',
    primaryColor: editStore?.theme?.primaryColor || '#3182CE',
    secondaryColor: editStore?.theme?.secondaryColor || '#805AD5',
  });

  React.useEffect(() => {
    if (editStore) {
      setForm({
        name: editStore.name,
        domain: editStore.domain,
        description: editStore.description || '',
        logo: editStore.logo || '',
        adminEmail: '',
        primaryColor: editStore.theme?.primaryColor || '#3182CE',
        secondaryColor: editStore.theme?.secondaryColor || '#805AD5',
      });
    }
  }, [editStore]);

  const createMutation = useMutation(createStore, {
    onSuccess: () => {
      qc.invalidateQueries('stores');
      toast({ title: 'Store created!', status: 'success', duration: 3000 });
      onClose();
    },
    onError: (e) => toast({ title: e.response?.data?.message || e.message, status: 'error', duration: 4000 }),
  });

  const updateMutation = useMutation(
    (data) => updateStore({ store_id: editStore._id, input: data }),
    {
      onSuccess: () => {
        qc.invalidateQueries('stores');
        toast({ title: 'Store updated!', status: 'success', duration: 3000 });
        onClose();
      },
      onError: (e) => toast({ title: e.response?.data?.message || e.message, status: 'error', duration: 4000 }),
    }
  );

  const handleSubmit = () => {
    const payload = {
      name: form.name,
      domain: form.domain,
      description: form.description,
      logo: form.logo,
      adminEmail: form.adminEmail,
      theme: { primaryColor: form.primaryColor, secondaryColor: form.secondaryColor },
    };
    if (isEdit) updateMutation.mutate(payload);
    else createMutation.mutate(payload);
  };

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEdit ? 'Edit Store' : 'Create New Store'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Store Name</FormLabel>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="My Electronics Store" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Domain / Slug</FormLabel>
              <Input value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value.toLowerCase().replace(/\s/g, '-') })}
                placeholder="my-electronics" isReadOnly={isEdit} />
              <Text fontSize="xs" color="gray.500" mt={1}>
                Access via: buysewa.com/store/{form.domain || '...'}
              </Text>
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Store description" />
            </FormControl>
            <FormControl>
              <FormLabel>Logo URL</FormLabel>
              <Input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} placeholder="https://example.com/logo.png" />
            </FormControl>
            {!isEdit && (
              <FormControl>
                <FormLabel>Assign Admin Email</FormLabel>
                <Input value={form.adminEmail} onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
                  placeholder="admin@example.com" type="email" />
                <Text fontSize="xs" color="gray.500" mt={1}>Existing user to assign as store admin</Text>
              </FormControl>
            )}
            <SimpleGrid columns={2} spacing={4} w="full">
              <FormControl>
                <FormLabel>Primary Color</FormLabel>
                <HStack>
                  <Input type="color" value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} w="50px" p={1} h="40px" />
                  <Input value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} />
                </HStack>
              </FormControl>
              <FormControl>
                <FormLabel>Secondary Color</FormLabel>
                <HStack>
                  <Input type="color" value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} w="50px" p={1} h="40px" />
                  <Input value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} />
                </HStack>
              </FormControl>
            </SimpleGrid>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
          <Button colorScheme="blue" onClick={handleSubmit} isLoading={isLoading}>
            {isEdit ? 'Update' : 'Create Store'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function AssignAdminModal({ isOpen, onClose, store }) {
  const toast = useToast();
  const [email, setEmail] = useState('');

  const mutation = useMutation(
    () => assignStoreAdmin({ store_id: store?._id, email }),
    {
      onSuccess: (data) => {
        toast({ title: data.message, status: 'success', duration: 3000 });
        onClose();
        setEmail('');
      },
      onError: (e) => toast({ title: e.response?.data?.message || e.message, status: 'error', duration: 4000 }),
    }
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Assign Admin to {store?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Alert status="info" mb={4} borderRadius="md">
            <AlertIcon />
            The user must already have an account. They will be assigned as admin of this store.
          </Alert>
          <FormControl>
            <FormLabel>Admin Email</FormLabel>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@store.com" type="email" />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
          <Button colorScheme="blue" onClick={() => mutation.mutate()} isLoading={mutation.isLoading}>Assign Admin</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function StoreManagement() {
  const pageBg = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const qc = useQueryClient();
  const toast = useToast();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isAssignOpen, onOpen: onAssignOpen, onClose: onAssignClose } = useDisclosure();
  const [editStore, setEditStore] = useState(null);
  const [assignStore, setAssignStore] = useState(null);

  const { data: stores, isLoading } = useQuery('stores', fetchStores);
  const { data: myStore } = useQuery('myStore', fetchMyStore, {
    onError: () => {},
  });

  const deleteMutation = useMutation(deleteStore, {
    onSuccess: () => {
      qc.invalidateQueries('stores');
      toast({ title: 'Store deleted', status: 'success', duration: 3000 });
    },
    onError: (e) => toast({ title: e.response?.data?.message || e.message, status: 'error', duration: 4000 }),
  });

  const handleEdit = (store) => {
    setEditStore(store);
    onCreateOpen();
  };

  const handleAssign = (store) => {
    setAssignStore(store);
    onAssignOpen();
  };

  const handleDelete = (store) => {
    if (window.confirm(`Delete "${store.name}"? This will unlink all products and admins.`)) {
      deleteMutation.mutate(store._id);
    }
  };

  const handleCloseCreate = () => {
    setEditStore(null);
    onCreateClose();
  };

  return (
    <Box bg={pageBg} minH="100vh">
      <AdminNavigation />
      <Container maxW="container.xl" py={6}>
        <HStack justify="space-between" mb={6}>
          <VStack align="start" spacing={0}>
            <HStack>
              <FaStore size={20} />
              <Heading size="lg">Store Management</Heading>
            </HStack>
            <Text color="gray.500" fontSize="sm">Manage multiple stores with separate domains and admins</Text>
          </VStack>
          <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={() => { setEditStore(null); onCreateOpen(); }}>
            Create Store
          </Button>
        </HStack>

        {/* My Store Banner */}
        {myStore && (
          <Card bg={cardBg} shadow="md" mb={6} borderLeft="4px" borderColor={myStore.theme?.primaryColor || 'blue.500'}>
            <CardBody>
              <HStack>
                <Avatar size="lg" name={myStore.name} src={myStore.logo} bg={myStore.theme?.primaryColor || 'blue.500'} />
                <VStack align="start" spacing={1}>
                  <HStack>
                    <Heading size="md">{myStore.name}</Heading>
                    <Badge colorScheme="blue">Your Store</Badge>
                  </HStack>
                  <HStack>
                    <FaGlobe size={12} />
                    <Text fontSize="sm" color="gray.500">Domain: {myStore.domain}</Text>
                  </HStack>
                  {myStore.description && <Text fontSize="sm">{myStore.description}</Text>}
                </VStack>
              </HStack>
            </CardBody>
          </Card>
        )}

        <Tabs variant="enclosed" colorScheme="blue">
          <TabList>
            <Tab>All Stores ({stores?.length || 0})</Tab>
            <Tab>How It Works</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0}>
              {isLoading ? (
                <Center py={12}><Spinner size="xl" /></Center>
              ) : !stores?.length ? (
                <Card bg={cardBg}>
                  <CardBody>
                    <Center py={12} flexDirection="column" gap={4}>
                      <FaStore size={40} color="gray" />
                      <Text color="gray.500">No stores yet. Create your first store!</Text>
                      <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={onCreateOpen}>Create Store</Button>
                    </Center>
                  </CardBody>
                </Card>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
                  {stores.map((store) => (
                    <StoreCard
                      key={store._id}
                      store={store}
                      isOwn={myStore?._id === store._id}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onAssign={handleAssign}
                    />
                  ))}
                </SimpleGrid>
              )}
            </TabPanel>
            <TabPanel>
              <Card bg={cardBg}>
                <CardBody>
                  <VStack align="start" spacing={4}>
                    <Heading size="md">Multi-Domain Store System</Heading>
                    <Text color="gray.600">
                      BuySewa supports multiple independent stores, each with their own domain, admin,
                      products, and analytics. Here's how it works:
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
                      {[
                        { title: '1. Create a Store', desc: 'Superadmin creates a new store with a unique domain slug. Each store gets its own URL: buysewa.com/store/[domain]' },
                        { title: '2. Assign an Admin', desc: 'Assign an existing user as the store admin. That admin can only manage their store\'s products, orders, and analytics.' },
                        { title: '3. Separate Analytics', desc: 'Each store has isolated analytics - sales charts, revenue, top products, and order status are all per-store.' },
                      ].map((item) => (
                        <Card key={item.title} variant="outline">
                          <CardBody>
                            <Text fontWeight="bold" mb={2}>{item.title}</Text>
                            <Text fontSize="sm" color="gray.500">{item.desc}</Text>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                    <Divider />
                    <Heading size="sm">Store URL Format</Heading>
                    <Box bg="gray.100" p={4} borderRadius="md" fontFamily="mono" w="full">
                      <Text>https://buysewa.com/store/<strong>electronics</strong></Text>
                      <Text>https://buysewa.com/store/<strong>fashion</strong></Text>
                      <Text>https://buysewa.com/store/<strong>grocery</strong></Text>
                    </Box>
                    <Heading size="sm">Admin Access</Heading>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Role</Th>
                          <Th>Access</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td><Badge colorScheme="red">Superadmin</Badge></Td>
                          <Td>Create/delete stores, view all analytics, manage all products</Td>
                        </Tr>
                        <Tr>
                          <Td><Badge colorScheme="blue">Store Admin</Badge></Td>
                          <Td>Manage own store's products, orders, analytics, reviews</Td>
                        </Tr>
                        <Tr>
                          <Td><Badge colorScheme="green">User</Badge></Td>
                          <Td>Browse products, place orders, leave reviews</Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <CreateStoreModal isOpen={isCreateOpen} onClose={handleCloseCreate} editStore={editStore} />
        <AssignAdminModal isOpen={isAssignOpen} onClose={onAssignClose} store={assignStore} />
      </Container>
    </Box>
  );
}

export default StoreManagement;
