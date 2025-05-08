'use client';

import { useState, useEffect } from 'react';
// import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../types';
import { useRouter } from 'next/navigation';

interface ContributorAvatarsProps {
  contributors: string[];
  maxDisplay?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function ContributorAvatars({ 
  contributors, 
  maxDisplay = 3,
  size = 'md' 
}: ContributorAvatarsProps) {
  const { getUserInfo } = useAuth();
  const [users, setUsers] = useState<Map<string, User | null>>(new Map());
  const router = useRouter();
  
  useEffect(() => {
    const fetchUsers = async () => {
      const usersMap = new Map<string, User | null>();
      
      for (const userId of contributors) {
        const user = await getUserInfo(userId);
        usersMap.set(userId, user);
      }
      
      setUsers(usersMap);
    };
    
    if (contributors && contributors.length > 0) {
      fetchUsers();
    }
  }, [contributors, getUserInfo]);
  
  const getSize = () => {
    switch(size) {
      case 'sm': return 'w-6 h-6';
      case 'lg': return 'w-10 h-10';
      default: return 'w-8 h-8';
    }
  };
  
  const getOffset = () => {
    switch(size) {
      case 'sm': return '-ml-2';
      case 'lg': return '-ml-3';
      default: return '-ml-2.5';
    }
  };
  
  const sizeCls = getSize();
  const offsetCls = getOffset();
  
  if (!contributors || contributors.length === 0) {
    return null;
  }
  
  const displayContributors = contributors.slice(0, maxDisplay);
  const remainingCount = contributors.length - maxDisplay;
  
  return (
    <div className="flex">
      {displayContributors.map((userId, index) => {
        const user = users.get(userId);
        return (
          <div 
            key={userId} 
            onClick={() => router.push(`/users/${userId}`)}
            className={`${index > 0 ? offsetCls : ''} block ${sizeCls} rounded-full border-2 border-background dark:border-gray-800 transition-transform hover:transform hover:scale-110 hover:z-10 relative cursor-pointer`}
            style={{ zIndex: displayContributors.length - index }}
          >
            {user && user.photoURL ? (
              <Image 
                src={user.photoURL} 
                alt={user.displayName || 'Người dùng'}
                className="rounded-full object-cover"
                width={size === 'sm' ? 24 : size === 'lg' ? 40 : 32}
                height={size === 'sm' ? 24 : size === 'lg' ? 40 : 32}
              />
            ) : (
              <div className={`${sizeCls} rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold`}>
                {user && user.displayName ? user.displayName.charAt(0).toUpperCase() : '?'}
              </div>
            )}
          </div>
        );
      })}
      
      {remainingCount > 0 && (
        <div className={`${offsetCls} ${sizeCls} rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-medium border-2 border-background dark:border-gray-800 relative`}
             style={{ zIndex: 0 }}>
          +{remainingCount}
        </div>
      )}
    </div>
  );
} 