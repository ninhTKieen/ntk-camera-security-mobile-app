import { Box, Input, Text, TextArea } from 'native-base';
import React from 'react';

type TCreateHomeFieldInputProps = {
  label: string;
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  isRequired?: boolean;
  isDescription?: boolean;
  errMessage?: string;
  isDisabled?: boolean;
  isEditable?: boolean;
};

export const CommonOutlineInput = ({
  label,
  value,
  placeholder,
  onChangeText,
  isRequired,
  isDescription,
  errMessage,
  isDisabled,
  isEditable,
}: TCreateHomeFieldInputProps) => {
  return (
    <Box p={1}>
      <Text color="primary.700" fontSize="md" fontWeight="semibold">
        {label} {isRequired && <Text color="red.700">*</Text>}
      </Text>
      {isDescription ? (
        <TextArea
          value={value}
          placeholder={placeholder}
          onChangeText={onChangeText}
          autoCompleteType={'off'}
          bg="gray.100"
          p={2}
          borderRadius={10}
          mt={2}
          h={24}
          isDisabled={isDisabled}
          editable={isEditable}
        />
      ) : (
        <Input
          value={value}
          placeholder={placeholder}
          onChangeText={onChangeText}
          bg="gray.100"
          p={2}
          borderRadius={10}
          mt={2}
          height={10}
          isDisabled={isDisabled}
          editable={isEditable}
        />
      )}
      {errMessage && (
        <Text mt={1} color="red.700" fontSize="sm">
          {errMessage}
        </Text>
      )}
    </Box>
  );
};
