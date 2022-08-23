function onDraw(ctx, manager) {
  const pos = manager.me.gamePos;
  const range = manager.me.range;
  ctx.circle(pos, range, 50, 255, 1);
}