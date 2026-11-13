import type { ReactElement } from 'react';
import { Tag } from './Tag.tsx';

export interface TaskListProps {
  items: {
    name: string;
    href: string;
    detail?: string;
    status?: 'ok' | 'warn' | 'error';
    word: string;
  }[];
  sprite?: string;
}

/** TaskList: the steps of a long job, each with its state in a Tag. */
export function TaskList({ items, sprite }: TaskListProps): ReactElement {
  return (
    <ul className="feitio-task-list">
      {items.map((i) => (
        <li key={i.href}>
          <span className="name">
            <a className="feitio-link" href={i.href}>
              {i.name}
            </a>
            {i.detail && <small>{i.detail}</small>}
          </span>
          <Tag status={i.status} sprite={sprite}>
            {i.word}
          </Tag>
        </li>
      ))}
    </ul>
  );
}
