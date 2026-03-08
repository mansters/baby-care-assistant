import { userService } from "@/lib/services/user/user.service.server";
import { feedingService } from "@/lib/services/feeding/feeding.service.server";
import { growthService } from "@/lib/services/growth/growth.service.server";
import HomePage from "./HomePage";

export default async function Home() {
  const userContext = await userService.getMyContext();

  const firstFamily = userContext.families[0];
  const firstBaby = firstFamily?.babies[0];

  if (!firstBaby) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Welcome to BabyCare!</h2>
        <p>No baby profiles found. Please add a baby to get started.</p>
      </div>
    );
  }

  const [nextFeedingData, growthResults] = await Promise.all([
    feedingService.getNextFeeding(firstBaby.id).catch(() => null),
    growthService.getAll(firstBaby.id, undefined, 1).catch(() => []),
  ]);

  return (
    <HomePage
      baby={firstBaby}
      nextFeedingData={nextFeedingData}
      latestGrowth={growthResults?.[0] ?? null}
    />
  );
}
