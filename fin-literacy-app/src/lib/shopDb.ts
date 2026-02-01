export type Item = {
  id: string;
  name: string;
  price: number;
};

export type User = {
  coins: number;
  inventory: Item[];
};

export const shopItems: Item[] = [
  { id: "hat_red", name: "Red Hat", price: 50 },
  { id: "glasses", name: "Glasses", price: 100 },
  { id: "jacket", name: "Jacket", price: 100 },
];

export const user: User = {
  coins: 200,
  inventory: [],
};
