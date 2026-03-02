export function getPixelGridConfig(screenWidth: number) {
  const isMobile = screenWidth < 768;
  const GRID_W = isMobile ? 50 : 120;
  const GRID_H = isMobile ? 18 : 40;
  const PIXEL_SIZE = Math.max(3, Math.floor((screenWidth * 0.8) / GRID_W));
  return { GRID_W, GRID_H, PIXEL_SIZE, isMobile };
}

export function getOffsetY(h: number, totalH: number, isMobile: boolean) {
  return isMobile
    ? Math.floor(h * 0.3 - totalH / 2)
    : Math.floor((h - totalH) / 2) - 30;
}
