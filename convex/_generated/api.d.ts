/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as gameStates from "../gameStates.js";
import type * as game_logic_contract from "../game_logic/contract.js";
import type * as game_logic_monster from "../game_logic/monster.js";
import type * as game_logic_utility from "../game_logic/utility.js";
import type * as games from "../games.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  gameStates: typeof gameStates;
  "game_logic/contract": typeof game_logic_contract;
  "game_logic/monster": typeof game_logic_monster;
  "game_logic/utility": typeof game_logic_utility;
  games: typeof games;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
