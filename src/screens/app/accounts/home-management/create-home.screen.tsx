import { useNavigation } from '@react-navigation/native';
import SubLayout from '@src/components/sub-layout';
import { i18nKeys } from '@src/configs/i18n';
import { TCreateEstate } from '@src/features/estates/estate.model';
import estateService from '@src/features/estates/estate.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Button, ScrollView } from 'native-base';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { CreateHomeFieldInput } from './components/create-home-field-input';
import { EstateTypeSelect } from './components/estate-type-select';

const CreateHomeScreen = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { watch, setValue, handleSubmit } = useForm<TCreateEstate>();

  const createHomeMutation = useMutation({
    mutationFn: (data: TCreateEstate) => estateService.create(data),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['estates/getEstates'],
      });
      navigation.goBack();
    },
    onError: () => {},
  });

  const onSubmit = useCallback(
    (data: TCreateEstate) => {
      createHomeMutation.mutate(data);
    },
    [createHomeMutation],
  );

  return (
    <SubLayout title={t(i18nKeys.account.homeManagement.create)}>
      <ScrollView showsVerticalScrollIndicator={false} flex={1} bg="white">
        <Box m={4} p={2} shadow={2} borderRadius={15} bg="white">
          <CreateHomeFieldInput
            label={t(i18nKeys.estates.name)}
            placeholder={t(i18nKeys.estates.namePlaceholder)}
            isRequired
            value={watch('name')}
            onChangeText={(text) => setValue('name', text)}
          />

          <CreateHomeFieldInput
            label={t(i18nKeys.estates.description)}
            placeholder={t(i18nKeys.estates.descriptionPlaceholder)}
            isDescription
            value={watch('description')}
            onChangeText={(text) => setValue('description', text)}
          />

          <CreateHomeFieldInput
            label={t(i18nKeys.estates.address)}
            placeholder={t(i18nKeys.estates.addressPlaceholder)}
            value={watch('address')}
            onChangeText={(text) => setValue('address', text)}
          />

          <EstateTypeSelect
            label={t(i18nKeys.estates.type.title)}
            value={watch('type')}
            onChange={(value) => setValue('type', value)}
            isRequired
          />
        </Box>

        <Button
          style={{ marginTop: 'auto' }}
          m={4}
          onPress={handleSubmit(onSubmit)}
        >
          {t(i18nKeys.common.save)}
        </Button>
      </ScrollView>
    </SubLayout>
  );
};

export default CreateHomeScreen;
