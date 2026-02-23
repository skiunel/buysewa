import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box, Container, Heading, VStack, FormControl, FormLabel, Input,
  Textarea, Button, Text, Spinner, Center, useToast, HStack,
  useColorModeValue, Card, CardBody,
} from '@chakra-ui/react';
import { fetchProduct, updateProduct, postProduct } from '../../api/index.js';
import AdminNavigation from '../../components/AdminNavigation/index.jsx';

function AdminProductDetail() {
  const { product_id } = useParams();
  const isNew = product_id === 'new';
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const pageBg = useColorModeValue('gray.50', 'gray.800');

  const [form, setForm] = React.useState({ title: '', description: '', price: '', photos: [''], category: '' });

  const { isLoading } = useQuery(['product', product_id], () => fetchProduct(product_id), {
    enabled: !isNew,
    onSuccess: (data) => setForm({
      title: data.title || '',
      description: data.description || '',
      price: data.price || '',
      photos: data.photos?.length ? data.photos : [''],
      category: data.category || '',
    }),
  });

  const saveMutation = useMutation(
    (data) => isNew ? postProduct(data) : updateProduct({ input: data, product_id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin:products');
        toast({ title: isNew ? 'Product created!' : 'Product updated!', status: 'success', duration: 3000 });
        if (isNew) navigate('/admin/products');
      },
      onError: (err) => {
        toast({ title: 'Error', description: err.response?.data?.message || err.message, status: 'error', duration: 3000 });
      },
    }
  );

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePhotoChange = (i, val) => {
    const photos = [...form.photos];
    photos[i] = val;
    setForm({ ...form, photos });
  };
  const addPhoto = () => setForm({ ...form, photos: [...form.photos, ''] });
  const removePhoto = (i) => setForm({ ...form, photos: form.photos.filter((_, idx) => idx !== i) });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title) { toast({ title: 'Product name is required', status: 'error' }); return; }
    if (!form.price) { toast({ title: 'Price is required', status: 'error' }); return; }
    saveMutation.mutate({ ...form, price: Number(form.price) });
  };

  if (!isNew && isLoading) return <Box bg={pageBg} minH="100vh"><AdminNavigation /><Center py={20}><Spinner size="xl" /></Center></Box>;

  return (
    <Box bg={pageBg} minH="100vh">
      <AdminNavigation />
      <Container maxW="container.md" py={4}>
        <HStack mb={4} justify="space-between">
          <Heading size="lg">{isNew ? 'Add Product' : 'Edit Product'}</Heading>
          <Link to="/admin/products"><Button variant="outline" size="sm">Back</Button></Link>
        </HStack>
        <Card>
          <CardBody>
            <Box as="form" onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input name="title" value={form.title} onChange={handleChange} placeholder="Product name" />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea name="description" value={form.description} onChange={handleChange} rows={4} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Price ($)</FormLabel>
                  <Input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <Input name="category" value={form.category} onChange={handleChange} placeholder="e.g., Electronics" />
                </FormControl>
                <FormControl>
                  <FormLabel>Photo URLs</FormLabel>
                  <VStack spacing={2} align="stretch">
                    {form.photos.map((photo, i) => (
                      <HStack key={i}>
                        <Input value={photo} onChange={(e) => handlePhotoChange(i, e.target.value)} placeholder="https://..." />
                        {form.photos.length > 1 && <Button size="sm" colorScheme="red" onClick={() => removePhoto(i)}>Remove</Button>}
                      </HStack>
                    ))}
                    <Button size="sm" variant="outline" onClick={addPhoto}>+ Add Photo URL</Button>
                  </VStack>
                </FormControl>
                <HStack w="100%" justify="flex-end">
                  <Button type="submit" colorScheme="blue" isLoading={saveMutation.isLoading}>
                    {isNew ? 'Add Product' : 'Save Changes'}
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}

export default AdminProductDetail;
