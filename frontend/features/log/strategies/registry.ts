import { LogType, ILogRendererStrategy, ILogDrawerStrategy, LogDetails } from '@/features/log/types';
import { FeedingLogRenderer } from './FeedingLogRenderer';
import { GrowthLogRenderer } from './GrowthLogRenderer';

type RendererFactory = (details: LogDetails) => ILogRendererStrategy;
type DrawerFactory = (details: LogDetails) => ILogDrawerStrategy;

const registry = new Map<LogType, RendererFactory>();
const drawerRegistry = new Map<LogType, DrawerFactory>();

registry.set(LogType.Feeding, (details) => new FeedingLogRenderer(details as any));
drawerRegistry.set(LogType.Feeding, (details) => new FeedingLogRenderer(details as any));

registry.set(LogType.Growth, (details) => new GrowthLogRenderer(details as any));
drawerRegistry.set(LogType.Growth, (details) => new GrowthLogRenderer(details as any));

export function getRenderer(type: LogType, details: LogDetails): ILogRendererStrategy {
  const factory = registry.get(type);
  if (!factory) {
    throw new Error(`No renderer registered for LogType: ${type}`);
  }
  return factory(details);
}

export function getDrawerRenderer(type: LogType, details: LogDetails): ILogDrawerStrategy {
  const factory = drawerRegistry.get(type);
  if (!factory) {
    throw new Error(`No drawer renderer registered for LogType: ${type}`);
  }
  return factory(details);
}
