import * as E from 'fp-ts/Either';
import { convertPokemonListToCards, getPokemonList } from '@lib/pokeapi';
import { pipe } from 'fp-ts/lib/function';
import { GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import { ReactElement, useEffect, useState } from 'react';
import { MemoryCardState, Pokemon } from 'app-types';
import MemoryCard from '@components/MemoryCard';
import {
  gameStateFromMemoryCardList,
  handleClickOnCard,
  resetCardList,
} from 'controllers/game-manager';
import { map } from 'fp-ts/lib/Array';
import { memoryGameState } from 'types/impl';
import GameState from '@components/GameState';

interface PageProps {
  memoryCardList: MemoryCardState[];
}

export default function Home({ memoryCardList }: PageProps): ReactElement {
  const [timer, setTimer] = useState<number | null>(null);
  const [cardList, setCardList] = useState<MemoryCardState[]>(memoryCardList);
  const gameState = gameStateFromMemoryCardList(cardList);
  const gameStateIsTwoShowing = memoryGameState.two_showing.is(gameState);
  const handleClick = (cardState: MemoryCardState): void => {
    if (timer != null) {
      window.clearTimeout(timer);
    }
    setCardList(handleClickOnCard({ cardState, gameState }));
  };

  const reloadGame = (): void => {
    window.location.reload();
  };

  useEffect(() => {
    if (gameStateIsTwoShowing) {
      setTimer(
        window.setTimeout(() => {
          setCardList(resetCardList);
        }, 2000)
      );
    }
  }, [gameStateIsTwoShowing]);

  return (
    <div>
      <Head>
        <title>Card Game Poke API - Sandro Maglione</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="my-12 mx-14">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome to the amazing Card Game Poke API
          </h1>
          <button type="button" onClick={reloadGame}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
        <GameState gameState={gameState} />
        <div className="grid grid-cols-4 gap-4 mt-6">
          {pipe(
            cardList,
            map((cardState) => (
              <MemoryCard
                key={cardState.value.id}
                cardState={cardState}
                handleClick={() => handleClick(cardState)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// TODO: Display error message when getPokemonList fails
export async function getServerSideProps(): Promise<
  GetServerSidePropsResult<PageProps>
> {
  return pipe(
    await getPokemonList()(),
    E.getOrElse((): readonly Pokemon[] => []),
    (pokemonList) => ({
      props: { memoryCardList: convertPokemonListToCards(pokemonList) },
    })
  );
}
