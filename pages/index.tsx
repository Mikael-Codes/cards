import { useState, useEffect } from "react";
import React from 'react';
import ReactDOM from 'react-dom';
import { AnimatePresence } from "framer-motion";
import type { NextPage } from "next";
import RotateIcon from "@icons/RotateIcon";
import Counter from "@components/Counter";
import { CardType, HistoryType, ResultType, SwipeType } from "types";
import Card from "@components/Card";
import Head from "next/head";
require('dotenv').config()

var Airtable = require('airtable');
var apiKey = 'your AirTable API key'



interface Record {
    id: string;
  fields: {
    [key: string]: any;
  };
}
interface CardRecord {
  id: number;
  name: string;
  image: string;
  color: string;
  emoji: string;
  text1: string;
  text2: string;
}
const Home: NextPage = () => {
  const [cards, setCards] = useState(Array());
  const [isLoaded, setIsLoaded] = useState(false)
  const [apiCards, setApiCards] = useState(Array());
  var api_cards = Array()
  var pageCards;

  Airtable.configure({
      endpointUrl: 'https://api.airtable.com',
  });
  const [records, setRecords] = useState<CardRecord[]>([]);

  useEffect(() => {
      const base = new Airtable({ apiKey: apiKey }).base('app0yydtfVDd8NWa2');

      base('Cards').select({
        view: 'grid',
        maxRecords: 42,
      }).eachPage((records: Record[], fetchNextPage: Function) => {
        // include index in map
        pageCards = records.map((record, index) => { 
          return { 
            id: index,
            name: record.id,
            color: "#fffff",
            emoji: "",
            text1: record.fields.text1,
            text2: record.fields.text2,
            image: record.fields.ImageFile ? record.fields.ImageFile[0].url : 'https://images.nightcafe.studio/jobs/7tMaNEq45IFwjtcMR0nZ/7tMaNEq45IFwjtcMR0nZ--1--cq0f0.jpg',
         }
        });
        
        // Randomize array order for pageCards
        for (let i = pageCards.length - 1; i > 1; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [pageCards[i], pageCards[j]] = [pageCards[j], pageCards[i]];
        }

        // First card always the same
        pageCards[records.length-1] = 
        { 
          id: records.length-1,
          name: records[0].id,
          color: "#fffff",
          emoji: "",
          text1: records[0].fields.text1,
          text2: records[0].fields.text2,
          image: records[0].fields.ImageFile ? records[0].fields.ImageFile[0].url : 'https://interactive-examples.mdn.mozilla.net/media/examples/moon.jpg',

        }
        setIsLoaded(true);
        setCards(pageCards);
        fetchNextPage();
      }, (error: any) => {
        console.error(error);
      });
    }, []);


  const [result, setResult] = useState<ResultType>({
    like: 0,
    nope: 0,
    superlike: 0,
  });
  const [history, setHistory] = useState<HistoryType[]>([]);
  // index of last card
  const activeIndex = cards.length - 1;
  const removeCard = (oldCard: CardType, swipe: SwipeType) => {
    setHistory((current) => [...current, { ...oldCard, swipe }]);
    setCards((current) =>
      current.filter((card) => {
        return card.id !== oldCard.id;
      })
    );
    setResult((current) => ({ ...current, [swipe]: current[swipe] + 1 }));
  };
  const undoSwipe = () => {
    const newCard = history.pop();
    if (newCard) {
      const { swipe } = newCard;
      setHistory((current) =>
        current.filter((card) => {
          return card.id !== newCard.id;
        })
      );
      setResult((current) => ({ ...current, [swipe]: current[swipe] - 1 }));
      setCards((current) => [...current, newCard]);
    }
  };
  if(!isLoaded) {
      return <div />
  } else {
    return (
      <div className="relative flex flex-col justify-center items-center w-full h-screen gradient">
        <Head>
          <title>Connection Cards</title>
        </Head>
        <AnimatePresence>

          {cards.map((card, index) => (         
            <Card
              key={card.name}
              active={index === activeIndex}
              removeCard={removeCard}
              card={card}
            />
          ))}
        </AnimatePresence>
        
        {cards.length === 0 ? (
          <span className="text-white text-xl">Thanks for Dancing</span>
        ) : null}
        <footer className="absolute bottom-4 flex items-center space-x-4">
          <div className="flex flex-col items-center space-y-2">
            <button
              disabled={history.length === 0}
              className="w-14 h-14 rounded-full text-black bg-white inline-flex justify-center items-center disabled:cursor-not-allowed"
              onClick={undoSwipe}
              data-testid="undo-btn"
              aria-label="Undo Swipe"
            >
              <RotateIcon strokeWidth={3} />
            </button>
            <span className="text-xs text-white">Undo</span>
          </div>
          <Counter label="Cards played" count={result.like} testid="like-count" />
          {/* <Counter label="Nopes" count={result.nope} testid="nope-count" /> */}
          {/* <Counter
            label="Superlike"
            count={result.superlike}
            testid="superlike-count"
          /> */}
        </footer>
      </div>
    );
  }
};

export default Home;