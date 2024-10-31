import IconGeneral from '@src/components/icon-general';
import { ESTATE_MAP } from '@src/configs/constant';
import { EEstateType } from '@src/features/estates/estate.model';
import { Box, Select, Text } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';

type TCreateHomeFieldInputProps = {
  label: string;
  value: EEstateType;
  onChange: (value: EEstateType) => void;
  isRequired?: boolean;
};

export const EstateTypeSelect = ({
  label,
  value,
  onChange,
  isRequired,
}: TCreateHomeFieldInputProps) => {
  const { t } = useTranslation();

  return (
    <Box p={1}>
      <Text color="primary.700" fontSize="md" fontWeight="semibold">
        {label} {isRequired && <Text color="red.700">*</Text>}
      </Text>
      <Select
        selectedValue={value}
        minWidth="200"
        accessibilityLabel="Choose Service"
        placeholder="Choose Service"
        _item={{
          borderRadius: 'xl',
        }}
        _selectedItem={{
          bg: 'primary.700',
          _text: {
            color: 'white',
          },
          borderRadius: 'xl',
        }}
        mt={1}
        height="10"
        borderRadius="xl"
        dropdownIcon={
          <IconGeneral
            type="MaterialCommunityIcons"
            name="chevron-down"
            size={24}
            color="primary.700"
            style={{ marginHorizontal: 12 }}
          />
        }
        onValueChange={(itemValue) => onChange(itemValue as EEstateType)}
      >
        {Array.from(ESTATE_MAP).map((estate, index) => (
          <Select.Item
            key={index}
            label={t(estate[1] || '')}
            value={estate[0]}
          />
        ))}
      </Select>
    </Box>
  );
};
