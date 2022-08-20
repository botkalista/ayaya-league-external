import type { UserScriptManager } from "../../scripts/UserScriptManager"
import { DrawContext } from "../models/drawing/DrawContext"
import type { Entity } from "../models/Entity"
import type { Missile } from "../models/Missile"


export type Setting = { text: string }
export type SettingString = Setting & { type: "string", value: string }
export type SettingNumber = Setting & { type: "number", value: number }
export type SettingCheck = Setting & { type: "check", value: boolean }
export type SettingKey = Setting & { type: "key", value: number, strValue: string }

export type SettingCombined = SettingString | SettingNumber | SettingCheck | SettingKey;

export type ScriptSettings = SettingCombined[];
export type ScriptSettingsFull = { name: string, data: ScriptSettings }[];

export type UserScript = {
    _modulename: string,
    _scriptname: string,
    setup?: (path: string, name: string) => Promise<any>,
    onTick?: (e: UserScriptManager, t: number, settings: ScriptSettings) => any,
    onMissileCreate?: (m: Missile, e: UserScriptManager, settings: ScriptSettings) => any,
    onMoveCreate?: (p: Entity, e: UserScriptManager, settings: ScriptSettings) => any,
    onDraw?: (ctx: DrawContext, e: UserScriptManager, settings: ScriptSettings) => any
}

export type fnPublish = (fName: keyof UserScript, settings: ScriptSettingsFull, ...args: any) => any
