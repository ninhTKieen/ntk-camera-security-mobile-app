import { useNavigation } from '@react-navigation/native';
import SubLayout from '@src/components/sub-layout';
import { i18nKeys } from '@src/configs/i18n';
import { useAppStore } from '@src/features/common/app.store';
import { TCreateEstate } from '@src/features/estates/estate.model';
import estateService from '@src/features/estates/estate.service';
import { useApp } from '@src/hooks/use-app.hook';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Button, ScrollView } from 'native-base';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ChooseHomeImage } from './components/choose-home-image';
import { CreateHomeFieldInput } from './components/create-home-field-input';
import { EstateTypeSelect } from './components/estate-type-select';

const CreateHomeScreen = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { setLoading } = useAppStore();
  const { toastMessage } = useApp();

  const { watch, setValue, handleSubmit } = useForm<TCreateEstate>();

  const createHomeMutation = useMutation({
    mutationFn: (data: TCreateEstate) => {
      setLoading(true);
      return estateService.create(data);
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['estates/getEstates'],
      });
      navigation.goBack();
      setLoading(false);
      toastMessage({
        type: 'success',
        title: t(i18nKeys.common.success),
        description: t(i18nKeys.estates.createHomeSuccess),
      });
    },
    onError: () => {
      setLoading(false);
      toastMessage({
        type: 'error',
        title: t(i18nKeys.common.error),
        description: t(i18nKeys.estates.createHomeError),
      });
    },
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
        <ChooseHomeImage
          image={watch('imageUrls')?.[0]}
          setValues={(values) => setValue('imageUrls', [values])}
        />
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
