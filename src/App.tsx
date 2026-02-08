import { useState } from 'react';
import { HomePage } from './components/HomePage';
import { GroupRoom } from './components/GroupRoom';
import { projectId, publicAnonKey } from './utils/supabase/info';

type View = 'home' | 'group';

interface GroupData {
  name: string;
  code: string;
  userName: string;
  memberId: string;
}

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-090a6328`;

export default function App() {
  const [view, setView] = useState<View>('home');
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateGroup = async (userName: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const code = 'SYNC-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const groupName = `${userName}'s Group`;
      
      const response = await fetch(`${API_URL}/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ groupName, userName, code })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create group');
      }

      setGroupData({ 
        name: groupName, 
        code, 
        userName, 
        memberId: data.memberId 
      });
      setView('group');
    } catch (err) {
      console.error('Error creating group:', err);
      setError(err instanceof Error ? err.message : 'Failed to create group');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGroup = async (userName: string, code: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/groups/${code}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ userName })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join group');
      }

      setGroupData({ 
        name: data.group.name, 
        code, 
        userName, 
        memberId: data.memberId 
      });
      setView('group');
    } catch (err) {
      console.error('Error joining group:', err);
      setError(err instanceof Error ? err.message : 'Failed to join group');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    setView('home');
    setGroupData(null);
    setError(null);
  };

  return (
    <>
      {view === 'home' && (
        <HomePage 
          onCreateGroup={handleCreateGroup} 
          onJoinGroup={handleJoinGroup}
          isLoading={isLoading}
          error={error}
        />
      )}
      {view === 'group' && groupData && (
        <GroupRoom 
          groupName={groupData.name}
          groupCode={groupData.code}
          userName={groupData.userName}
          memberId={groupData.memberId}
          onBack={handleBackToHome}
        />
      )}
    </>
  );
}