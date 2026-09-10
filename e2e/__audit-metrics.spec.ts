import { test } from "@playwright/test";

const routes = [
  "/random-team-generator",
  "/random-pair-generator",
  "/remove-line-breaks",
  "/column-to-comma-separated-list",
  "/de/zufaelliger-teamgenerator",
  "/de/zufaellige-paare-bilden",
  "/de/zeilenumbrueche-entfernen",
  "/de/spalte-in-kommagetrennte-liste",
  "/fr/generateur-equipes-aleatoires",
  "/fr/generateur-paires-aleatoires",
  "/fr/supprimer-sauts-de-ligne",
  "/fr/colonne-liste-separee-par-virgules",
  "/es/generador-equipos-aleatorios",
  "/es/generador-parejas-aleatorias",
  "/es/eliminar-saltos-de-linea",
  "/es/columna-lista-separada-por-comas",
  "/pt-br/sorteador-de-times",
  "/pt-br/sorteador-de-duplas",
  "/pt-br/remover-quebras-de-linha",
  "/pt-br/coluna-lista-separada-por-virgulas",
  "/ru/generator-sluchaynyh-komand",
  "/ru/generator-sluchaynyh-par",
  "/ru/ubrat-perenosy-strok",
  "/ru/stolbec-v-spisok-cherez-zapyatuyu",
] as const;

test("temporary layout metrics at narrow desktop widths", async ({ page }) => {
  for (const width of [700, 560]) {
    await page.setViewportSize({ width, height: 900 });
    const failures: string[] = [];
    for (const route of routes) {
      await page.goto(route);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      if (overflow) failures.push(route);
    }
    console.log(`AUDIT_OVERFLOW_${width}=${JSON.stringify(failures)}`);
  }
});

test("temporary control and viewer metrics", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });

  for (const route of ["/random-team-generator", "/random-pair-generator"] as const) {
    await page.goto(route);
    const root = route.includes("team") ? "[data-random-team-tool]" : "[data-random-pair-tool]";
    await page.locator(`${root} [data-load-example]`).click();
    const action = page.locator(`${root} [data-generate]`);
    const before = await action.boundingBox();
    await action.click();
    const after = await action.boundingBox();
    console.log(
      `AUDIT_ACTION_WIDTH=${route}:${before?.width ?? -1}->${after?.width ?? -1}`,
    );
  }

  for (const [route, root] of [
    ["/remove-line-breaks", "[data-remove-line-breaks-tool]"],
    ["/column-to-comma-separated-list", "[data-column-to-comma-tool]"],
  ] as const) {
    await page.goto(route);
    const custom = page.locator(`${root} [data-custom-row]`);
    console.log(
      `AUDIT_CUSTOM_ROW=${route}:hidden=${await custom.getAttribute("hidden")}:display=${await custom.evaluate((el) => getComputedStyle(el).display)}`,
    );
  }

  await page.goto("/column-to-comma-separated-list");
  await page.locator("[data-column-to-comma-tool] [data-list-input]").fill(
    Array.from({ length: 20 }, (_, i) => `very-long-column-item-${i + 1}`).join("\n"),
  );
  const viewer = page.locator("[data-column-to-comma-tool] [data-result-viewer]");
  console.log(
    `AUDIT_COLUMN_VIEWER=white-space:${await viewer.evaluate((el) => getComputedStyle(el).whiteSpace)};scroll:${await viewer.evaluate((el) => `${el.scrollWidth}/${el.clientWidth}`)}`,
  );
});
