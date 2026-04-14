import { userService } from '@/lib/services/user/user.service.server';
import { growthService } from '@/lib/services/growth/growth.service.server';
import InsightPage from './InsightPage';

export default async function InsightPageRoute() {
  const userContext = await userService.getMyContext();

  if (!userContext?.families?.[0]?.babies?.[0]) {
    return <div>No baby found</div>;
  }

  const baby = userContext.families[0].babies[0];
  const growthLogs = await growthService.getAll(baby.id, undefined, 500);

  return (
    <InsightPage
      baby={baby}
      growthLogs={growthLogs}
    />
  );
}
