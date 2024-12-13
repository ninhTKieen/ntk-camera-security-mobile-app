import { SegmentedControl } from '@src/components/segment-control';
import { SvgIcon } from '@src/components/svg-icons';
import { Box } from 'native-base';
import React, { useState } from 'react';

import FaceRecognitionList from './face-recognition-list';
import HomeDevicesList from './home-devices-list';

const HomeTabList = () => {
  const [selectedOption, setSelectedOption] = useState('Devices');

  return (
    <Box flex={1} w="full">
      <SegmentedControl
        options={[
          {
            value: 'Devices',
            icons: (
              <SvgIcon name="camera" color="#000" width={30} height={30} />
            ),
          },
          {
            value: 'Recognitions',
            icons: (
              <SvgIcon
                name="face-recognition-list"
                color="#000"
                width={50}
                height={50}
              />
            ),
          },
        ]}
        selectedOption={selectedOption}
        onOptionPress={setSelectedOption}
      />

      {selectedOption === 'Devices' ? (
        <HomeDevicesList />
      ) : (
        <FaceRecognitionList />
      )}
    </Box>
  );
};

export default HomeTabList;
