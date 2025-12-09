import { useState, useEffect } from 'react';
import { tableApi } from '@/db/api';
import { Table } from '@/types/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Search, MapPin, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TableSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantId: string;
  onTableSelected: (tableId: string, tableNumber: string) => void;
}

export default function TableSelectionDialog({
  open,
  onOpenChange,
  restaurantId,
  onTableSelected,
}: TableSelectionDialogProps) {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTableId, setSelectedTableId] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    if (open && restaurantId) {
      loadTables();
    }
  }, [open, restaurantId]);

  const loadTables = async () => {
    try {
      setLoading(true);
      const tablesData = await tableApi.getTablesByRestaurant(restaurantId);
      setTables(tablesData);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load tables',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTables = tables.filter(table =>
    table.table_number.toString().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = () => {
    if (!selectedTableId) {
      toast({
        title: 'No Table Selected',
        description: 'Please select a table number',
        variant: 'destructive',
      });
      return;
    }

    const selectedTable = tables.find(t => t.id === selectedTableId);
    if (selectedTable) {
      onTableSelected(selectedTable.id, selectedTable.table_number);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Select Your Table
          </DialogTitle>
          <DialogDescription>
            Please select the table number where you're seated
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search table number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            </div>
          )}

          {/* No Tables */}
          {!loading && tables.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No tables available</p>
              <p className="text-sm text-muted-foreground mt-1">
                Please scan a QR code or contact staff
              </p>
            </div>
          )}

          {/* No Search Results */}
          {!loading && tables.length > 0 && filteredTables.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Search className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No tables found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try a different table number
              </p>
            </div>
          )}

          {/* Table Selection */}
          {!loading && filteredTables.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Available Tables</Label>
              <RadioGroup
                value={selectedTableId}
                onValueChange={setSelectedTableId}
                className="grid grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-2"
              >
                {filteredTables.map((table) => (
                  <div key={table.id} className="relative">
                    <RadioGroupItem
                      value={table.id}
                      id={`table-${table.id}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`table-${table.id}`}
                      className={cn(
                        'flex items-center justify-center h-16 rounded-lg border-2 cursor-pointer transition-all',
                        'hover:border-primary hover:bg-primary/5',
                        'peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground',
                        'peer-data-[state=checked]:shadow-lg peer-data-[state=checked]:scale-105'
                      )}
                    >
                      <div className="text-center">
                        <div className="text-lg font-bold">{table.table_number}</div>
                        <div className="text-xs opacity-70">Table</div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Info Message */}
          <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Make sure to select the correct table number where you're currently seated. 
              This helps the staff deliver your order to the right location.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedTableId}
            className="flex-1"
          >
            Confirm Table
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
