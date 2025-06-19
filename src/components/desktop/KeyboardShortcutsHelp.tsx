
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Keyboard, Command } from 'lucide-react';
import { useDesktopKeyboardShortcuts } from '@/hooks/useDesktopKeyboardShortcuts';

export const KeyboardShortcutsHelp: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { shortcuts } = useDesktopKeyboardShortcuts();

  const formatShortcut = (shortcut: any) => {
    const keys = [];
    if (shortcut.ctrlKey) keys.push('Ctrl');
    if (shortcut.altKey) keys.push('Alt');
    if (shortcut.shiftKey) keys.push('Shift');
    keys.push(shortcut.key.toUpperCase());
    return keys;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hidden lg:flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <Keyboard className="w-4 h-4" />
          <span className="text-sm">Shortcuts</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these shortcuts to navigate quickly around the app.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {formatShortcut(shortcut).map((key, keyIndex) => (
                  <React.Fragment key={keyIndex}>
                    <Badge variant="outline" className="text-xs px-2 py-1">
                      {key}
                    </Badge>
                    {keyIndex < formatShortcut(shortcut).length - 1 && (
                      <span className="text-gray-400 text-xs">+</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Show this dialog</span>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs px-2 py-1">?</Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
