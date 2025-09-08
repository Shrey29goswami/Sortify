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

  // Linear Time Algorithms
  countingSort(): SortingStep[] {
    this.stats.timeComplexity = 'O(n + k)';
    this.stats.spaceComplexity = 'O(k)';
    
    const n = this.array.length;
    const maxVal = Math.max(...this.array.map(el => el.value));
    const minVal = Math.min(...this.array.map(el => el.value));
    const range = maxVal - minVal + 1;
    
    // Count array
    const count = new Array(range).fill(0);
    
    // Count occurrences
    for (let i = 0; i < n; i++) {
      this.addStep([i]);
      count[this.array[i].value - minVal]++;
      this.stats.comparisons++;
    }
    
    // Reconstruct array
    let index = 0;
    for (let i = 0; i < range; i++) {
      while (count[i] > 0) {
        this.array[index] = { ...this.array[index], value: i + minVal };
        this.addStep(undefined, [index]);
        this.stats.swaps++;
        index++;
        count[i]--;
      }
    }
    
    this.addStep(undefined, undefined, undefined, Array.from({length: n}, (_, i) => i));
    return this.steps;
  }

  radixSort(): SortingStep[] {
    this.stats.timeComplexity = 'O(d × (n + k))';
    this.stats.spaceComplexity = 'O(n + k)';
    
    const maxVal = Math.max(...this.array.map(el => el.value));
    const maxDigits = maxVal.toString().length;
    
    for (let digit = 0; digit < maxDigits; digit++) {
      this.countingSortByDigit(digit);
    }
    
    this.addStep(undefined, undefined, undefined, Array.from({length: this.array.length}, (_, i) => i));
    return this.steps;
  }

  private countingSortByDigit(digit: number): void {
    const n = this.array.length;
    const output = new Array(n);
    const count = new Array(10).fill(0);
    
    // Count occurrences of each digit
    for (let i = 0; i < n; i++) {
      const digitValue = Math.floor(this.array[i].value / Math.pow(10, digit)) % 10;
      count[digitValue]++;
      this.addStep([i]);
      this.stats.comparisons++;
    }
    
    // Change count[i] to actual position
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }
    
    // Build output array
    for (let i = n - 1; i >= 0; i--) {
      const digitValue = Math.floor(this.array[i].value / Math.pow(10, digit)) % 10;
      output[count[digitValue] - 1] = this.array[i];
      count[digitValue]--;
      this.addStep(undefined, [i]);
      this.stats.swaps++;
    }
    
    // Copy output array to original array
    for (let i = 0; i < n; i++) {
      this.array[i] = output[i];
    }
  }

  bucketSort(): SortingStep[] {
    this.stats.timeComplexity = 'O(n + k)';
    this.stats.spaceComplexity = 'O(n × k)';
    
    const n = this.array.length;
    const maxVal = Math.max(...this.array.map(el => el.value));
    const minVal = Math.min(...this.array.map(el => el.value));
    const bucketCount = Math.floor(Math.sqrt(n));
    const bucketSize = Math.ceil((maxVal - minVal + 1) / bucketCount);
    
    // Create buckets
    const buckets: ArrayElement[][] = Array.from({length: bucketCount}, () => []);
    
    // Distribute elements into buckets
    for (let i = 0; i < n; i++) {
      const bucketIndex = Math.min(Math.floor((this.array[i].value - minVal) / bucketSize), bucketCount - 1);
      buckets[bucketIndex].push(this.array[i]);
      this.addStep([i]);
      this.stats.comparisons++;
    }
    
    // Sort individual buckets and concatenate
    let index = 0;
    for (let i = 0; i < bucketCount; i++) {
      if (buckets[i].length > 0) {
        // Simple insertion sort for each bucket
        this.insertionSortBucket(buckets[i]);
        
        for (let j = 0; j < buckets[i].length; j++) {
          this.array[index] = buckets[i][j];
          this.addStep(undefined, [index]);
          this.stats.swaps++;
          index++;
        }
      }
    }
    
    this.addStep(undefined, undefined, undefined, Array.from({length: n}, (_, i) => i));
    return this.steps;
  }

  private insertionSortBucket(bucket: ArrayElement[]): void {
    for (let i = 1; i < bucket.length; i++) {
      const key = bucket[i];
      let j = i - 1;
      
      while (j >= 0 && bucket[j].value > key.value) {
        bucket[j + 1] = bucket[j];
        this.stats.comparisons++;
        this.stats.swaps++;
        j--;
      }
      bucket[j + 1] = key;
    }
  }

  // Variant Algorithms
  shellSort(): SortingStep[] {
    this.stats.timeComplexity = 'O(n log n)';
    this.stats.spaceComplexity = 'O(1)';
    
    const n = this.array.length;
    
    // Start with a big gap, then reduce the gap
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      // Do a gapped insertion sort
      for (let i = gap; i < n; i++) {
        const temp = this.array[i];
        let j = i;
        
        this.addStep([i]);
        
        while (j >= gap && this.compare(j - gap, i) > 0) {
          this.addStep([j - gap, j]);
          this.array[j] = this.array[j - gap];
          this.stats.swaps++;
          j -= gap;
        }
        
        this.array[j] = temp;
        if (j !== i) {
          this.addStep(undefined, [j, i]);
        }
      }
    }
    
    this.addStep(undefined, undefined, undefined, Array.from({length: n}, (_, i) => i));
    return this.steps;
  }

  combSort(): SortingStep[] {
    this.stats.timeComplexity = 'O(n²)';
    this.stats.spaceComplexity = 'O(1)';
    
    const n = this.array.length;
    let gap = n;
    const shrink = 1.3;
    let sorted = false;
    
    while (!sorted) {
      gap = Math.floor(gap / shrink);
      if (gap <= 1) {
        gap = 1;
        sorted = true;
      }
      
      for (let i = 0; i + gap < n; i++) {
        this.addStep([i, i + gap]);
        
        if (this.compare(i, i + gap) > 0) {
          this.addStep(undefined, [i, i + gap]);
          this.swap(i, i + gap);
          sorted = false;
        }
      }
    }
    
    this.addStep(undefined, undefined, undefined, Array.from({length: n}, (_, i) => i));
    return this.steps;
  }

  gnomeSort(): SortingStep[] {
    this.stats.timeComplexity = 'O(n²)';
    this.stats.spaceComplexity = 'O(1)';
    
    const n = this.array.length;
    let index = 0;
    
    while (index < n) {
      if (index === 0) {
        index++;
      } else {
        this.addStep([index - 1, index]);
        
        if (this.compare(index - 1, index) <= 0) {
          index++;
        } else {
          this.addStep(undefined, [index - 1, index]);
          this.swap(index - 1, index);
          index--;
        }
      }
    }
    
    this.addStep(undefined, undefined, undefined, Array.from({length: n}, (_, i) => i));
    return this.steps;
  }

  oddEvenSort(): SortingStep[] {
    this.stats.timeComplexity = 'O(n²)';
    this.stats.spaceComplexity = 'O(1)';
    
    const n = this.array.length;
    let sorted = false;
    
    while (!sorted) {
      sorted = true;
      
      // Odd phase
      for (let i = 1; i < n - 1; i += 2) {
        this.addStep([i, i + 1]);
        
        if (this.compare(i, i + 1) > 0) {
          this.addStep(undefined, [i, i + 1]);
          this.swap(i, i + 1);
          sorted = false;
        }
      }
      
      // Even phase
      for (let i = 0; i < n - 1; i += 2) {
        this.addStep([i, i + 1]);
        
        if (this.compare(i, i + 1) > 0) {
          this.addStep(undefined, [i, i + 1]);
          this.swap(i, i + 1);
          sorted = false;
        }
      }
    }
    
    this.addStep(undefined, undefined, undefined, Array.from({length: n}, (_, i) => i));
    return this.steps;
  }

  cycleSort(): SortingStep[] {
    this.stats.timeComplexity = 'O(n²)';
    this.stats.spaceComplexity = 'O(1)';
    
    const n = this.array.length;
    
    for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
      let item = this.array[cycleStart];
      let pos = cycleStart;
      
      // Find position where we put the item
      for (let i = cycleStart + 1; i < n; i++) {
        this.addStep([cycleStart, i]);
        if (this.array[i].value < item.value) {
          pos++;
        }
        this.stats.comparisons++;
      }
      
      // If item is already in correct position
      if (pos === cycleStart) continue;
      
      // Skip duplicates
      while (item.value === this.array[pos].value) {
        pos++;
      }
      
      // Put the item to its correct position
      if (pos !== cycleStart) {
        this.addStep(undefined, [cycleStart, pos]);
        [item, this.array[pos]] = [this.array[pos], item];
        this.stats.swaps++;
      }
      
      // Rotate rest of the cycle
      while (pos !== cycleStart) {
        pos = cycleStart;
        
        for (let i = cycleStart + 1; i < n; i++) {
          this.addStep([pos, i]);
          if (this.array[i].value < item.value) {
            pos++;
          }
          this.stats.comparisons++;
        }
        
        while (item.value === this.array[pos].value) {
          pos++;
        }
        
        if (item.value !== this.array[pos].value) {
          this.addStep(undefined, [cycleStart, pos]);
          [item, this.array[pos]] = [this.array[pos], item];
          this.stats.swaps++;
        }
      }
    }
    
    this.addStep(undefined, undefined, undefined, Array.from({length: n}, (_, i) => i));
    return this.steps;
  }

  // Exotic Algorithms
  bitonicSort(): SortingStep[] {
    this.stats.timeComplexity = 'O(n log² n)';
    this.stats.spaceComplexity = 'O(log² n)';
    
    const n = this.array.length;
    // For simplicity, we'll implement a basic version
    this.bitonicSortHelper(0, n, true);
    
    this.addStep(undefined, undefined, undefined, Array.from({length: n}, (_, i) => i));
    return this.steps;
  }

  private bitonicSortHelper(low: number, cnt: number, dir: boolean): void {
    if (cnt > 1) {
      const k = Math.floor(cnt / 2);
      
      this.bitonicSortHelper(low, k, true);
      this.bitonicSortHelper(low + k, k, false);
      this.bitonicMerge(low, cnt, dir);
    }
  }

  private bitonicMerge(low: number, cnt: number, dir: boolean): void {
    if (cnt > 1) {
      const k = Math.floor(cnt / 2);
      
      for (let i = low; i < low + k; i++) {
        this.addStep([i, i + k]);
        
        const shouldSwap = dir ? 
          this.array[i].value > this.array[i + k].value : 
          this.array[i].value < this.array[i + k].value;
          
        if (shouldSwap) {
          this.addStep(undefined, [i, i + k]);
          this.swap(i, i + k);
        }
        this.stats.comparisons++;
      }
      
      this.bitonicMerge(low, k, dir);
      this.bitonicMerge(low + k, k, dir);
    }
  }

  pigeonholeSort(): SortingStep[] {
    this.stats.timeComplexity = 'O(n + range)';
    this.stats.spaceComplexity = 'O(range)';
    
    const n = this.array.length;
    const minVal = Math.min(...this.array.map(el => el.value));
    const maxVal = Math.max(...this.array.map(el => el.value));
    const range = maxVal - minVal + 1;
    
    // Create pigeonholes
    const holes: ArrayElement[][] = Array.from({length: range}, () => []);
    
    // Put elements into pigeonholes
    for (let i = 0; i < n; i++) {
      const holeIndex = this.array[i].value - minVal;
      holes[holeIndex].push(this.array[i]);
      this.addStep([i]);
      this.stats.comparisons++;
    }
    
    // Put elements back into array
    let index = 0;
    for (let i = 0; i < range; i++) {
      for (let j = 0; j < holes[i].length; j++) {
        this.array[index] = holes[i][j];
        this.addStep(undefined, [index]);
        this.stats.swaps++;
        index++;
      }
    }
    
    this.addStep(undefined, undefined, undefined, Array.from({length: n}, (_, i) => i));
    return this.steps;
  }

  pancakeSort(): SortingStep[] {
    this.stats.timeComplexity = 'O(n²)';
    this.stats.spaceComplexity = 'O(1)';
    
    const n = this.array.length;
    
    for (let currSize = n; currSize > 1; currSize--) {
      // Find index of maximum element
      let maxIdx = 0;
      for (let i = 1; i < currSize; i++) {
        this.addStep([maxIdx, i]);
        if (this.compare(i, maxIdx) > 0) {
          maxIdx = i;
        }
      }
      
      // Move maximum element to beginning if it's not already there
      if (maxIdx !== 0) {
        this.flip(maxIdx);
      }
      
      // Move maximum element to its correct position
      this.flip(currSize - 1);
      
      this.addStep(undefined, undefined, undefined, [currSize - 1]);
    }
    
    this.addStep(undefined, undefined, undefined, Array.from({length: n}, (_, i) => i));
    return this.steps;
  }

  private flip(k: number): void {
    let start = 0;
    while (start < k) {
      this.addStep(undefined, [start, k]);
      this.swap(start, k);
      start++;
      k--;
    }
  }

  stoogeSort(): SortingStep[] {
    this.stats.timeComplexity = 'O(n^2.7)';
    this.stats.spaceComplexity = 'O(n)';
    
    this.stoogeSortHelper(0, this.array.length - 1);
    
    this.addStep(undefined, undefined, undefined, Array.from({length: this.array.length}, (_, i) => i));
    return this.steps;
  }

  private stoogeSortHelper(l: number, h: number): void {
    if (l >= h) return;
    
    this.addStep([l, h]);
    
    // If first element is smaller than last, swap them
    if (this.compare(l, h) > 0) {
      this.addStep(undefined, [l, h]);
      this.swap(l, h);
    }
    
    // If there are more than 2 elements
    if (h - l + 1 > 2) {
      const t = Math.floor((h - l + 1) / 3);
      
      // Recursively sort first 2/3 elements
      this.stoogeSortHelper(l, h - t);
      
      // Recursively sort last 2/3 elements
      this.stoogeSortHelper(l + t, h);
      
      // Recursively sort first 2/3 elements again
      this.stoogeSortHelper(l, h - t);
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
    id: 'counting',
    name: 'Counting Sort',
    description: 'Non-comparison based sorting that counts occurrences of each distinct element.',
    timeComplexity: 'O(n + k)',
    spaceComplexity: 'O(k)',
    category: 'linear' as const
  },
  {
    id: 'radix',
    name: 'Radix Sort',
    description: 'Non-comparison based sorting that processes digits from least to most significant.',
    timeComplexity: 'O(d × (n + k))',
    spaceComplexity: 'O(n + k)',
    category: 'linear' as const
  },
  {
    id: 'bucket',
    name: 'Bucket Sort',
    description: 'Distributes elements into buckets, sorts each bucket, then concatenates results.',
    timeComplexity: 'O(n + k)',
    spaceComplexity: 'O(n × k)',
    category: 'linear' as const
  },
  {
    id: 'shell',
    name: 'Shell Sort',
    description: 'Generalization of insertion sort that allows exchange of far apart elements.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    category: 'variants' as const
  },
  {
    id: 'comb',
    name: 'Comb Sort',
    description: 'Improvement over bubble sort that eliminates small values near the end.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    category: 'variants' as const
  },
  {
    id: 'gnome',
    name: 'Gnome Sort',
    description: 'Simple sorting algorithm similar to insertion sort but moving elements to their proper place by swaps.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    category: 'variants' as const
  },
  {
    id: 'oddeven',
    name: 'Odd-Even Sort',
    description: 'Parallel sorting algorithm that compares odd and even indexed pairs alternately.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    category: 'variants' as const
  },
  {
    id: 'cycle',
    name: 'Cycle Sort',
    description: 'In-place sorting algorithm that minimizes the number of writes to memory.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    category: 'variants' as const
  },
  {
    id: 'bitonic',
    name: 'Bitonic Sort',
    description: 'Parallel sorting algorithm that works well on parallel machines.',
    timeComplexity: 'O(n log² n)',
    spaceComplexity: 'O(log² n)',
    category: 'exotic' as const
  },
  {
    id: 'pigeonhole',
    name: 'Pigeonhole Sort',
    description: 'Suitable for sorting lists where the number of elements is close to the range of values.',
    timeComplexity: 'O(n + range)',
    spaceComplexity: 'O(range)',
    category: 'exotic' as const
  },
  {
    id: 'pancake',
    name: 'Pancake Sort 🥞',
    description: 'Sorting algorithm that can only flip elements from one end, like flipping pancakes!',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    category: 'exotic' as const
  },
  {
    id: 'stooge',
    name: 'Stooge Sort',
    description: 'Recursive sorting algorithm with poor time complexity but interesting approach.',
    timeComplexity: 'O(n^2.7)',
    spaceComplexity: 'O(n)',
    category: 'exotic' as const
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
