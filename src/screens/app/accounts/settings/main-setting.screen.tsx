import SubLayout from '@src/components/sub-layout';
import { i18nKeys } from '@src/configs/i18n';
import { Box, HStack, Switch, Text, useColorMode } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';

const MainSettingScreen = () => {
  const { t } = useTranslation();

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <SubLayout title={t(i18nKeys.account.settings.title)}>
      <Box flex={1}>
        <HStack p={4} justifyContent="space-between" alignItems="center">
          <Text fontSize="md" flex={1}>
            {t(i18nKeys.account.settings.changeTheme)} {colorMode}
          </Text>

          <Switch
            size="md"
            value={colorMode === 'dark'}
            onValueChange={() => {
              toggleColorMode();
            }}
          />
        </HStack>
      </Box>
    </SubLayout>
  );
};

export default MainSettingScreen;
