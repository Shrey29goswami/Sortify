export interface ArrayElement {
  value: number;
  id: string;
  state: 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot';
}

export interface SortingStats {
  comparisons: number;
  swaps: number;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface SortingAlgorithm {
  name: string;
  id: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  category: 'elementary' | 'divide-conquer' | 'linear' | 'variants' | 'exotic';
}

export interface UserPreferences {
  algorithm: string;
  arraySize: number;
  speed: number;
  theme: 'light' | 'dark';
}

export type SortingStep = {
  array: ArrayElement[];
  comparing?: number[];
  swapping?: number[];
  pivot?: number;
  sorted?: number[];
  stats: SortingStats;
};