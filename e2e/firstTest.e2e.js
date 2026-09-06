describe('Arco', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('debe mostrar el onboarding y poder saltarlo', async () => {
    await expect(element(by.text('Saltar'))).toBeVisible();
    await element(by.text('Saltar')).tap();
  });

  it('debe mostrar el saludo en la pantalla de inicio', async () => {
    await expect(
      element(by.text('Tasas BCV y P2P en tiempo real'))
    ).toBeVisible();
  });

  it('debe navegar al conversor desde las herramientas rápidas', async () => {
    await element(by.label('Conversor')).tap();
    await expect(element(by.text('Conversor rápido'))).toBeVisible();
  });
});
