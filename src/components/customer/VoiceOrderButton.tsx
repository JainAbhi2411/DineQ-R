import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, Loader2, ShoppingCart, Check, X as XIcon, AlertCircle } from 'lucide-react';
import { useVoiceRecording } from '@/hooks/use-voice-recording';
import { transcribeAudio } from '@/services/speechService';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Streamdown } from 'streamdown';
import { ParsedOrderItem } from '@/services/llm.service';

interface VoiceOrderButtonProps {
  onTranscriptionComplete: (text: string, callbacks: {
    onStream: (chunk: string) => void;
    onComplete: (fullText: string, parsedItems: ParsedOrderItem[]) => void;
    onError: (error: string) => void;
  }) => void;
  disabled?: boolean;
}

export default function VoiceOrderButton({ onTranscriptionComplete, disabled }: VoiceOrderButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [parsedItems, setParsedItems] = useState<ParsedOrderItem[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showTranscription, setShowTranscription] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const { isRecording, audioBlob, startRecording, stopRecording, clearRecording, error } = useVoiceRecording();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiResponse, parsedItems]);

  const handleStartStop = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      clearRecording();
      setTranscribedText('');
      setAiResponse('');
      setParsedItems([]);
      setShowTranscription(false);
      setProcessingComplete(false);
      await startRecording();
    }
  };

  const handleTranscribe = async () => {
    if (!audioBlob) {
      toast({
        title: 'No Recording',
        description: 'Please record your order first',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      const text = await transcribeAudio(audioBlob);
      setTranscribedText(text);
      setShowTranscription(true);
      
      toast({
        title: 'Transcription Complete',
        description: 'Review your order and click "Process Order" to continue',
      });
    } catch (err) {
      console.error('Error transcribing audio:', err);
      toast({
        title: 'Transcription Failed',
        description: 'Failed to transcribe your audio. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessOrder = () => {
    if (!transcribedText) {
      toast({
        title: 'No Transcription',
        description: 'Please transcribe your recording first',
        variant: 'destructive',
      });
      return;
    }

    setIsStreaming(true);
    setAiResponse('');
    setParsedItems([]);
    setProcessingComplete(false);
    
    // Call the parent handler with callbacks
    onTranscriptionComplete(transcribedText, {
      onStream: (chunk: string) => {
        setAiResponse(prev => prev + chunk);
      },
      onComplete: (fullText: string, items: ParsedOrderItem[]) => {
        setAiResponse(fullText);
        setParsedItems(items);
        setIsStreaming(false);
        setProcessingComplete(true);
      },
      onError: (errorMsg: string) => {
        setAiResponse(`❌ Error: ${errorMsg}`);
        setIsStreaming(false);
        setProcessingComplete(true);
      }
    });
  };

  const handleClose = () => {
    if (isRecording) {
      stopRecording();
    }
    setIsOpen(false);
    clearRecording();
    setTranscribedText('');
    setAiResponse('');
    setParsedItems([]);
    setShowTranscription(false);
    setIsStreaming(false);
    setProcessingComplete(false);
  };

  const handleCancel = () => {
    clearRecording();
    setTranscribedText('');
    setAiResponse('');
    setParsedItems([]);
    setShowTranscription(false);
    setIsStreaming(false);
    setProcessingComplete(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20 border-primary/20"
        title="Voice Order"
      >
        <Mic className="h-5 w-5 text-primary" />
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Voice Order</DialogTitle>
            <DialogDescription>
              Speak your order clearly, review the transcription, and process your order
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            {/* Recording Section */}
            {!showTranscription && (
              <div className="flex flex-col items-center gap-6">
                {/* Recording Button */}
                <div className="relative">
                  {isRecording && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-destructive/20 animate-ping" />
                      <div className="absolute inset-0 rounded-full bg-destructive/10 animate-pulse" />
                    </>
                  )}
                  <Button
                    size="icon"
                    variant={isRecording ? 'destructive' : audioBlob ? 'default' : 'outline'}
                    className={cn(
                      'h-24 w-24 rounded-full relative z-10',
                      !isRecording && !audioBlob && 'bg-primary hover:bg-primary/90',
                      audioBlob && !isRecording && 'bg-green-500 hover:bg-green-600'
                    )}
                    onClick={handleStartStop}
                    disabled={isProcessing}
                  >
                    {isRecording ? (
                      <MicOff className="h-10 w-10" />
                    ) : audioBlob ? (
                      <Volume2 className="h-10 w-10" />
                    ) : (
                      <Mic className="h-10 w-10" />
                    )}
                  </Button>
                </div>

                {/* Status Text */}
                <div className="text-center">
                  {isProcessing ? (
                    <p className="text-sm text-muted-foreground">Processing...</p>
                  ) : isRecording ? (
                    <div>
                      <p className="text-sm font-medium text-destructive">Recording...</p>
                      <p className="text-xs text-muted-foreground mt-1">Tap the button to stop</p>
                    </div>
                  ) : audioBlob ? (
                    <div>
                      <p className="text-sm font-medium text-green-600">Recording Ready</p>
                      <p className="text-xs text-muted-foreground mt-1">Click "Transcribe" to see your order</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium">Ready to Record</p>
                      <p className="text-xs text-muted-foreground mt-1">Tap the microphone to start</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Example: "I want 2 pizzas and 1 coke"
                      </p>
                    </div>
                  )}
                </div>

                {/* Error Display */}
                {error && (
                  <div className="w-full p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 w-full">
                  <Button variant="outline" onClick={handleClose} className="flex-1">
                    Cancel
                  </Button>
                  {audioBlob && !isProcessing && (
                    <Button onClick={handleTranscribe} className="flex-1" disabled={isProcessing}>
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Transcribing...
                        </>
                      ) : (
                        'Transcribe'
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Transcription and Processing Section */}
            {showTranscription && (
              <div className="flex flex-col gap-4">
                {/* Transcribed Text */}
                <Card className="p-4 bg-muted/50">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-semibold">You said:</p>
                    <Badge variant="secondary" className="text-xs">
                      <Mic className="w-3 h-3 mr-1" />
                      Voice
                    </Badge>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{transcribedText}</p>
                </Card>

                {/* AI Response (if processing) */}
                {aiResponse && (
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-semibold">AI Assistant:</p>
                      {isStreaming && (
                        <Badge variant="secondary" className="text-xs">
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Processing
                        </Badge>
                      )}
                    </div>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <Streamdown>{aiResponse}</Streamdown>
                    </div>
                  </Card>
                )}

                {/* Parsed Items */}
                {parsedItems && parsedItems.length > 0 && (
                  <Card className="p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-3">
                      <ShoppingCart className="w-4 h-4 text-green-600" />
                      <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                        Items to Add ({parsedItems.length})
                      </p>
                    </div>
                    <div className="space-y-2">
                      {parsedItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">{item.itemName}</span>
                          </div>
                          <Badge variant="secondary">Qty: {item.quantity}</Badge>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                <div ref={messagesEndRef} />

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancel} className="flex-1" disabled={isStreaming}>
                    <XIcon className="w-4 h-4 mr-2" />
                    Record Again
                  </Button>
                  {!isStreaming && !processingComplete && (
                    <Button onClick={handleProcessOrder} className="flex-1">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Process Order
                    </Button>
                  )}
                  {processingComplete && (
                    <Button onClick={handleClose} className="flex-1">
                      <Check className="w-4 h-4 mr-2" />
                      Done
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
