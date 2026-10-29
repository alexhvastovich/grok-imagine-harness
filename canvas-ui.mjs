// Use inside the existing documented browser session. Never opens a connection.
export async function readCanvasNode(tab, id) {
  if (!/^[a-f0-9-]{36}$/.test(id)) throw new Error('Use an observed canvas node ID');
  const node = tab.playwright.locator(`.react-flow__node[data-id="${id}"]`);
  const style = await node.getAttribute('style');
  const m = style?.match(/translate\(([-.\d]+)px, ([-.\d]+)px\)/);
  if (!m) throw new Error('Node not mounted or position format changed');
  return {id, x: Number(m[1]), y: Number(m[2])};
}

export async function nudgeCanvasNode(tab, id, x, y, maxKeys = 40) {
  if (!Number.isInteger(maxKeys) || maxKeys < 1 || maxKeys > 50) {
    throw new Error('Keep each browser call bounded to at most50 key presses');
  }
  const before = await readCanvasNode(tab, id);
  const node = tab.playwright.locator(`.react-flow__node[data-id="${id}"]`);
  await node.press('Enter');
  const selected = await tab.playwright.locator('.react-flow__node.selected').getAttribute('data-id');
  if (selected !== id) throw new Error('Selection changed; inspect before moving');
  let keys = 0;
  for (const [delta, positive, negative] of [[x-before.x,'ArrowRight','ArrowLeft'],[y-before.y,'ArrowDown','ArrowUp']]) {
    const amount = Math.round(Math.abs(delta));
    const key = delta >= 0 ? positive : negative;
    for (let i=0; i<Math.floor(amount/10) && keys<maxKeys; i++,keys++) await node.press(`Shift+${key}`);
    if (keys === maxKeys) break;
    for (let i=0; i<amount%10 && keys<maxKeys; i++,keys++) await node.press(key);
    if (keys === maxKeys) break;
  }
  const after = await readCanvasNode(tab, id);
  return {before, after, keys, remaining: {x:x-after.x, y:y-after.y},
    verification:'Immediate UI position; confirm after deselection and reload'};
}
