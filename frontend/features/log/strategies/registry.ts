import { LogType, ILogRendererStrategy, ILogDrawerStrategy, FeedingDetails } from '@/features/log/types';
import { FeedingLogRenderer } from './FeedingLogRenderer';

type RendererFactory = (details: FeedingDetails) => ILogRendererStrategy;
type DrawerFactory = (details: FeedingDetails) => ILogDrawerStrategy;

const registry = new Map<LogType, RendererFactory>();
const drawerRegistry = new Map<LogType, DrawerFactory>();

registry.set(LogType.Feeding, (details) => new FeedingLogRenderer(details));
drawerRegistry.set(LogType.Feeding, (details) => new FeedingLogRenderer(details));

export function getRenderer(type: LogType, details: FeedingDetails): ILogRendererStrategy {
  const factory = registry.get(type);
  if (!factory) {
    throw new Error(`No renderer registered for LogType: ${type}`);
  }
  return factory(details);
}

export function getDrawerRenderer(type: LogType, details: FeedingDetails): ILogDrawerStrategy {
  const factory = drawerRegistry.get(type);
  if (!factory) {
    throw new Error(`No drawer renderer registered for LogType: ${type}`);
  }
  return factory(details);
}
