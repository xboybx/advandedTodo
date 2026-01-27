import { LayoutDashboard, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

type TabType = 'dashboard' | 'todos';

interface TopTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'todos' as TabType, label: 'Todo List', icon: CheckSquare },
  { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
];

export const TopTabs = ({ activeTab, onTabChange }: TopTabsProps) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
            activeTab === tab.id
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
          )}
        >
          <tab.icon className="h-4 w-4" />
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};
