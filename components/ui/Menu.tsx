'use client';

import { ui } from '@/lib/styles';
import { cn } from '@/lib/utils';
import { Children, useEffect, useRef, useState, type ReactNode } from 'react';

function useMenuDismiss(
  ref: React.RefObject<HTMLElement | null>,
  open: boolean,
  onClose: () => void,
) {
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, ref]);
}

interface MenuProps {
  trigger: (props: {
    onClick: () => void;
    'aria-haspopup': 'menu';
    'aria-expanded': boolean;
  }) => ReactNode;
  children: ReactNode | ((close: () => void) => ReactNode);
  panelClassName?: string;
}

export function Menu({ trigger, children, panelClassName }: MenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const close = () => setOpen(false);

  useMenuDismiss(ref, open, close);

  return (
    <div className="relative" ref={ref}>
      {trigger({
        onClick: () => setOpen((v) => !v),
        'aria-expanded': open,
        'aria-haspopup': 'menu',
      })}
      {open && (
        <MenuPanel className={panelClassName}>
          {typeof children === 'function' ? children(close) : children}
        </MenuPanel>
      )}
    </div>
  );
}

export function MenuPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div role="menu" className={cn(ui.menuPopover, className)}>
      {children}
    </div>
  );
}

export function MenuItem({
  children,
  onClick,
  destructive,
  className,
}: {
  children: ReactNode;
  onClick: () => void;
  destructive?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        destructive ? ui.menuItemDestructive : ui.menuItem,
        className,
      )}>
      {children}
    </button>
  );
}

export interface MenuItemDef {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  destructive?: boolean;
}

interface ItemMenuProps {
  trigger: (props: {
    onClick: () => void;
    'aria-haspopup': 'menu';
    'aria-expanded': boolean;
  }) => ReactNode;
  items: MenuItemDef[];
  panelClassName?: string;
}

// Flat list menu
export function ItemMenu({ trigger, items, panelClassName }: ItemMenuProps) {
  return (
    <Menu trigger={trigger} panelClassName={panelClassName}>
      {(close) =>
        items.map((item, idx) => (
          <MenuItem
            key={`${item.label}-${idx}`}
            destructive={item.destructive}
            onClick={() => {
              close();
              item.onClick();
            }}>
            {item.icon}
            <span className="truncate">{item.label}</span>
          </MenuItem>
        ))
      }
    </Menu>
  );
}
