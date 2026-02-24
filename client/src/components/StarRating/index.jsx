import React from 'react';
import { HStack, Icon, Text } from '@chakra-ui/react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating = 0, reviewCount = 0, showCount = true, size = 'md' }) => {
  const sizeMap = { sm: 3, md: 4, lg: 5 };
  const boxSize = sizeMap[size] || 4;

  const renderStars = () => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    for (let i = 0; i < full; i++) stars.push(<Icon key={`f${i}`} as={FaStar} color="yellow.400" boxSize={boxSize} />);
    if (half) stars.push(<Icon key="h" as={FaStarHalfAlt} color="yellow.400" boxSize={boxSize} />);
    for (let i = 0; i < empty; i++) stars.push(<Icon key={`e${i}`} as={FaRegStar} color="gray.300" boxSize={boxSize} />);

    return stars;
  };

  return (
    <HStack spacing={1} align="center">
      <HStack spacing={0.5}>{renderStars()}</HStack>
      {showCount && reviewCount > 0 && (
        <Text fontSize="sm" color="gray.500">({reviewCount})</Text>
      )}
    </HStack>
  );
};

export default StarRating;
