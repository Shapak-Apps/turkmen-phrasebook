// src/data/credits.ts
// Кто помогал проекту, по версиям. Список пополняется вручную перед релизом:
// gh api repos/Shapak-Apps/turkmen-phrasebook/contributors --jq '.[].login'
// Сетевых запросов приложение не делает — офлайн остаётся офлайном.

export interface Credit {
  /** Версия приложения, в которую вошёл вклад. */
  version: string;
  name: string;
  /** GitHub-логин, если человек контрибьютил кодом. */
  github?: string;
}

export const credits: Credit[] = [
  { version: '1.0.0', name: 'Daňatarowa Gülhatyja' },
  { version: '2.0.0', name: 'Aýnazar Sylyýew', github: 'aynazar-sylyyew-dev' },
];

export const CONTRIBUTORS_URL =
  'https://github.com/Shapak-Apps/turkmen-phrasebook/graphs/contributors';

export const githubProfileUrl = (login: string): string => `https://github.com/${login}`;
