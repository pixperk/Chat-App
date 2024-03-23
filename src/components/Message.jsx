import React from 'react';
import { HStack, Avatar, Text, Box } from "@chakra-ui/react";

const Message = ({ text, uri, user = "other", createdAt }) => {
  const getMessageTime = (timestamp) => {
    if (!timestamp) return ""; // Check if timestamp is null or undefined

    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <HStack
      alignSelf={user === "me" ? "flex-end" : "flex-start"}
      paddingX={user === "me" ? "4" : "2"}
      paddingY={2}
      borderRadius="base"
    >
      {user === "other" && <Avatar src={uri} />}
      <Box>
        <Text p="2" borderRadius="lg" bg={user === "me" ? "blue.100" : "green.100"}>{text}</Text>
        <Box textAlign={user === "me" ? "left" : "right"}>
          <Text fontSize="xs" color="gray.500">{getMessageTime(createdAt)}</Text>
        </Box>
      </Box>
      {user === "me" && <Avatar src={uri} />}
    </HStack>
  );
};

export default Message;
