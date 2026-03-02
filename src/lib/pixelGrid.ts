export function getPixelGridConfig(screenWidth: number) {
  const isMobile = screenWidth < 768;
  return {
    GRID_W: isMobile ? 50 : 120,
    GRID_H: isMobile ? 18 : 40,
    PIXEL_SIZE: isMobile ? Math.max(3, Math.floor((screenWidth * 0.7) / 50)) : 18,
    isMobile,
  };
}

export function getOffsetY(h: number, totalH: number, isMobile: boolean) {
  return isMobile
    ? Math.floor(h * 0.3 - totalH / 2)
    : Math.floor((h - totalH) / 2) - 30;
}
