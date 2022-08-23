function onMissileCreate(missile, manager) {
  if (missile.isAutoAttack) {
    console.log("Auto attack missile created");
  }
  if (missile.isTurretShot) {
    console.log("Turret shot missile created");
  }
}