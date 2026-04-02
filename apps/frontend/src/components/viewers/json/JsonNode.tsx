import { useState, useCallback } from 'react';
import { Copy, Check, ChevronRight, ChevronDown } from 'lucide-react';

export interface Selection {
  path: string;
  depth: 'value' | 'key+value';
}

interface JsonNodeProps {
  name: string | null;        // key name, null for root
  value: unknown;
  path: string;
  depth: number;
  collapsed: Set<string>;
  selection: Selection | null;
  onToggleCollapse: (path: string) => void;
  onTapContent: (path: string) => void;
}

function isExpandable(value: unknown): value is Record<string, unknown> | unknown[] {
  return value !== null && typeof value === 'object';
}

function getSummary(value: unknown): string {
  if (Array.isArray(value)) return `[${value.length} item${value.length !== 1 ? 's' : ''}]`;
  if (typeof value === 'object' && value !== null) {
    const keys = Object.keys(value);
    return `{${keys.length} key${keys.length !== 1 ? 's' : ''}}`;
  }
  return '';
}

function renderPrimitive(value: unknown): JSX.Element {
  if (value === null) return <span className="text-foreground/40">null</span>;
  if (typeof value === 'boolean')
    return <span className="text-amber-600 dark:text-amber-400">{String(value)}</span>;
  if (typeof value === 'number')
    return <span className="text-cyan-700 dark:text-cyan-400">{String(value)}</span>;
  if (typeof value === 'string')
    return <span className="text-green-700 dark:text-green-400">"{value}"</span>;
  return <span>{String(value)}</span>;
}

export function JsonNode({
  name,
  value,
  path,
  depth,
  collapsed,
  selection,
  onToggleCollapse,
  onTapContent,
}: JsonNodeProps) {
  const [copied, setCopied] = useState(false);
  const expandable = isExpandable(value);
  const isCollapsed = collapsed.has(path);
  const isSelected = selection?.path === path;
  const highlightValue = isSelected && selection?.depth === 'value';
  const highlightKeyValue = isSelected && selection?.depth === 'key+value';
  const indent = depth * 2;

  const handleCopy = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    let text: string;
    if (selection?.depth === 'key+value' && name !== null) {
      text = `"${name}": ${JSON.stringify(value, null, 2)}`;
    } else {
      text = JSON.stringify(value, null, 2);
    }
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [value, name, selection?.depth]);

  const entries = expandable
    ? Array.isArray(value)
      ? value.map((v, i) => ({ key: String(i), value: v }))
      : Object.entries(value as Record<string, unknown>).map(([k, v]) => ({ key: k, value: v }))
    : [];

  const isArray = Array.isArray(value);
  const openBracket = isArray ? '[' : '{';
  const closeBracket = isArray ? ']' : '}';

  // Highlight styles
  const highlightClass = (highlightValue || highlightKeyValue)
    ? 'bg-blue-500/10 dark:bg-blue-500/15 border-l-2 border-blue-500'
    : '';

  if (!expandable) {
    // Leaf node: "key": value
    return (
      <div
        className={`flex items-center min-h-[28px] cursor-pointer select-none ${highlightKeyValue ? highlightClass : ''}`}
        onClick={() => onTapContent(path)}
      >
        <span style={{ paddingLeft: `${indent}ch` }} className="flex-1 flex items-center gap-0">
          {/* Gutter spacer — no arrow for leaf nodes */}
          <span className="w-[28px] shrink-0" />
          <span className={highlightValue && !highlightKeyValue ? 'bg-blue-500/10 dark:bg-blue-500/15' : ''}>
            {name !== null && (
              <><span className="text-purple-700 dark:text-purple-400">"{name}"</span><span className="text-foreground/50">: </span></>
            )}
            {renderPrimitive(value)}
          </span>
        </span>
        {isSelected && (
          <button
            onClick={handleCopy}
            className="shrink-0 w-[28px] h-[28px] flex items-center justify-center rounded-full hover:bg-foreground/10 mr-2"
          >
            {copied
              ? <Check size={16} className="text-green-500" />
              : <Copy size={16} className="text-foreground/40" />}
          </button>
        )}
      </div>
    );
  }

  // Expandable node: object or array
  return (
    <div>
      {/* Opening line: arrow + "key": { */}
      <div
        className={`flex items-center min-h-[28px] select-none ${highlightKeyValue ? highlightClass : ''}`}
      >
        <span style={{ paddingLeft: `${indent}ch` }} className="flex-1 flex items-center gap-0">
          {/* Collapse arrow — separate tap zone */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleCollapse(path); }}
            className="w-[28px] h-[44px] shrink-0 flex items-center justify-center cursor-pointer"
          >
            {isCollapsed
              ? <ChevronRight size={14} className="text-foreground/40" />
              : <ChevronDown size={14} className="text-foreground/40" />}
          </button>
          {/* Content — tap to cycle highlight */}
          <span className={`cursor-pointer ${highlightValue && !highlightKeyValue ? 'bg-blue-500/10 dark:bg-blue-500/15' : ''}`} onClick={() => onTapContent(path)}>
            {name !== null && (
              <><span className="text-purple-700 dark:text-purple-400">"{name}"</span><span className="text-foreground/50">: </span></>
            )}
            {isCollapsed
              ? <span className="text-foreground/40">{openBracket} {getSummary(value)} {closeBracket}</span>
              : <span className="text-foreground/50">{openBracket}</span>}
          </span>
        </span>
        {isSelected && (
          <button
            onClick={handleCopy}
            className="shrink-0 w-[28px] h-[28px] flex items-center justify-center rounded-full hover:bg-foreground/10 mr-2"
          >
            {copied
              ? <Check size={16} className="text-green-500" />
              : <Copy size={16} className="text-foreground/40" />}
          </button>
        )}
      </div>
      {/* Children */}
      {!isCollapsed && (
        <div className={highlightValue || highlightKeyValue ? highlightClass : ''}>
          {entries.map(({ key, value: childValue }) => (
            <JsonNode
              key={key}
              name={isArray ? null : key}
              value={childValue}
              path={`${path}.${key}`}
              depth={depth + 1}
              collapsed={collapsed}
              selection={selection}
              onToggleCollapse={onToggleCollapse}
              onTapContent={onTapContent}
            />
          ))}
        </div>
      )}
      {/* Closing bracket */}
      {!isCollapsed && (
        <div
          className={`min-h-[28px] flex items-center ${highlightValue || highlightKeyValue ? highlightClass : ''}`}
          style={{ paddingLeft: `${indent + 3.5}ch` }}
        >
          <span className="text-foreground/50">{closeBracket}</span>
        </div>
      )}
    </div>
  );
}
