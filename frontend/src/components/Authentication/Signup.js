import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [show, setShow] = useState(false);
  const toast = useToast();

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setShow(!show);
  };

  const postImageOnCloudinary = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const formData = new FormData();
      formData.append("file", pics);
      formData.append("upload_preset", "MERN_CHAT_APP");
      formData.append("cloud_name", "dfyfgdpse");
      console.log("data ", formData);

      // fetch("https://api.cloudinary.com/v1_1/dfyfgdpse/image/upload", {
      //   method: "post",
      //   body: formData,
      // })
      axios
        .post("https://api.cloudinary.com/v1_1/dfyfgdpse/image/upload", formData)
        .then((res) => {
          // console.log(res.data)
          return res.data;
        })
        .then((data) => {
          setPic(data.url.toString());
          // console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          // console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Password don't match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    // console.log(name, email, password, pic);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      //   console.log(data);
      toast({
        title: "Registration successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px" color="black" gap="1rem">
      <FormControl id="first-name" isRequired>
        <FormLabel m="0">Name</FormLabel>
        <Input
          placeholder="Enter your name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel m="0">Email</FormLabel>
        <Input
          placeholder="Enter your email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel m="0">Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel m="0">Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) => {
              setConfirmpassword(e.target.value);
            }}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postImageOnCloudinary(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        marginTop="15px"
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
