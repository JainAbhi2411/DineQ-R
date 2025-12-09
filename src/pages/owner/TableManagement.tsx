import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantApi, tableApi } from '@/db/api';
import { Restaurant, Table } from '@/types/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, ArrowLeft, Download, QrCode as QrCodeIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import QRCode from 'qrcode';
import OwnerLayout from '@/components/owner/OwnerLayout';

export default function TableManagement() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [tableForm, setTableForm] = useState({ table_number: '', capacity: '' });
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  useEffect(() => {
    loadData();
  }, [restaurantId]);

  const loadData = async () => {
    if (!restaurantId) return;
    
    try {
      setLoading(true);
      const [restaurantData, tablesData] = await Promise.all([
        restaurantApi.getRestaurantById(restaurantId),
        tableApi.getTablesByRestaurant(restaurantId),
      ]);
      
      setRestaurant(restaurantData);
      setTables(tablesData);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (table: Table) => {
    try {
      const qrData = table.qr_code;
      const url = await QRCode.toDataURL(qrData, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      setQrCodeUrl(url);
      setSelectedTable(table);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to generate QR code',
        variant: 'destructive',
      });
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl || !selectedTable) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `table-${selectedTable.table_number}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Success',
      description: 'QR code downloaded successfully',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantId) return;

    try {
      const tableData = {
        table_number: tableForm.table_number,
        capacity: parseInt(tableForm.capacity) || 4,
        restaurant_id: restaurantId,
      };

      if (editingTable) {
        await tableApi.updateTable(editingTable.id, tableData);
        toast({ title: 'Success', description: 'Table updated successfully' });
      } else {
        await tableApi.createTable(tableData);
        toast({ title: 'Success', description: 'Table created successfully' });
      }

      setDialogOpen(false);
      setTableForm({ table_number: '', capacity: '' });
      setEditingTable(null);
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save table',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await tableApi.deleteTable(id);
      toast({ title: 'Success', description: 'Table deleted successfully' });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete table',
        variant: 'destructive',
      });
    }
  };

  const openEdit = (table: Table) => {
    setEditingTable(table);
    setTableForm({
      table_number: table.table_number,
      capacity: table.capacity.toString(),
    });
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <OwnerLayout title="Table Management">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout title={`${restaurant?.name} - Table Management`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <p className="text-muted-foreground">Manage tables and generate QR codes for customers</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Tables</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingTable(null); setTableForm({ table_number: '', capacity: '' }); }} className="morph-button hover-glow-orange">
                <Plus className="w-4 h-4 mr-2" />
                Add Table
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingTable ? 'Edit Table' : 'Add New Table'}</DialogTitle>
                <DialogDescription>
                  Create tables and generate unique QR codes for each
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="table-number">Table Number *</Label>
                  <Input
                    id="table-number"
                    value={tableForm.table_number}
                    onChange={(e) => setTableForm({ ...tableForm, table_number: e.target.value })}
                    placeholder="e.g., T1, A1, 101"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity (seats)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={tableForm.capacity}
                    onChange={(e) => setTableForm({ ...tableForm, capacity: e.target.value })}
                    placeholder="4"
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingTable ? 'Update Table' : 'Create Table'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {tables.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <QrCodeIcon className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Tables Yet</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Add tables to your restaurant and generate QR codes for customers to scan
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Table
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 xl:grid-cols-4 gap-4">
            {tables.map((table) => (
              <Card key={table.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Table {table.table_number}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {table.capacity} seats
                    </span>
                  </CardTitle>
                  <CardDescription className="text-xs font-mono truncate">
                    QR: {table.qr_code.slice(0, 20)}...
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => generateQRCode(table)}
                  >
                    <QrCodeIcon className="w-4 h-4 mr-2" />
                    View QR Code
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(table)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDelete(table.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {qrCodeUrl && selectedTable && (
          <Dialog open={!!qrCodeUrl} onOpenChange={() => { setQrCodeUrl(''); setSelectedTable(null); }}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>QR Code - Table {selectedTable.table_number}</DialogTitle>
                <DialogDescription>
                  Customers can scan this QR code to view your menu
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg flex items-center justify-center">
                  <img src={qrCodeUrl} alt="QR Code" className="w-full max-w-xs" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <strong>Table:</strong> {selectedTable.table_number}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Capacity:</strong> {selectedTable.capacity} seats
                  </p>
                  <p className="text-sm text-muted-foreground break-all">
                    <strong>QR Code:</strong> {selectedTable.qr_code}
                  </p>
                </div>
                <Button onClick={downloadQRCode} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </OwnerLayout>
  );
}
