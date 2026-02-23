import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, VStack, Heading, FormControl, FormLabel, Input, Button, Text,
  Alert, AlertIcon, Container, Card, CardBody, useColorModeValue,
} from '@chakra-ui/react';
import { fetchLogin } from '../../../api/index.js';
import { useAuth } from '../../../contexts/AuthContext.jsx';

function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.700');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await fetchLogin({ email, password });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="md" py={10}>
      <Card bg={cardBg} boxShadow="lg">
        <CardBody>
          <VStack spacing={6}>
            <Heading size="lg">Sign In</Heading>
            {error && <Alert status="error" borderRadius="md"><AlertIcon />{error}</Alert>}
            <Box as="form" onSubmit={handleSubmit} width="100%">
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                </FormControl>
                <Button type="submit" colorScheme="blue" width="100%" isLoading={loading}>Sign In</Button>
              </VStack>
            </Box>
            <Text>Don't have an account? <Link to="/signup"><Text as="span" color="blue.500">Sign Up</Text></Link></Text>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
}

export default Signin;
