export type TAccountStackParamList = {
  Accounts: undefined;
  EditProfile: undefined;
  HomeManagementNavigator: undefined;
  SettingsStack: undefined;
  FaQAndSupport: undefined;
};

export type THomeManagementStackParamList = {
  HomeList: undefined;
  CreateHome: undefined;
  UpdateHome: { homeId: string };
  HomeDetail: {
    homeId: number;
    homeName: string;
  };
};

export type TSettingsStackParamList = {
  MainSettings: undefined;
  ChangePassword: undefined;
};
