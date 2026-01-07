import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { recentSignups } from '@/lib/mock-data';

export function RecentSignups() {
  return (
    <div className="space-y-8">
      {recentSignups.map((signup, index) => (
        <div className="flex items-center" key={index}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={signup.avatarUrl} alt="Avatar" />
            <AvatarFallback>{signup.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{signup.name}</p>
            <p className="text-sm text-muted-foreground">{signup.email}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
