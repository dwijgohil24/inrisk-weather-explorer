export function toDailyRows(fileData) {
  if (!fileData?.daily) return [];

  const { time, temperature_2m_max, temperature_2m_min, apparent_temperature_max, apparent_temperature_min } = fileData.daily;

  return time.map((date, i) => ({
    date,
    tempMax: temperature_2m_max[i],
    tempMin: temperature_2m_min[i],
    apparentMax: apparent_temperature_max[i],
    apparentMin: apparent_temperature_min[i],
  }));
}