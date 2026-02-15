import { LogType, ILogRendererStrategy, FeedingDetails } from '@/features/log/types';
import { FeedingLogRenderer } from './FeedingLogRenderer';

type RendererFactory = (details: FeedingDetails) => ILogRendererStrategy;

const registry = new Map<LogType, RendererFactory>();

registry.set(LogType.Feeding, (details) => new FeedingLogRenderer(details));

export function getRenderer(type: LogType, details: FeedingDetails): ILogRendererStrategy {
  const factory = registry.get(type);
  if (!factory) {
    throw new Error(`No renderer registered for LogType: ${type}`);
  }
  return factory(details);
}
