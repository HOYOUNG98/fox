import axios from "axios";
import { Dispatch, FC } from "react";
import { Field, Form, Formik } from "formik";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftAddon,
  Button,
  Flex,
  Box,
} from "@chakra-ui/react";

import { guessResult } from "../types";

interface GuessFormProps {
  guesses: Array<guessResult>;
  setGuesses: Dispatch<React.SetStateAction<Array<guessResult>>>;
}

export const GuessForm: FC<GuessFormProps> = ({ guesses, setGuesses }) => {
  const validateName = (value: string) => {
    let re = /[0-9A-Fa-f]{6}/g;
    let error;
    if (!value) {
      error = "HexCode is required!";
    } else if (value.length != 6) {
      error = "Only 6 digit values are allowed!";
    } else if (!re.test(value)) {
      error = "Invalid HexCode!";
    }
    return error;
  };

  return (
    <Formik
      initialValues={{ guess: "" }}
      onSubmit={(values, actions) => {
        axios
          .get(
            `https://ofztj4z2s7.execute-api.us-east-1.amazonaws.com/dev/guess_color?guess=${values.guess}`
          )
          .then(function (response) {
            setGuesses([
              { guess: values.guess, response: response.data },
              ...guesses,
            ]);
          })
          .catch(function (error) {
            console.log(error);
          });
        actions.setSubmitting(false);
      }}
    >
      {(props) => (
        <Form>
          <Field name="guess" validate={validateName}>
            {({ field, form }: any) => (
              <FormControl isInvalid={form.errors.guess && form.touched.guess}>
                <FormLabel>Your Guess</FormLabel>
                <Flex>
                  <Box flexGrow={1}>
                    <InputGroup>
                      <InputLeftAddon children="#" />
                      <Input {...field} type="text" placeholder="guess" />
                    </InputGroup>
                    <FormErrorMessage>{form.errors.guess}</FormErrorMessage>
                  </Box>
                  <Button
                    w="100px"
                    colorScheme="gray"
                    isLoading={props.isSubmitting}
                    type="submit"
                  >
                    Submit
                  </Button>
                </Flex>
              </FormControl>
            )}
          </Field>
        </Form>
      )}
    </Formik>
  );
};
