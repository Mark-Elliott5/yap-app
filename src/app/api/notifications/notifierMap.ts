import { EventNotifier } from 'ts-sse';

type SyncEvents = EventNotifier<{
  update: {
    data: 'true' | 'false';
    event: 'update';
  };
  complete: {
    data: string;
    event: 'update';
  };
  close: {
    data: never;
  };
  error: {
    data: never;
  };
}>;

export const notifierUserIdMap: Map<string, SyncEvents> = new Map();
