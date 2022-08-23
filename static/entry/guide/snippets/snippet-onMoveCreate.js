function onMoveCreate(player, manager) {
  const x = player.AiManager.endPath.x;
  const z = player.AiManager.endPath.z;
  console.log(player.name + ' heading to' + x + ' ' + z);
}