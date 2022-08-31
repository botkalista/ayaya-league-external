
declare type registerOptions = {
    setup?: () => any,
    onTick?: () => any,
    onDraw?: () => any
}

type settingGroupBase = { id: string, text: string }
type settingGroupToggle = settingGroupBase & { type: 'toggle', style: 1 | 2, value: boolean }
type settingGroupSlider = settingGroupBase & { type: 'slider', style: 1, value: number, max: number, min: number, size: 1 | 2 }
type settingGroupData = settingGroupToggle | settingGroupSlider
type settingTitle = { title: string };
type settingDesc = { desc: string };
type settingGroup = { group: settingGroupData[] };
declare type Setting = settingTitle | settingDesc | settingGroup



declare function register(opts: registerOptions);
declare function settings(settings: Setting[]);



declare const manager: typeof import('../models/main/Manager').default;
declare const ctx: typeof import('../services/DrawService').default;