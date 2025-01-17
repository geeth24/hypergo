import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EditShortcutModalProps {
  shortcode: string;
  currentUrl: string;
  onSave: (newUrl: string) => Promise<void>;
}

export function EditShortcutModal({ shortcode, currentUrl, onSave }: EditShortcutModalProps) {
  const [newUrl, setNewUrl] = useState(currentUrl);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(newUrl);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Shortcut</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Shortcut</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shortcode" className="text-right">
              Shortcode
            </Label>
            <Input id="shortcode" value={shortcode} className="col-span-3" disabled />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              URL
            </Label>
            <Input
              id="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save changes'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
