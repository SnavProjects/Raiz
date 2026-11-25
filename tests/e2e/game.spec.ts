import { test, expect, type Page } from '@playwright/test';

async function createWorld(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Novo Mundo', exact: true }).click();
  await page.fill('#world-name', 'Mundo E2E');
  await page.fill('#world-seed', 'e2e-seed-1');
  await page.getByRole('button', { name: 'Criar Mundo', exact: true }).click();
  // HUD sozinho não prova que a cena Phaser iniciou.
  await expect(page.locator('#game-container canvas[data-ready="true"]')).toBeVisible({ timeout: 20000 });
  await expect(page.locator('#hotbar .slot')).toHaveCount(9);
}
async function readPlayer(page: Page): Promise<{ x: number; y: number; inventory: { itemId: string | null; count: number }[] }> {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open('raiz-db'); req.onsuccess = () => resolve(req.result); req.onerror = reject;
    });
    return new Promise((resolve, reject) => {
      const tx = db.transaction('worlds', 'readonly'); const req = tx.objectStore('worlds').getAll();
      req.onsuccess = () => resolve(req.result[0].player); req.onerror = reject; tx.oncomplete = () => db.close();
    });
  });
}
test('menu principal carrega', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#main-menu')).toBeVisible();
  await expect(page.locator('h1.logo')).toContainText('RAIZ');
});
test('cena inicia sem erro, inventário e pausa abrem e fecham', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await createWorld(page);
  await page.keyboard.press('KeyI');
  await expect(page.locator('#inventory-modal .slot')).toHaveCount(36);
  await page.keyboard.press('Escape');
  await expect(page.locator('#inventory-modal')).toHaveCount(0);
  await page.keyboard.press('KeyC');
  await expect(page.locator('#crafting-modal')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await expect(page.locator('#pause-modal')).toBeVisible();
  await page.locator('#pause-modal').getByRole('button', { name: 'Configurações', exact: true }).click();
  await expect(page.locator('#settings')).toBeVisible();
  await page.locator('#settings').getByRole('button', { name: 'Voltar', exact: true }).click();
  await expect(page.locator('#hotbar .slot')).toHaveCount(9);
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await expect(page.locator('#pause-modal')).toHaveCount(0);
  expect(errors).toEqual([]);
});
test('movimento é salvo e mundo continua após recarregar a página', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await createWorld(page);
  const initial = await readPlayer(page);
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(700);
  await page.keyboard.up('ArrowRight');
  await page.keyboard.press('Escape');
  await page.locator('#pause-modal').getByRole('button', { name: 'Salvar', exact: true }).click();
  await expect(page.locator('#toast')).toContainText('Mundo salvo');
  const saved = await readPlayer(page);
  expect(saved.x).not.toBe(initial.x);
  expect(saved.inventory).toHaveLength(36);
  await page.reload();
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await expect(page.locator('.world-item')).toContainText('Mundo E2E');
  await page.getByRole('button', { name: 'Jogar', exact: true }).click();
  await expect(page.locator('canvas[data-ready="true"]')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.locator('#pause-modal').getByRole('button', { name: 'Salvar', exact: true }).click();
  await expect(page.locator('#toast')).toContainText('Mundo salvo');
  expect((await readPlayer(page)).x).toBeCloseTo(saved.x, 0);
  expect(errors).toEqual([]);
});
test('configurações persistem após recarregar', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Configurações', exact: true }).click();
  await expect(page.locator('#settings')).toBeVisible();
  await page.locator('input[type="checkbox"]').first().check();
  await expect(page.locator('body')).toHaveCSS('filter', 'contrast(1.4)');
  await page.getByRole('button', { name: 'Voltar', exact: true }).click();
  await page.reload();
  await expect(page.locator('#main-menu')).toBeVisible();
  await expect(page.locator('body')).toHaveCSS('filter', 'contrast(1.4)');
});
test('controles touch permanecem visíveis ao iniciar e interagem com o jogo', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await createWorld(page);
  await expect(page.locator('#tc-left-btn')).toBeVisible();
  await expect(page.locator('#tc-build')).toBeVisible();
  const before = await readPlayer(page);
  await page.locator('#tc-right-btn').dispatchEvent('touchstart');
  await page.waitForTimeout(500);
  await page.locator('#tc-right-btn').dispatchEvent('touchend');
  await page.locator('#hud-buttons').getByRole('button', { name: 'Salvar', exact: true }).click();
  await expect(page.locator('#toast')).toContainText('Mundo salvo');
  expect((await readPlayer(page)).x).not.toBe(before.x);
  expect(errors).toEqual([]);
  await context.close();
});

test('segurar mineração altera terreno e preserva os drops no save', async ({ page }) => {
  await createWorld(page);
  await page.waitForTimeout(600); // aguarda o jogador pousar e a câmera estabilizar
  await page.mouse.move(640, 408);
  await page.mouse.down();
  await page.waitForTimeout(800); // sem mover o mouse: progresso depende do tempo, não de eventos
  await page.mouse.up();
  await page.keyboard.press('Escape');
  await page.locator('#pause-modal').getByRole('button', { name: 'Salvar', exact: true }).click();
  await expect(page.locator('#toast')).toContainText('Mundo salvo');
  const player = await readPlayer(page);
  expect(player.inventory.some(s => s.itemId === 'dirt' && s.count > 0)).toBe(true);
});
