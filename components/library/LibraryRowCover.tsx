import { CoverImage } from '../ui/CoverImage';
import { LikedSongsCover } from '../ui/LikedSongsCover';
import { PlaylistCover } from '../ui/PlaylistCover';
import { LibraryRow } from '../../lib/actions/library';

interface LibraryRowCoverProp {
  row: LibraryRow;
  size?: number;
}

export function LibraryRowCover({ row, size = 48 }: LibraryRowCoverProp) {
  if (row.kind === 'liked') {
    return (
      <div
        className="shrink-0 overflow-hidden rounded-md"
        style={{
          width: size,
          height: size,
        }}>
        <LikedSongsCover
          className="h-full w-full"
          iconSize={Math.floor(size * 0.42)}
        />
      </div>
    );
  }

  // user playlist with no custom cover -> synthetic musci-note gradient.
  if (!row.imageUrl && row.kind === 'playlist') {
    return (
      <div
        className="shrink-0 overflow-hidden rounded-md bg-bg-elevated-highlight"
        style={{ width: size, height: size }}>
        <PlaylistCover
          className="h-full w-full"
          iconSize={Math.floor(size * 0.42)}
        />
      </div>
    );
  }

  // Album / Artist / playlist with a real image url
  if (row.imageUrl) {
    return (
      <CoverImage
        src={row.imageUrl}
        alt=""
        size={size}
        shape={row.kind == 'artist' ? 'circle' : 'rounded'}
        sizes={`${size}px`}
      />
    );
  }

  // Fallback: empty placehoder
  return (
    <div
      className="shrink-0 rounded-md bg-bg-elevated-highlight"
      style={{ width: size, height: size }}
    />
  );
}
