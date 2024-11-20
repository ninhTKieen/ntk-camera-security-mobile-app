import { yupResolver } from '@hookform/resolvers/yup';
import { CommonOutlineInput } from '@src/components/common-outline-input';
import { i18nKeys } from '@src/configs/i18n';
import { EEstateRole, TInviteMember } from '@src/features/estates/estate.model';
import estateService from '@src/features/estates/estate.service';
import { useApp } from '@src/hooks/use-app.hook';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Button, Radio, Stack, Text } from 'native-base';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import * as yup from 'yup';

type TAddMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  estateId: number;
};

const AddMemberModal = ({
  isOpen,
  onClose,
  estateId,
}: TAddMemberModalProps) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { toastMessage } = useApp();

  const schema = useMemo(
    () =>
      yup.object().shape({
        username: yup.string().required(t(i18nKeys.validation.required)),
        role: yup
          .string()
          .oneOf(Object.values(EEstateRole))
          .required(t(i18nKeys.validation.required)),
        nickname: yup.string().optional(),
      }),
    [t],
  );

  const { mutate: inviteMember } = useMutation({
    mutationFn: (data: TInviteMember) =>
      estateService.inviteMember(data, estateId),
    onSuccess: () => {
      toastMessage({
        type: 'success',
        title: t(i18nKeys.common.success),
        description: t(i18nKeys.estates.inviteMemberSuccess),
      });
      onClose();
      queryClient.invalidateQueries({
        queryKey: ['estates/getEstate', { estateId }],
      });
    },
    onError: (error: any) => {
      const status = error.response?.status;
      toastMessage({
        type: 'error',
        title: t(i18nKeys.common.error),
        description:
          status === 404
            ? t(i18nKeys.estates.userNotFound)
            : t(i18nKeys.estates.inviteMemberError),
      });
      onClose();
    },
  });

  const { watch, setValue, handleSubmit, reset } = useForm<TInviteMember>({
    resolver: yupResolver(schema),
    defaultValues: {
      role: EEstateRole.ADMIN,
    },
  });

  const onSubmit = (data: TInviteMember) => {
    inviteMember(data);
  };

  return (
    <Modal
      isVisible={isOpen}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      swipeDirection={['down', 'up', 'left', 'right']}
      onSwipeComplete={onClose}
      style={{}}
      onModalHide={() => {
        reset();
      }}
    >
      <Box bg="white" p={2} width="5/6" alignSelf="center" borderRadius="2xl">
        <Text fontSize="16" fontWeight="bold" textAlign="center" py={2}>
          {t(i18nKeys.estates.addMember)}
        </Text>

        <CommonOutlineInput
          label={t(i18nKeys.estates.username)}
          placeholder={t(i18nKeys.estates.username)}
          onChangeText={(text) =>
            setValue('username', text, { shouldValidate: true })
          }
        />

        <Box p={1}>
          <Text color="primary.700" fontSize="md" fontWeight="semibold" mb={2}>
            {t(i18nKeys.estates.role)}
          </Text>

          <Radio.Group
            defaultValue={EEstateRole.ADMIN}
            value={watch('role')}
            onChange={(value) => {
              setValue('role', value as EEstateRole, { shouldValidate: true });
            }}
            name="role"
          >
            <Stack space={3}>
              <Radio value={EEstateRole.ADMIN}>
                {t(i18nKeys.estates.admin)}
              </Radio>
              <Radio value={EEstateRole.NORMAL_USER}>
                {t(i18nKeys.estates.normalUser)}
              </Radio>
            </Stack>
          </Radio.Group>
        </Box>

        <CommonOutlineInput
          label={t(i18nKeys.estates.nickname)}
          placeholder={t(i18nKeys.estates.nickname)}
          value={watch('nickname')}
          onChangeText={(text) =>
            setValue('nickname', text, { shouldValidate: true })
          }
        />

        <Stack space={5} mt={4} direction="row" justifyContent="space-between">
          <Button onPress={handleSubmit(onSubmit)} flex={1}>
            {t(i18nKeys.common.done)}
          </Button>

          <Button variant="outline" onPress={onClose} flex={1}>
            {t(i18nKeys.common.cancel)}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AddMemberModal;
