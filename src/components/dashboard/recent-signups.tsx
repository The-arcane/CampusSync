import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Profile } from '@/lib/types';

export function RecentSignups({ signups }: { signups: Partial<Profile>[] }) {
  if (!signups || signups.length === 0) {
    return (
        <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">No recent signups.</p>
        </div>
    )
  }
  return (
    <div className="space-y-8">
      {signups.map((signup, index) => (
        <div className="flex items-center" key={index}>
          <Avatar className="h-9 w-9">
            {signup.avatarUrl && <AvatarImage src={signup.avatarUrl} alt="Avatar" />}
            <AvatarFallback>{signup.full_name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{signup.full_name}</p>
            <p className="text-sm text-muted-foreground">{signup.email}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
