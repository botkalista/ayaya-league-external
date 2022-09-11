class Offsets {

    public version = 12.17;

    public oGameVersion = 0x58D820;	//8B 44 24 04 BA ? ? ? ? 2B D0

    public oGameTime = 0x313AFF0; //F3 0F 11 05 ? ? ? ? 8B 49

    public oRenderer = 0x3174DF4; //A1 ?? ?? ?? ?? 56 57 BF ?? ?? ?? ?? 8B
    public oGameWindowWidth = 0x8;
    public oGameWindowHeight = 0xc;
    public oViewProjMatrix = 0x316F328; //B9 ? ? ? ? E8 ? ? ? ? B9 ? ? ? ? E9 ? ? ? ? CC CC CC CC CC CC CC CC // 83 C4 04 5F 8B 8C 24 ? ? ? ?  -> vai sopra; sotto al loc; primo unk_offset

    public oHeroManager = 0x18A50D0; //8B 15 ? ? ? ? 0F 44 C1
    public oMinionManager = 0x24F2850; //A3 ?? ?? ?? ?? E8 ?? ?? ?? ?? 83 C4 04 85 C0 74 32
    public oTurretManager = 0x3139D5C; //8B 35 ? ? ? ? 8B 76 18
    public oMissileManager = 0x3142288; //8B 0D ?? ?? ?? ?? E8 ?? ?? ?? ?? 8B 30 8B 36
    public oInhibitorManager = 0x3118F30; //A1 ?? ?? ?? ?? 53 55 56 8B 70 04 8B 40 08

    public oUnderMouse = 0x24F29C4; //! AddressToChange 89 0D ? ? ? ? C7 41 ? ? ? ? ? C7 41 ? ? ? ? ? C7 01 ? ? ? ?

    public oShopsList = 0x24CA708;	//8B 0D ?? ?? ?? ?? E8 ?? ?? ?? ?? 84 C0 75 11 8B 4F 04

    public oLocalPlayer = 0x3141554; //57 8B 3D ? ? ? ? 3B F7 75
    public oObjectManager = 0x18A503C; //89 ? ? ? ? ? 57 C7 06 ? ? ? ? 66 C7 46 04 ? ?
    public oMinimapObject = 0x310F83C;	// 74 22 8B 0D ? ? ? ? 85 C9 74 18 80 79 38 00
    public oMinimapObjectHud = 0x120;
    public oMinimapHudPos = 0x44;
    public oMinimapHudSize = 0x4C;

    public oHud = 0x187BF80;	//8B 0D ? ? ? ? 6A 00 8B 49 34 E8 ? ? ? ? B0
    public oZoom = 0x31104FC;
    public oMaxZoom = 0x20;

    public oObjIndex = 0x0008;
    public oObjTeam = 0x0034;

    public oObjNetId = 0xB4;


    public oObjRecallState = 0xD90;
    public oObjPlayerName = 0x54 + 30;
    public oObjName = 0x2D3C;
    public oObjLevel = 0x351C;
    public oObjPosition = 0x1DC;
    public oObjVisible = 0x0274;
    public oObjTargetable = 0xD04;
    public oObjVulnerable = 0x3D4;

    public oObjHealth = 0x0E74;
    public oObjMaxHealth = 0x0E84;
    public oObjMana = 0x029C;
    public oObjMaxMana = 0x02AC;

    public oObjAbilityHaste = 0x1690;

    public oObjTransformation = 0x3040;
    public oObjExpiry = 0x298;
    public oObjCrit = 0x12C8;
    public oObjCritMulti = 0x12B8;
    public oObjAtkSpeedMulti = 0x1348;
    public oObjItemList = 0x33E8;
    public oObjExpierience = 0x337C;

    public oObjAttackSpeedBonus = 0x1350;

    public oObjSpawnCount = 0x288;

    public oObjManaRegen = 0x11E0;
    public oObjHealthRegen = 0x1388;



    public oObjAiManager = 0x2CAC; //0F B6 83 ?? ?? ?? ?? 33 C9
    public oAiManagerTargetPos = 0x10;
    public oAiManagerStartPath = 0x1CC;
    public oAiManagerEndPath = 0x1D8;
    public oAiManagerIsMoving = 0x1C0;
    public oAiManagerIsDashing = 0x214;
    public oAiManagerCurrentSegment = 0x1C4;
    public oAiManagerDashSpeed = 0x1F8;


    // --- MISSILES ---
    public oMissileObjectEntry = 0x14;
    public oMissileSpellInfo = 0x0260;
    public oMissileSrcIdx = 0x2DC;
    public oMissileDestIdx = 0x330;
    public oMissileStartPos = 0x02DC;
    public oMissileEndPos = 0x02E8;


    public oSpellBook = 0x2330;

    public oSpellBookActiveSpellEntry = 0x20;

    public oActiveSpellEntryIsBasic = 0xC4;
    public oActiveSpellEntryStartPos = 0x84;
    public oActiveSpellEntryEndPos = 0x90;

    public oBuffManager = 0x2310; //8B 81 ?? ?? ?? ?? 81 C1 ?? ?? ?? ?? 8B ?? ?? FF E0
    public oBuffArray = 0x10;
    public oBuffArrayLength = 0x14;
    public oBuffSize = 0x8;
    public oBuffType = 0x4;

    public oBuffName = 0x4;
    public oBuffStartTime = 0xC;
    public oBuffEndTime = 0x10;
    public oBuffCount = 0x24;
    public oBuffCount2 = 0x74;


    public oSpellSlots = 0x2950; // 8B 84 83 ? ? ? ? EB 06 8B 83 ? ? ? ? 85 C0 0F 84 ? ? ? ? 53 8B CF E8 ? ? ? ? 8B C8 8B 10 FF 52 18 8B F0
    public oSpellReadyAt = 0x24;
    public oSpellLevel = 0x1C;
    public oSpellDamage = 0x94;
    public oSpellManaCost = 0x52C;
    public oSpellInfo = 0x120;
    public oSpellName = 0x18;

    public oSpellInfoSlot = 0x4;
    public oSpellInfoData = 0x40;
    public oSpellInfoStartTime = 0x8;
    public oSpellInfoIndex = 0xC;
    public oSpellInfoLevel = 0x58;
    public oSpellInfoName = 0x104;

    public oSpellInfoDataMissileName = 0x78;
    public oSpellInfoDataName = 0x6C;
    public oSpellInfoDataCooldownTime = 0x0288;

    public oChat = 0x3118E90;// 8B 0D ? ? ? ? 83 78 44 00
    public oChatIsOpen = 0x75C;


    public oMapCount = 44;
    public oMapRoot = 40;
    public oMapNodeObject = 20;
    public oMapNetId = 16;



    public oObjStatAp = 0x1750;
    public oObjStatBonusAd = 0x12CC;
    public oObjStatBaseAd = 0x1358; // 8C


    public oObjArmor = 0x137C;
    public oObjMagicRes = 0x1384; // 08


    public oObjStatMagicPenPerc: number;
    public oObjStatMagicPenFlat: number;
    public oObjStatLethality: number;
    public oObjStatArmorPen: number;

    public oObjStatMovSpeed: number;
    public oObjStatAttackRange: number;

    constructor() {
        this.getStatsOffsets();
    }

    private getStatsOffsets() {
        //base 0x2DDBE010
        const base = 0x1270
        const oObjStatMagicPenFlat = base + 0x0;
        const oObjStatArmorPen = base + 0x4;
        const oObjStatMagicPenPerc = base + 0x8;
        const oObjStatLethality = base + 0x1C

        this.oObjStatMagicPenFlat = oObjStatMagicPenFlat;
        this.oObjStatArmorPen = oObjStatArmorPen;
        this.oObjStatMagicPenPerc = oObjStatMagicPenPerc;
        this.oObjStatLethality = oObjStatLethality;

        const base2 = base + 0x124;
        const oObjStatMovSpeed = base2 + 0x0;
        const oObjStatAttackRange = base2 + 0x8;
        this.oObjStatMovSpeed = oObjStatMovSpeed;
        this.oObjStatAttackRange = oObjStatAttackRange;

    }

}

const instance = new Offsets();
export default instance;


