import { userService } from '@/lib/services/user/user.service.server';
import HomePage from './HomePage';

export default async function Home() {
  const userContext = await userService.getMyContext();
  
  const firstFamily = userContext.families[0];
  const firstBaby = firstFamily?.babies[0];
  
  if (!firstBaby) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Welcome to BabyCare!</h2>
        <p>No baby profiles found. Please add a baby to get started.</p>
      </div>
    );
  }
  
  return <HomePage baby={firstBaby} />;
}
