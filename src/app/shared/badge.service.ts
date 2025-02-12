import { Injectable } from '@angular/core';

export interface BadgeLevel {
  name: string;
  imageUrl: string;
  minTokens: number;
  minDiamonds?: number;
  reward: {
    tokens: number;
    diamonds?: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class BadgeService {
  private badgeLevels: BadgeLevel[] = [
    // Bronze Levels
    {
      name: 'BRONZE 1',
      imageUrl: 'assets/badges/bronze1.png',
      minTokens: 0,
      reward: { tokens: 10 },
    },
    {
      name: 'BRONZE 2',
      imageUrl: 'assets/badges/bronze2.png',
      minTokens: 10,
      reward: { tokens: 10 },
    },
    {
      name: 'BRONZE 3',
      imageUrl: 'assets/badges/bronze3.png',
      minTokens: 25,
      reward: { tokens: 10 },
    },

    // Silver Levels
    {
      name: 'SILVER 1',
      imageUrl: 'assets/badges/silver1.png',
      minTokens: 50,
      reward: { tokens: 15 },
    },
    {
      name: 'SILVER 2',
      imageUrl: 'assets/badges/silver2.png',
      minTokens: 75,
      reward: { tokens: 15 },
    },
    {
      name: 'SILVER 3',
      imageUrl: 'assets/badges/silver3.png',
      minTokens: 100,
      reward: { tokens: 15 },
    },

    // Gold Levels
    {
      name: 'GOLD 1',
      imageUrl: 'assets/badges/gold1.png',
      minTokens: 125,
      reward: { tokens: 25 },
    },
    {
      name: 'GOLD 2',
      imageUrl: 'assets/badges/gold2.png',
      minTokens: 150,
      reward: { tokens: 25 },
    },
    {
      name: 'GOLD 3',
      imageUrl: 'assets/badges/gold3.png',
      minTokens: 200,
      reward: { tokens: 25 },
    },
    {
      name: 'GOLD 4',
      imageUrl: 'assets/badges/gold4.png',
      minTokens: 250,
      reward: { tokens: 25 },
    },

    // Platinum Levels
    {
      name: 'PLATINUM 1',
      imageUrl: 'assets/badges/platinum1.png',
      minTokens: 300,
      minDiamonds: 100,
      reward: { tokens: 25 },
    },
    {
      name: 'PLATINUM 2',
      imageUrl: 'assets/badges/platinum2.png',
      minTokens: 325,
      reward: { tokens: 25 },
    },
    {
      name: 'PLATINUM 3',
      imageUrl: 'assets/badges/platinum3.png',
      minTokens: 350,
      reward: { tokens: 25 },
    },
    {
      name: 'PLATINUM 4',
      imageUrl: 'assets/badges/platinum4.png',
      minTokens: 450,
      reward: { tokens: 25 },
    },

    // Diamond Levels
    {
      name: 'DIAMOND 1',
      imageUrl: 'assets/badges/diamond1.png',
      minTokens: 500,
      minDiamonds: 200,
      reward: { tokens: 50 },
    },
    {
      name: 'DIAMOND 2',
      imageUrl: 'assets/badges/diamond2.png',
      minTokens: 550,
      minDiamonds: 300,
      reward: { tokens: 50 },
    },
    {
      name: 'DIAMOND 3',
      imageUrl: 'assets/badges/diamond3.png',
      minTokens: 600,
      reward: { tokens: 50 },
    },
    {
      name: 'DIAMOND 4',
      imageUrl: 'assets/badges/diamond4.png',
      minTokens: 700,
      reward: { tokens: 50 },
    },

    // Heroic Levels
    {
      name: 'HEROIC',
      imageUrl: 'assets/badges/heroic.png',
      minTokens: 1000,
      minDiamonds: 500,
      reward: { tokens: 100, diamonds: 100 },
    },
    {
      name: 'ELITE HEROIC',
      imageUrl: 'assets/badges/elite-heroic.png',
      minTokens: 1500,
      minDiamonds: 750,
      reward: { tokens: 100, diamonds: 100 },
    },

    // Master Levels
    {
      name: 'MASTER',
      imageUrl: 'assets/badges/master.png',
      minTokens: 2500,
      minDiamonds: 1500,
      reward: { tokens: 150, diamonds: 150 },
    },
    {
      name: 'ELITE MASTER',
      imageUrl: 'assets/badges/elite-master.png',
      minTokens: 5000,
      minDiamonds: 2500,
      reward: { tokens: 200, diamonds: 200 },
    },
  ];

  getCurrentBadge(tokens: number, diamonds: number = 0): BadgeLevel {
    return (
      this.badgeLevels
        .filter(
          (badge) =>
            tokens >= badge.minTokens &&
            (!badge.minDiamonds || diamonds >= badge.minDiamonds)
        )
        .pop() || this.badgeLevels[0]
    );
  }
}
