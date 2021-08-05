import * as t from 'io-ts';

const stringOrNull = t.union([t.string, t.null]);

const pokemonSprites = t.partial({
  back_female: stringOrNull,
  back_shiny_female: stringOrNull,
  back_default: stringOrNull,
  front_female: stringOrNull,
  front_shiny_female: stringOrNull,
  back_shiny: stringOrNull,
  front_default: stringOrNull,
  front_shiny: stringOrNull,
});

const pokeApiResponseResult = t.type({
  name: t.string,
  url: t.string,
});

/** PUBLIC API BELOW 👇 */

export const pokemon = t.partial({
  id: t.number,
  name: t.string,
  sprites: pokemonSprites,
});

export const pokeApiResponse = t.type({
  count: t.number,
  next: t.string,
  previous: t.string,
  results: t.array(pokeApiResponseResult),
});
