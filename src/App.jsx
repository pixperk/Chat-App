import { Box, Container, VStack, Button, Input, HStack, Avatar, Text } from "@chakra-ui/react";
import Message from "./components/Message";
import { onAuthStateChanged, signOut, getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "./firebase";
import { useEffect, useRef, useState } from "react";
import { getFirestore, addDoc, collection, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";
import { IoIosSend } from "react-icons/io";
import { AiOutlineLogout } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";



const auth = getAuth(app);
const db = getFirestore(app);

const loginHandler = () => {
  const googleProvider = new GoogleAuthProvider();
  signInWithPopup(auth, googleProvider);
};

const App = () => {
  const [user, setUser] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const divForScroll = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onAuthStateChanged(auth, (data) => {
      setUser(data);
    });
    const unsubscribeForMessage = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((doc) => {
          const id = doc.id;
          const data = doc.data();
          return { id, ...data };
        })
      );
    });
    return () => {
      unsubscribe();
      unsubscribeForMessage();
    };
  }, []);

  const logoutHandler = () => {
    signOut(auth);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "Messages"), {
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp(),
      });
      setMessage("");
      divForScroll.current.scrollIntoView({behavior: "smooth" });
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Box bgGradient="linear(to-r, teal.500, teal.200)">
      {user ? (
        <Container h="100vh" bg="white" boxShadow="lg" borderRadius="xl" p={4}>
          <VStack h="full" spacing={4} align="stretch">
            <HStack w="full" justifyContent="space-between" mb={4}>
              <Text fontSize="2xl" fontWeight="bold">Chat Room</Text>
              <Button onClick={logoutHandler} colorScheme="red">
              <AiOutlineLogout size={20} />

              </Button>
            </HStack>

            <VStack h="full" spacing={4} overflowY="auto" css={{ "&::-webkit-scrollbar": { display: "none" } }}>
              {messages.map((message) => (
                <Message
                  key={message.id}
                  user={message.uid === user.uid ? "me" : "other"}
                  text={message.text}
                  uri={message.uri}
                  createdAt={message.createdAt}
                />
              ))}
              <div ref={divForScroll}></div>
            </VStack>

            <form onSubmit={submitHandler} style={{ width: "100%" }}>
              <HStack>
                <Input
                  placeholder="Enter a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  borderRadius="xl"
                />
                <Button type="submit" colorScheme="purple" borderRadius="xl">
                <IoIosSend />
                </Button>
              </HStack>
            </form>
          </VStack>
        </Container>
      ) : (
        <Container h="100vh" bg="teal.500" display="flex" justifyContent="center" alignItems="center">
          <VStack spacing={4} align="center">
            <Text fontSize="3xl" fontWeight="bold" color="white">Welcome to Chat Room</Text>
            <Text fontSize="lg" color="white">Sign in to join the conversation!</Text>
            <Button onClick={loginHandler} colorScheme="whiteAlpha" variant="outline" size="lg" px={8} py={4} borderRadius="full" borderWidth={2} borderColor="white" color="white" _hover={{ bg: "white", color: "teal.500" }}>
  <HStack spacing={2}>
    <FcGoogle size={24} />
    <Text fontSize="lg">Sign In with Google</Text>
  </HStack>
</Button>
          </VStack>
        </Container>
      )}
    </Box>
  );
};

export default App;
