import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Mic, MicOff, Loader2, Volume2, AlertCircle } from 'lucide-react';
import { useVoiceRecording } from '@/hooks/use-voice-recording';
import { transcribeAudio } from '@/services/speechService';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface VoiceOrderButtonProps {
  onTranscriptionComplete: (text: string) => void;
  disabled?: boolean;
}

export default function VoiceOrderButton({ onTranscriptionComplete, disabled }: VoiceOrderButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const { toast } = useToast();
  
  const {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    clearRecording,
    error: recordingError
  } = useVoiceRecording();

  const handleStartRecording = async () => {
    setTranscribedText('');
    clearRecording();
    await startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleProcessAudio = async () => {
    if (!audioBlob) {
      toast({
        title: 'No Recording',
        description: 'Please record your order first',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const text = await transcribeAudio(audioBlob);
      setTranscribedText(text);
      
      toast({
        title: 'Order Understood',
        description: 'Processing your voice order...'
      });

      onTranscriptionComplete(text);
      
      setTimeout(() => {
        setDialogOpen(false);
        clearRecording();
        setTranscribedText('');
      }, 1500);
      
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: 'Processing Failed',
        description: error instanceof Error ? error.message : 'Failed to process your voice order. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    if (isRecording) {
      stopRecording();
    }
    clearRecording();
    setTranscribedText('');
    setDialogOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setDialogOpen(true)}
        disabled={disabled}
        variant="outline"
        size="icon"
        className="rounded-full h-12 w-12 bg-primary/10 hover:bg-primary/20 border-primary/20"
      >
        <Mic className="h-5 w-5 text-primary" />
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Voice Order</DialogTitle>
            <DialogDescription>
              Speak your order clearly. For example: "I want 2 pizzas and 1 coke"
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-6 py-6">
            {recordingError && (
              <div className="w-full p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{recordingError}</p>
              </div>
            )}

            <div className="relative">
              <Button
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                disabled={isProcessing}
                size="lg"
                className={cn(
                  "h-24 w-24 rounded-full transition-all duration-300",
                  isRecording && "animate-pulse bg-destructive hover:bg-destructive/90"
                )}
              >
                {isRecording ? (
                  <MicOff className="h-10 w-10" />
                ) : (
                  <Mic className="h-10 w-10" />
                )}
              </Button>
              
              {isRecording && (
                <div className="absolute inset-0 rounded-full border-4 border-destructive animate-ping opacity-75" />
              )}
            </div>

            <div className="text-center space-y-2">
              {isRecording ? (
                <>
                  <p className="text-lg font-semibold text-destructive">Recording...</p>
                  <p className="text-sm text-muted-foreground">Tap the button to stop</p>
                </>
              ) : audioBlob ? (
                <>
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <Volume2 className="h-5 w-5" />
                    <p className="text-lg font-semibold">Recording Ready</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Process your order or record again</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold">Ready to Record</p>
                  <p className="text-sm text-muted-foreground">Tap the microphone to start</p>
                </>
              )}
            </div>

            {transcribedText && (
              <div className="w-full p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm font-medium mb-1">You said:</p>
                <p className="text-sm text-muted-foreground italic">"{transcribedText}"</p>
              </div>
            )}

            <div className="flex gap-3 w-full">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              
              {audioBlob && !isRecording && (
                <Button
                  onClick={handleProcessAudio}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Process Order'
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
