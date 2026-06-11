import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Ban, CheckCircle, Eye, Loader2, Trash2, UserX } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AdminUser {
  id: string;
  email: string;
  display_name: string | null;
  account_type: "personal" | "business";
  status: string;
  suspended: boolean;
  created_at: string;
  business_name: string | null;
  business_category: string | null;
  phone: string | null;
  address: string | null;
  avatar_url: string | null;
}

const UserManagement = () => {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<AdminUser | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AdminUser | null>(null);
  const [confirmSuspend, setConfirmSuspend] = useState<AdminUser | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-users", {
      body: { action: "list" },
    });
    if (error) {
      toast.error("Failed to load users");
    } else {
      setUsers(data?.users ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSuspend = async (u: AdminUser) => {
    setBusyId(u.id);
    const action = u.suspended ? "unsuspend" : "suspend";
    const { error } = await supabase.functions.invoke("admin-users", {
      body: { action, user_id: u.id },
    });
    setBusyId(null);
    setConfirmSuspend(null);
    if (error) {
      toast.error("Action failed");
    } else {
      toast.success(u.suspended ? "Account reactivated" : "Account suspended");
      load();
    }
  };

  const handleDelete = async (u: AdminUser) => {
    setBusyId(u.id);
    const { error } = await supabase.functions.invoke("admin-users", {
      body: { action: "delete", user_id: u.id },
    });
    setBusyId(null);
    setConfirmDelete(null);
    if (error) {
      toast.error("Delete failed");
    } else {
      toast.success("User deleted");
      load();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Registered Users ({users.length})</h2>
        <Button variant="outline" size="sm" onClick={load}>Refresh</Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Display Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Account Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id} className={u.suspended ? "opacity-60" : ""}>
                <TableCell className="font-medium">
                  {u.display_name || u.business_name || "—"}
                </TableCell>
                <TableCell className="text-sm">{u.email}</TableCell>
                <TableCell>
                  <Badge variant={u.account_type === "business" ? "default" : "secondary"}>
                    {u.account_type}
                  </Badge>
                </TableCell>
                <TableCell>
                  {u.suspended ? (
                    <Badge variant="destructive">Suspended</Badge>
                  ) : (
                    <Badge variant="outline">{u.status}</Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(u.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setViewing(u)}
                      title="View profile"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setConfirmSuspend(u)}
                      disabled={busyId === u.id || u.id === me?.id}
                      title={u.suspended ? "Reactivate" : "Suspend"}
                      className={u.suspended ? "text-green-600" : "text-amber-600"}
                    >
                      {u.suspended ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setConfirmDelete(u)}
                      disabled={busyId === u.id || u.id === me?.id}
                      title="Delete account"
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Profile */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-2 text-sm">
              {viewing.avatar_url && (
                <img src={viewing.avatar_url} alt="" className="h-16 w-16 rounded-full object-cover" />
              )}
              <Row label="Display Name" value={viewing.display_name} />
              <Row label="Email" value={viewing.email} />
              <Row label="Account Type" value={viewing.account_type} />
              <Row label="Status" value={viewing.suspended ? "Suspended" : viewing.status} />
              <Row label="Business Name" value={viewing.business_name} />
              <Row label="Category" value={viewing.business_category} />
              <Row label="Phone" value={viewing.phone} />
              <Row label="Address" value={viewing.address} />
              <Row label="Joined" value={new Date(viewing.created_at).toLocaleString()} />
              <Row label="User ID" value={viewing.id} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Suspend */}
      <AlertDialog open={!!confirmSuspend} onOpenChange={(o) => !o && setConfirmSuspend(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmSuspend?.suspended ? "Reactivate account?" : "Suspend account?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmSuspend?.suspended
                ? `${confirmSuspend?.email} will be able to log in again.`
                : `${confirmSuspend?.email} will be signed out and blocked from logging in until reactivated.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmSuspend && handleSuspend(confirmSuspend)}
            >
              {confirmSuspend?.suspended ? "Reactivate" : "Suspend"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm Delete */}
      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete account permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes {confirmDelete?.email}'s profile and login.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => confirmDelete && handleDelete(confirmDelete)}
            >
              <UserX className="h-4 w-4 mr-1" /> Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <div className="flex justify-between gap-4 border-b border-border/50 py-1">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-right break-all">{value || "—"}</span>
  </div>
);

export default UserManagement;
