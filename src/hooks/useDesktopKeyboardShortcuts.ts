
import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}

export const useDesktopKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const getShortcuts = useCallback((): KeyboardShortcut[] => {
    if (!profile) return [];

    const baseShortcuts: KeyboardShortcut[] = [
      {
        key: 'h',
        altKey: true,
        action: () => navigate(`/${profile.role}`),
        description: 'Go to Dashboard'
      },
      {
        key: 'p',
        altKey: true,
        action: () => navigate(`/${profile.role}/profile`),
        description: 'Go to Profile'
      },
      {
        key: 's',
        altKey: true,
        action: () => navigate(`/${profile.role}/subscription`),
        description: 'Go to Subscription'
      },
      {
        key: '/',
        ctrlKey: true,
        action: () => {
          const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
        },
        description: 'Focus Search'
      }
    ];

    // Role-specific shortcuts
    if (profile.role === 'coach') {
      baseShortcuts.push(
        {
          key: 'c',
          altKey: true,
          action: () => navigate('/coach/content'),
          description: 'Go to Content'
        },
        {
          key: 'l',
          altKey: true,
          action: () => navigate('/coach/clients'),
          description: 'Go to Clients'
        },
        {
          key: 'a',
          altKey: true,
          action: () => navigate('/coach/analytics'),
          description: 'Go to Analytics'
        }
      );
    } else if (profile.role === 'client') {
      baseShortcuts.push(
        {
          key: 'b',
          altKey: true,
          action: () => navigate('/client/content'),
          description: 'Browse Content'
        },
        {
          key: 'g',
          altKey: true,
          action: () => navigate('/client/goals'),
          description: 'Go to Goals'
        },
        {
          key: 'r',
          altKey: true,
          action: () => navigate('/client/progress'),
          description: 'View Progress'
        }
      );
    }

    return baseShortcuts;
  }, [navigate, profile]);

  useEffect(() => {
    const shortcuts = getShortcuts();
    
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when user is typing in inputs
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement) {
        return;
      }

      for (const shortcut of shortcuts) {
        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          !!event.ctrlKey === !!shortcut.ctrlKey &&
          !!event.altKey === !!shortcut.altKey &&
          !!event.shiftKey === !!shortcut.shiftKey
        ) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [getShortcuts]);

  return { shortcuts: getShortcuts() };
};
