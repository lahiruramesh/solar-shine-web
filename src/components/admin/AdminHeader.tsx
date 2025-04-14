
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthUser } from '@/services/authService';

interface AdminHeaderProps {
  user: AuthUser | null;
  onLogout: () => Promise<void>;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ user, onLogout }) => {
  return (
    <div className="bg-primary shadow-md py-2 px-4">
      <div className="container-custom flex justify-between items-center">
        <h1 className="text-lg md:text-xl font-semibold text-white">Admin Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-white text-sm hidden md:inline-block">
            Logged in as: {user?.email}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-white border-white hover:bg-primary-foreground hover:text-primary"
            onClick={onLogout}
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
