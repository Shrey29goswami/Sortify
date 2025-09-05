import { ArrayElement, SortingStep, SortingStats } from '../types';

export class SortingVisualizer {
  private array: ArrayElement[];
  private steps: SortingStep[];
  private stats: SortingStats;

  constructor(array: ArrayElement[]) {
    this.array = [...array];
    this.steps = [];
    this.stats = { comparisons: 0, swaps: 0, timeComplexity: '', spaceComplexity: '' };
  }

  private addStep(
    comparing?: number[], 
    swapping?: number[], 
    pivot?: number, 
    sorted?: number[]
  ): void {
    const newArray = this.array.map((element, index) => ({
      ...element,
      state: sorted?.includes(index) ? 'sorted' as const :
             pivot === index ? 'pivot' as const :
             swapping?.includes(index) ? 'swapping' as const :
             comparing?.includes(index) ? 'comparing' as const : 
             'default' as const
    }));

    this.steps.push({
      array: newArray,
      comparing,
      swapping,
      pivot,
      sorted,
      stats: { ...this.stats }
    });
  }

  private swap(i: number, j: number): void {
    [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
    this.stats.swaps++;
  }

  private compare(i: number, j: number): number {
    this.stats.comparisons++;
    return this.array[i].value - this.array[j].value;
  }

  // Elementary Sorting Algorithms
  bubbleSort(): SortingStep[] {
    this.stats.timeComplexity = 'O(n²)';
    this.stats.spaceComplexity = 'O(1)';
    
    const n = this.array.length;
    
    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      
      for (let j = 0; j < n - i - 1; j++) {
        this.addStep([j, j + 1]);
        
        if (this.compare(j, j + 1) > 0) {
          this.addStep(undefined, [j, j + 1]);
          this.swap(j, j + 1);
          swapped = true;
        }
      }
      
      this.addStep(undefined, undefined, undefined, [n - i - 1]);
      
      if (!swapped) break;
    }
    
    this.addStep(undefined, undefined, undefined, Array.from({length: n}, (_, i) => i));
    return this.steps;
  }

  selectionSort(): SortingStep[] {
    this.stats.timeComplexity = 'O(n²)';
    this.stats.spaceComplexity = 'O(1)';
    
    const n = this.array.length;
    
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      
      for (let j = i + 1; j < n; j++) {
        this.addStep([minIdx, j]);
        
        if (this.compare(j, minIdx) < 0) {
          minIdx = j;
        }
      }
      
      if (minIdx !== i) {
        this.addStep(undefined, [i, minIdx]);
        this.swap(i, minIdx);
      }
      
      this.addStep(undefined, undefined, undefined, Array.from({length: i + 1}, (_, k) => k));
    }
    
    this.addStep(undefined, undefined, undefined, Array.from({length: n}, (_, i) => i));
    return this.steps;
  }

  insertionSort(): SortingStep[] {
    this.stats.timeComplexity = 'O(n²)';
    this.stats.spaceComplexity = 'O(1)';
    
    const n = this.array.length;
    
    for (let i = 1; i < n; i++) {
      const key = this.array[i];
      let j = i - 1;
      
      this.addStep([i]);
      
      while (j >= 0 && this.compare(j, i) > 0) {
        this.addStep([j, i]);
        this.array[j + 1] = this.array[j];
        this.stats.swaps++;
        j--;
      }
      
      this.array[j + 1] = key;
      this.addStep(undefined, undefined, undefined, Array.from({length: i + 1}, (_, k) => k));
    }
    
    this.addStep(undefined, undefined, undefined, Array.from({length: n}, (_, i) => i));
    return this.steps;
  }

  // Divide and Conquer Algorithms
  mergeSort(): SortingStep[] {
    this.stats.timeComplexity = 'O(n log n)';
    this.stats.spaceComplexity = 'O(n)';
    
    this.mergeSortHelper(0, this.array.length - 1);
    this.addStep(undefined, undefined, undefined, Array.from({length: this.array.length}, (_, i) => i));
    return this.steps;
  }

  private mergeSortHelper(left: number, right: number): void {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      
      this.mergeSortHelper(left, mid);
      this.mergeSortHelper(mid + 1, right);
      this.merge(left, mid, right);
    }
  }

  private merge(left: number, mid: number, right: number): void {
    const leftArray = this.array.slice(left, mid + 1);
    const rightArray = this.array.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    
    while (i < leftArray.length && j < rightArray.length) {
      this.addStep([left + i, mid + 1 + j]);
      this.stats.comparisons++;
      
      if (leftArray[i].value <= rightArray[j].value) {
        this.array[k] = leftArray[i];
        i++;
      } else {
        this.array[k] = rightArray[j];
        j++;
      }
      k++;
      this.stats.swaps++;
    }
    
    while (i < leftArray.length) {
      this.array[k] = leftArray[i];
      i++;
      k++;
      this.stats.swaps++;
    }
    
    while (j < rightArray.length) {
      this.array[k] = rightArray[j];
      j++;
      k++;
      this.stats.swaps++;
    }
    
    this.addStep(undefined, Array.from({length: right - left + 1}, (_, i) => left + i));
  }

  quickSort(): SortingStep[] {
    this.stats.timeComplexity = 'O(n log n)';
    this.stats.spaceComplexity = 'O(log n)';
    
    this.quickSortHelper(0, this.array.length - 1);
    this.addStep(undefined, undefined, undefined, Array.from({length: this.array.length}, (_, i) => i));
    return this.steps;
  }

  private quickSortHelper(low: number, high: number): void {
    if (low < high) {
      const pi = this.partition(low, high);
      this.quickSortHelper(low, pi - 1);
      this.quickSortHelper(pi + 1, high);
    }
  }

  private partition(low: number, high: number): number {
    const pivot = this.array[high].value;
    this.addStep(undefined, undefined, high);
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      this.addStep([j, high]);
      
      if (this.array[j].value < pivot) {
        this.stats.comparisons++;
        i++;
        this.addStep(undefined, [i, j]);
        this.swap(i, j);
      }
    }
    
    this.addStep(undefined, [i + 1, high]);
    this.swap(i + 1, high);
    return i + 1;
  }

  heapSort(): SortingStep[] {
    this.stats.timeComplexity = 'O(n log n)';
    this.stats.spaceComplexity = 'O(1)';
    
    const n = this.array.length;
    
    // Build heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      this.heapify(n, i);
    }
    
    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      this.addStep(undefined, [0, i]);
      this.swap(0, i);
      this.addStep(undefined, undefined, undefined, Array.from({length: n - i}, (_, k) => n - 1 - k));
      this.heapify(i, 0);
    }
    
    this.addStep(undefined, undefined, undefined, Array.from({length: n}, (_, i) => i));
    return this.steps;
  }

  private heapify(n: number, i: number): void {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    if (left < n) {
      this.addStep([left, largest]);
      if (this.compare(left, largest) > 0) {
        largest = left;
      }
    }
    
    if (right < n) {
      this.addStep([right, largest]);
      if (this.compare(right, largest) > 0) {
        largest = right;
      }
    }
    
    if (largest !== i) {
      this.addStep(undefined, [i, largest]);
      this.swap(i, largest);
      this.heapify(n, largest);
    }
  }

  // Exotic/Fun Algorithms
  bogoSort(): SortingStep[] {
    this.stats.timeComplexity = 'O((n+1)!)';
    this.stats.spaceComplexity = 'O(1)';
    
    let iterations = 0;
    const maxIterations = 1000; // Prevent infinite loops
    
    while (!this.isSorted() && iterations < maxIterations) {
      this.shuffle();
      this.addStep();
      iterations++;
    }
    
    this.addStep(undefined, undefined, undefined, Array.from({length: this.array.length}, (_, i) => i));
    return this.steps;
  }

  private isSorted(): boolean {
    for (let i = 0; i < this.array.length - 1; i++) {
      if (this.array[i].value > this.array[i + 1].value) {
        return false;
      }
    }
    return true;
  }

  private shuffle(): void {
    for (let i = this.array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      this.swap(i, j);
    }
  }

  cocktailShakerSort(): SortingStep[] {
    this.stats.timeComplexity = 'O(n²)';
    this.stats.spaceComplexity = 'O(1)';
    
    let start = 0;
    let end = this.array.length - 1;
    let swapped = true;
    
    while (swapped) {
      swapped = false;
      
      // Forward pass
      for (let i = start; i < end; i++) {
        this.addStep([i, i + 1]);
        if (this.compare(i, i + 1) > 0) {
          this.addStep(undefined, [i, i + 1]);
          this.swap(i, i + 1);
          swapped = true;
        }
      }
      
      if (!swapped) break;
      
      end--;
      this.addStep(undefined, undefined, undefined, [end + 1]);
      swapped = false;
      
      // Backward pass
      for (let i = end; i > start; i--) {
        this.addStep([i - 1, i]);
        if (this.compare(i - 1, i) > 0) {
          this.addStep(undefined, [i - 1, i]);
          this.swap(i - 1, i);
          swapped = true;
        }
      }
      
      start++;
      this.addStep(undefined, undefined, undefined, [start - 1]);
    }
    
    this.addStep(undefined, undefined, undefined, Array.from({length: this.array.length}, (_, i) => i));
    return this.steps;
  }
}

export const SORTING_ALGORITHMS = [
  {
    id: 'bubble',
    name: 'Bubble Sort',
    description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    category: 'elementary' as const
  },
  {
    id: 'selection',
    name: 'Selection Sort',
    description: 'Divides the list into sorted and unsorted regions, repeatedly selecting the smallest element from the unsorted region.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    category: 'elementary' as const
  },
  {
    id: 'insertion',
    name: 'Insertion Sort',
    description: 'Builds the sorted array one element at a time by repeatedly inserting elements into their correct position.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    category: 'elementary' as const
  },
  {
    id: 'merge',
    name: 'Merge Sort',
    description: 'Divides the array into halves, sorts them separately, and then merges the sorted halves.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    category: 'divide-conquer' as const
  },
  {
    id: 'quick',
    name: 'Quick Sort',
    description: 'Selects a pivot element and partitions the array around it, then recursively sorts the subarrays.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    category: 'divide-conquer' as const
  },
  {
    id: 'heap',
    name: 'Heap Sort',
    description: 'Builds a max heap from the array and repeatedly extracts the maximum element.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    category: 'divide-conquer' as const
  },
  {
    id: 'cocktail',
    name: 'Cocktail Shaker Sort',
    description: 'A variation of bubble sort that sorts in both directions on each pass through the list.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    category: 'variants' as const
  },
  {
    id: 'bogo',
    name: 'Bogo Sort',
    description: 'Randomly shuffles the array until it happens to be sorted. Highly inefficient but amusing!',
    timeComplexity: 'O((n+1)!)',
    spaceComplexity: 'O(1)',
    category: 'exotic' as const
  }
];