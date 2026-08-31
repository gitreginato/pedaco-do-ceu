import { test, expect } from '@playwright/test';
import path from 'path';

test('carrega o studio, clica nas abas e verifica o canvas', async ({ page }) => {
  const filePath = 'file://' + path.resolve(__dirname, '../index.html');
  await page.goto(filePath);
  
  // Verifica titulo
  await expect(page).toHaveTitle(/Template Studio Místico/);
  
  // Verifica se o canvas existe
  const canvas = page.locator('#renderCanvas');
  await expect(canvas).toBeVisible();
  
  // Clica na aba Textos
  const textTab = page.locator('.tab-btn[data-tab="text"]');
  await textTab.click();
  
  // Verifica se o painel de texto ficou visível
  const textPane = page.locator('#tab-text');
  await expect(textPane).toHaveClass(/active/);
  
  // Modifica um texto para testar se nao quebra
  const titleInput = page.locator('#titleInput');
  await titleInput.fill('Teste Playwright');
  
  // Aguarda um pouco para o renderCanvas executar
  await page.waitForTimeout(500);
});
