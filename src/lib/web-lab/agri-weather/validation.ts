export const CITY_DISTRICT_ALLOWLIST: Record<string, readonly string[]> = {
  "臺中市": ["西屯區"],
  "臺北市": ["中正區"],
  "高雄市": ["鳳山區"],
};

export const CROP_ALLOWLIST = new Set(["rice", "vegetable", "fruit"]);
export const WEATHER_MODES = new Set(["snapshot", "live"]);

export function isAllowedCityDistrict(city: string, district: string): boolean {
  return Boolean(CITY_DISTRICT_ALLOWLIST[city]?.includes(district));
}

export function isAllowedCity(city: string): boolean {
  return Object.prototype.hasOwnProperty.call(CITY_DISTRICT_ALLOWLIST, city);
}

export function isAllowedCrop(crop: string): boolean {
  return CROP_ALLOWLIST.has(crop);
}

export function isAllowedWeatherMode(mode: string): mode is "snapshot" | "live" {
  return WEATHER_MODES.has(mode);
}
