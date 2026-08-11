export type League =
  | 'premier-league'
  | 'la-liga'
  | 'serie-a'
  | 'bundesliga'
  | 'ligue-1'
  | 'other';

export interface Team {
  /** Korean name as used by Korean broadcasters and sports media */
  ko: string;
  league: League;
}

export interface TeamEntry extends Team {
  /** English name, as returned by the football-data.org API */
  en: string;
}

export interface Meta {
  name: string;
  version: string;
  updated: string;
  count: number;
  license: string;
  homepage: string;
}

/** Raw mapping, keyed on the English name */
export declare const teams: Record<string, Team>;

export declare const meta: Meta;

/** Korean name for an English club name, or null if unknown. Falls back to a normalised lookup. */
export declare function ko(name: string): string | null;

/** Full entry for an English club name, or null if unknown. */
export declare function find(name: string): Team | null;

/** Normalise a club name for comparison (drops FC/AC/de/di, founding years, diacritics). */
export declare function normalize(name: string): string;

/** All teams in one league. */
export declare function byLeague(league: League): TeamEntry[];

/** All teams as an array. */
export declare function all(): TeamEntry[];
