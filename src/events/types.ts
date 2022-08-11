import type { UserScriptManager } from "../../scripts/UserScriptManager"
import { DrawContext } from "../models/drawing/DrawContext"
import type { Entity } from "../models/Entity"
import type { Missile } from "../models/Missile"

export type UserScript = {
    _modulename: string,
    setup?: () => Promise<any>,
    onTick?: (e: UserScriptManager, t: number) => any,
    onMissileCreate?: (m: Missile, e: UserScriptManager) => any,
    onMoveCreate?: (p: Entity, e: UserScriptManager) => any,
    onDraw?: (ctx: DrawContext, e: UserScriptManager) => any
}

export type fnPublish = (fName: keyof UserScript, ...args: any) => any