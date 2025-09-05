# Sortify
Learn Any Sorting Algorithms in seconds hereeeeeeeeeeeeeeee!

# Sorting Visualizer 🚀
A modern, interactive Sorting Algorithm Visualizer built with React and TypeScript, featuring smooth animations, multiple algorithms, real-time performance metrics, and a stunning light/dark mode UI.

# 🔹 Features
Core Features
Visualize 6+ sorting algorithms with step-by-step animations

Basic: Bubble, Selection, Insertion

Advanced: Merge, Quick, Heap

Fun/Variants: Bogo Sort, Cocktail Shaker Sort, Shell Sort, etc.

Real-time performance metrics: comparisons and swaps

Interactive controls: choose algorithm, array size (10-100), animation speed (10-500ms), shuffle array

Auto-scroll: page scrolls down to the visualization area when sorting starts

Color-coded states: comparisons, swaps, sorted elements

# Design & UI
Modern, responsive interface optimized for desktop and mobile

Light/Dark mode toggle with smooth transitions (300-500ms)

Glass-morphism & gradient backgrounds

Interactive algorithm cards with hover and selection animations

Smooth bar animations using spring-based transitions and color interpolation

# ⚡ Live Preview


# 🛠️ Installation
bash
Copy
Edit
# Clone the repository
git clone <your-repo-link>
cd sorting-visualizer

# Install dependencies
npm install
npm add @clerk/clerk-react@latest framer-motion@latest react-hot-toast@latest mongoose@latest

# Start the development server
npm run dev
🗂️ Project Structure
pgsql
Copy
Edit
src/
├─ types/index.ts
├─ algorithms/sortingAlgorithms.ts
├─ components/
│  ├─ Controls.tsx
│  ├─ VisualizationArea.tsx
│  ├─ StatsPanel.tsx
│  └─ SortingVisualizer.tsx
├─ App.tsx
└─ index.css
# 🎨 Usage
Open the app and select a sorting algorithm.

Adjust array size and animation speed using the sliders.

# Click Start:

Page auto-scrolls to the visualization area

Bars animate step-by-step showing comparisons, swaps, and sorted elements

Toggle Light/Dark mode anytime via the top-right button.

# 🔧 Upcoming Features
Clerk authentication for user-specific settings

MongoDB persistence for saving user preferences and session data

# 📌 Notes / Fixes
Fixed SortingVisualizer constructor error by using the correct imported alias SortingEngine.

Smooth auto-scroll added when the sorting starts.

Light/Dark mode implemented with smooth transitions for full UI consistency.

# 👨‍💻 Tech Stack
Frontend: React, TypeScript, Framer Motion

Styling: CSS (Glass-morphism, gradients, responsive design)

Backend (planned): Clerk, MongoDB

# 🌟 Demo Screenshots
<img width="1920" height="953" alt="Screenshot 2025-09-05 231924" src="https://github.com/user-attachments/assets/ca3bbde4-e281-4a06-bc99-a17487797716" />
<img width="1920" height="949" alt="Screenshot 2025-09-05 231950" src="https://github.com/user-attachments/assets/b5e4b1d4-52c7-43f9-a6e7-30dd7e13c2d2" />
<img width="1920" height="1026" alt="Screenshot 2025-09-05 232002" src="https://github.com/user-attachments/assets/1b8a2b54-af05-4604-8b62-16074cd73b5e" />



# 📜 License
Shrey_Goswami_License © 2025
