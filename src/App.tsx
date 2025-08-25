import './index.css';
import './App.css';

import { useState } from 'react';
import TeamLayout from './components/TeamLayout';
import { agents, smokes } from './data/agents';
import { maps } from './data/maps';

import ascent from './assets/Loading_Screen_Ascent.webp';
import bind from './assets/Loading_Screen_Bind.webp';
import breeze from './assets/Loading_Screen_Breeze.webp';
import corrode from './assets/Loading_Screen_Corrode.webp'
import fracture from './assets/Loading_Screen_Fracture.webp';
import haven from './assets/Loading_Screen_Haven.webp';
import icebox from './assets/Loading_Screen_Icebox.webp';
import lotus from './assets/Loading_Screen_Lotus.webp';
import pearl from './assets/Loading_Screen_Pearl.webp';
import split from './assets/Loading_Screen_Split.webp';
import sunset from './assets/Loading_Screen_Sunset.webp';
import abyss from './assets/Loading_Screen_Abyss.webp';

// The main App component that renders the lobby layout
const App = () => {
  const TEAM_SIZE = 5;

  // State to manage player data
  const [attackers, setAttackers] = useState([]);
  const [defenders, setDefenders] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [currentMap, setCurrentMap] = useState('Ascent');

  const getRandomInteger = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)

    return Math.floor(Math.random() * (max - min)) + min
  }

  // Helper function to shuffle an array
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Function to randomize all agents for existing players
  const handleRandomizeAll = () => {
    const randomizeTeamAgents = (players) => {
      if (players.length === 0) return [];

      const newPlayers = [...players];
      const nonSmokes = agents.filter(agent => !smokes.includes(agent));
      const availableSmokes = shuffleArray(smokes);

      // Assign one smoker to a random player
      const smokerIndex = Math.floor(Math.random() * newPlayers.length);
      const smokerAgent = availableSmokes[0];
      const assignedAgents = new Set([smokerAgent]);
      newPlayers[smokerIndex].agent = smokerAgent;

      // Assign the rest of the agents, ensuring no duplicates
      const shuffledAgents = shuffleArray(nonSmokes);
      let agentIndex = 0;
      for (let i = 0; i < newPlayers.length; i++) {
        if (i === smokerIndex) continue;

        let selectedAgent = shuffledAgents[agentIndex];
        while (assignedAgents.has(selectedAgent)) {
          agentIndex++;
          selectedAgent = shuffledAgents[agentIndex];
        }
        newPlayers[i].agent = selectedAgent;
        assignedAgents.add(selectedAgent);
        agentIndex++;
      }
      return newPlayers;
    };

    setAttackers(randomizeTeamAgents);
    setDefenders(randomizeTeamAgents);
  };

  // Function to randomize the map
  const handleRandomizeMap = () => {
    const randomMap = maps[Math.floor(Math.random() * maps.length)];
    setCurrentMap(randomMap);
  };

  // Object to map map names to the correct image files.
  const mapImages = {
    'Abyss': abyss,
    'Ascent': ascent,
    'Bind': bind,
    'Breeze': breeze,
    'Corrode': corrode,
    'Fracture': fracture,
    'Haven': haven,
    'Icebox': icebox,
    'Lotus': lotus,
    'Pearl': pearl,
    'Split': split,
    'Sunset': sunset,
  };

  // Construct the map image URL using the assets folder and map name
  const mapImagePath = `./assets/Loading_Screen_${currentMap}.jpg`;

  // Function to add a new player to a team
  const handleAddPlayer = (team) => {
    // Check if the input name is not empty
    if (!newPlayerName.trim()) {
      return; // Do nothing if the name is just spaces
    }

    const newPlayer = {
      id: Math.random(), // Simple unique ID
      name: newPlayerName.trim(),
      agent: '?',
    };

    if (team === 'ATTACKERS' && attackers.length < TEAM_SIZE) {
      setAttackers([...attackers, newPlayer]);
      setNewPlayerName(''); // Clear the input field after adding
    } else if (team === 'DEFENDERS' && defenders.length < TEAM_SIZE) {
      setDefenders([...defenders, newPlayer]);
      setNewPlayerName(''); // Clear the input field after adding
    }
  };

  // Function to update a player's name
  const handleUpdatePlayer = (team, id, newName) => {
    const updater = (prevPlayers) => {
      return prevPlayers.map((player) =>
        player.id === id ? { ...player, name: newName } : player
      );
    };

    if (team === 'ATTACKERS') {
      setAttackers(updater);
    } else {
      setDefenders(updater);
    }
  };

  return (
    <div className="flex items-center justify-center w-full w-min-h-screen bg-gray-900 text-white font-sans p-4">
      <div className="w-full max-w-7xl mx-auto rounded-xl p-4 sm:p-8 border border-gray-700/50 bg-gray-800/60 shadow-2xl backdrop-filter backdrop-blur-lg">
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-6 text-gray-100 drop-shadow-lg">
          Valorant Randomizer
        </h1>

        {/* Display the randomized map with thumbnail */}
        <div className="text-center mb-6">
          <img
            src={mapImages[currentMap]}
            alt={`Thumbnail for ${currentMap}`}
            className="mx-auto rounded-lg shadow-lg border border-gray-700/50 mb-4"
            onError={(e) => {
              e.target.src = `https://placehold.co/300x150/2d3748/fff?text=${currentMap}`;
              console.error(`Failed to load image for map: ${currentMap}`);
            }}
          />
          <h2 className="text-2xl font-bold text-green-400">
            Map: {currentMap}
          </h2>
        </div>

        {/* Dynamic player input form */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <input
            type="text"
            placeholder="Enter player name"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 border border-transparent focus:border-indigo-600 transition-all duration-200"
          />
          <button
            onClick={() => handleAddPlayer('ATTACKERS')}
            disabled={!newPlayerName.trim()}
            className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Attackers
          </button>
          <button
            onClick={() => handleAddPlayer('DEFENDERS')}
            disabled={!newPlayerName.trim()}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Defenders
          </button>
        </div>

        {/* New button to randomize all agents */}
        <div className="text-center mb-6">
          <button
            onClick={handleRandomizeAll}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md shadow-md transition-colors duration-200"
          >
            Randomize All Agents
          </button>
          <button
            onClick={handleRandomizeMap}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-md transition-colors duration-200 ml-4"
          >
            Randomize Map
          </button>
        </div>

        {/* Main layout container for teams */}
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Attackers Team */}
          <TeamLayout
            teamName="ATTACKERS"
            players={attackers}
            onUpdatePlayer={handleUpdatePlayer}
          />

          {/* Defenders Team */}
          <TeamLayout
            teamName="DEFENDERS"
            players={defenders}
            onUpdatePlayer={handleUpdatePlayer}
          />
        </div>

        {/* Footer/Info section */}
        <div className="text-center mt-8 text-gray-500 text-sm font-medium">
          <p>Enter a name above and add players to a team.</p>
        </div>
      </div>
    </div>
  );
};

export default App;
