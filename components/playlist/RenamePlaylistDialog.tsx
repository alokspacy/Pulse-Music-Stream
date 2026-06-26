'use client';

import { renamePlaylist } from '@/lib/actions/playlists';
import { useToastStore } from '@/store/toastStore';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  playlistId: string;
  initialName: string;
  initialDescription?: string;
}

export function RenamePlaylistDialog({
  open,
  onClose,
  playlistId,
  initialName,
  initialDescription,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <DialogBody
          onClose={onClose}
          playlistId={playlistId}
          initialName={initialName}
          initialDescription={initialDescription}
        />
      )}
    </AnimatePresence>
  );
}

interface DialogBodyProps {
  onClose: () => void;
  playlistId: string;
  initialName: string;
  initialDescription?: string;
}

function DialogBody({
  onClose,
  playlistId,
  initialName,
  initialDescription,
}: DialogBodyProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription ?? '');
  const [pending, startTransition] = useTransition();
  const nameRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const pushToast = useToastStore((s) => s.push);

  useEffect(() => {
    const id = window.setTimeout(() => {
      nameRef.current?.focus();
      nameRef.current?.select();
    }, 50);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    startTransition(async () => {
      try {
        await renamePlaylist({
          id: playlistId,
          name: trimmed,
          description: description.trim() || undefined,
        });
        pushToast('Playlist updated');
        onClose();
        router.refresh();
      } catch {
        pushToast('Could not update playlist');
      }
    });
  };

  return (
    <>
      <motion.div
        key="rename-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        key="rename-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Edit playlist details"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        className="fixed left-1/2 top-1/2 z-61 w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-white/10 bg-bg-elevated-base shadow-2xl">
        <form className="flex flex-col" onSubmit={onSubmit}>
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
            <h2 className="text-lg font-bold text-text-base">Edit details</h2>
            <button
              type="button"
              aria-label="Close dialog"
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full text-text-subdued transition hover:bg-white/10 hover:text-text-base">
              <X size={18} />
            </button>
          </div>
          <div className="flex flex-col gap-4 px-5 py-5">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-text-base">Name</span>
              <input
                ref={nameRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={120}
                required
                className="rounded-sm border border-white/15 bg-white/5 px-3 py-2 text-sm text-text-base placeholder:text-text-subdued outline-none focus:border-white/60"
                placeholder="My playlist"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-text-base">
                Description{' '}
                <span className="text-xs font-normal text-text-subdued">
                  (optional)
                </span>
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={300}
                rows={3}
                className="resize-none rounded-sm border border-white/15 bg-white/5 px-3 py-2 text-sm text-text-base placeholder:text-text-subdued outline-none focus:border-white/60"
                placeholder="Give your playlist a short description."
              />
            </label>
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-white/5 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={pending}
              className="rounded-full px-4 py-2 text-sm font-semibold text-text-subdued transition hover:text-text-base disabled:opacity-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending || !name.trim()}
              className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50">
              {pending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
}
