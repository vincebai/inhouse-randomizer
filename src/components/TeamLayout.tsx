import { useState, useMemo, useRef } from 'react';

// Using inline SVGs instead of a library for simplicity and to avoid import issues
const Swords = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19.9 14.2-6.5-6.5C12.2 6.6 9.8 6.6 8.5 7.9L5 11.4c-.9.9-.9 2.4 0 3.3L8.5 18"></path><path d="m11.4 5-3.3 3.3c-.9.9-.9 2.4 0 3.3l6.5 6.5"></path><path d="m20.6 6.3-4.9-4.9c-.9-.9-2.4-.9-3.3 0L7.4 8.7c-.9.9-.9 2.4 0 3.3L12.3 17c.9.9 2.4.9 3.3 0L20.6 9.6c.9-.9.9-2.4 0-3.3Z"></path></svg>
);
const Shield = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);
const User = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const PlusCircle = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
);


const TEAM_SIZE = 5;

// Reusable component for a single player slot
const PlayerSlot = ({ player, onAddPlayer, onUpdatePlayer, teamName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(player?.name || '');
  const inputRef = useRef(null);

  const handleUpdate = () => {
    if (editedName.trim() && onUpdatePlayer) {
      onUpdatePlayer(teamName, player.id, editedName.trim());
    } else {
      setEditedName(player?.name || ''); // Revert on empty input
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      inputRef.current.blur();
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    // Use setTimeout to ensure the input field is rendered before focusing
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div className="flex items-center p-3 my-2 bg-gray-700/50 rounded-lg shadow-inner border border-gray-600/50 transition-colors duration-200 hover:bg-gray-600/50">
      <div className="flex-grow">
        {player ? (
          <>
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleUpdate}
                onKeyDown={handleKeyDown}
                className="w-full px-2 py-1 bg-gray-600 rounded-md text-white font-semibold text-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            ) : (
              <div
                className="font-semibold text-lg text-white cursor-pointer"
                onDoubleClick={handleDoubleClick}
              >
                {editedName}
              </div>
            )}
            <div className="text-sm text-gray-300 font-medium">{player.agent}</div>
          </>
        ) : (
          <div className="flex items-center text-gray-400 font-medium">
            <User size={16} className="mr-2" />
            <span>Open Slot</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Main layout component for a single team
const TeamLayout = ({ teamName, players, onAddPlayer, onUpdatePlayer }) => {
  const emptySlots = TEAM_SIZE - players.length;
  const emptySlotsArray = useMemo(() => Array.from({ length: emptySlots }), [emptySlots]);

  const teamIcon = teamName === 'ATTACKERS' ? (
    <Swords className="text-red-400" />
  ) : (
    <Shield className="text-blue-400" />
  );

  return (
    <div className="w-full lg:w-1/2 p-4">
      {/* Team Header */}
      <div className="flex items-center justify-center mb-4 py-2 px-4 rounded-lg bg-gray-800/80 shadow-md">
        {teamIcon}
        <h2 className="text-2xl font-bold ml-2 text-white">{teamName}</h2>
      </div>

      {/* Player Roster */}
      <div className="space-y-3">
        {players.map((player) => (
          <PlayerSlot
            key={player.id}
            player={player}
            teamName={teamName}
            onUpdatePlayer={onUpdatePlayer}
          />
        ))}
        {emptySlotsArray.map((_, index) => (
          <PlayerSlot key={`empty-${index}`} onAddPlayer={() => onAddPlayer(teamName)} />
        ))}
      </div>
    </div>
  );
};

export default TeamLayout;
