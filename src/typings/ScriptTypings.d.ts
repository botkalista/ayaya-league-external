


type vKeyType = keyof typeof import('../services/KeyMappingService').vKeys;

type settingGroupBase = { id: string, text: string }
type settingGroupToggle = settingGroupBase & { type: 'toggle', style: 1 | 2, value: boolean }
type settingGroupSlider = settingGroupBase & { type: 'slider', style: 1, value: number, max: number, min: number, size: 1 | 2 }

type settingGroupText = settingGroupBase & { type: 'text', value: string }
type settingGroupRadio = settingGroupBase & { type: 'radio', value: string, options: string[] }
type settingGroupKey = settingGroupBase & { type: 'key', value: vKeyType }


type settingGroupData = settingGroupToggle | settingGroupSlider |
settingGroupText | settingGroupRadio | settingGroupKey;

type settingTitle = { title: string };
type settingDesc = { desc: string };
type settingGroup = { group: settingGroupData[] };
declare type Setting = settingTitle | settingDesc | settingGroup

declare function getVKEY(vKey: vKeyType);

declare const manager: typeof import('../models/main/Manager').default;
declare const ctx: typeof import('../services/DrawService').default;