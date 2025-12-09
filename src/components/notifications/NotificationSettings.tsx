import { Settings, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useNotificationSound } from '@/hooks/use-notification-sound';

export function NotificationSettings() {
  const { settings, toggleSound, setVolume, testSound } = useNotificationSound();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Notification Settings">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notification Settings</DialogTitle>
          <DialogDescription>
            Customize your notification preferences
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sound-enabled" className="text-base">
                Notification Sound
              </Label>
              <p className="text-sm text-muted-foreground">
                Play a sound when you receive notifications
              </p>
            </div>
            <Switch
              id="sound-enabled"
              checked={settings.enabled}
              onCheckedChange={toggleSound}
            />
          </div>

          {settings.enabled && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="volume" className="text-base">
                  Volume
                </Label>
                <div className="flex items-center gap-2">
                  {settings.volume === 0 ? (
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {Math.round(settings.volume * 100)}%
                  </span>
                </div>
              </div>
              <Slider
                id="volume"
                min={0}
                max={100}
                step={5}
                value={[settings.volume * 100]}
                onValueChange={(value) => setVolume(value[0] / 100)}
                className="w-full"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={testSound}
                className="w-full"
              >
                Test Sound
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
