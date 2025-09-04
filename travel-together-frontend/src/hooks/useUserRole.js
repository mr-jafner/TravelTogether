import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

const useUserRole = (currentTrip) => {
  const { username, isLoggedIn } = useUser();
  const [userRole, setUserRole] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !username || !currentTrip) {
      setUserRole(null);
      setIsCreator(false);
      setIsParticipant(false);
      return;
    }

    // Check if user is creator based on created_by field or creator role in participants
    const isUserCreator = currentTrip.created_by === username || 
                         (currentTrip.participants && 
                          currentTrip.participants.some(p => 
                            (typeof p === 'string' ? p : p.name) === username && 
                            p.role === 'creator'));
    
    // Check if user is participant (either creator or regular participant)
    const isUserParticipant = currentTrip.participants && 
                             currentTrip.participants.some(p => 
                               (typeof p === 'string' ? p : p.name) === username);

    if (isUserCreator) {
      setUserRole('creator');
      setIsCreator(true);
      setIsParticipant(true); // Creators are also participants
    } else if (isUserParticipant) {
      setUserRole('participant');
      setIsCreator(false);
      setIsParticipant(true);
    } else {
      setUserRole(null);
      setIsCreator(false);
      setIsParticipant(false);
    }
  }, [username, isLoggedIn, currentTrip]);

  return {
    userRole,
    isCreator,
    isParticipant,
    canModifyTrip: isCreator, // Only creators can modify trip details
    canAddContent: isParticipant, // All participants can add activities/restaurants
    canDeleteContent: isParticipant, // All participants can delete content (for now)
    canViewTrip: isParticipant || currentTrip?.isPublic // Participants or if trip is public
  };
};

export default useUserRole;