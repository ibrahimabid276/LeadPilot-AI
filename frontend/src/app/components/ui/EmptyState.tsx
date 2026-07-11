import { ReactNode } from "react";
import { Inbox, Search, FileQuestion } from "lucide-react";

interface EmptyStateProps {
  icon?: "inbox" | "search" | "error" | ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    href?: string;
  };
}

export function EmptyState({ icon = "inbox", title, description, action }: EmptyStateProps) {
  const renderIcon = () => {
    if (typeof icon !== "string") {
      return icon;
    }
    
    const iconMap: Record<string, ReactNode> = {
      inbox: <Inbox className="h-12 w-12 text-gray-500" />,
      search: <Search className="h-12 w-12 text-gray-500" />,
      error: <FileQuestion className="h-12 w-12 text-gray-500" />,
    };
    
    return iconMap[icon] || <Inbox className="h-12 w-12 text-gray-500" />;
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4 p-4 bg-gray-800 rounded-full">
        {renderIcon()}
      </div>
      <h3 className="text-lg font-medium text-white mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-400 max-w-sm mb-4">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export function EmptyLeadsState() {
  return (
    <EmptyState
      icon="search"
      title="No leads found"
      description="Try adjusting your search filters or search for businesses in a different location."
    />
  );
}

export function EmptyCrmState() {
  return (
    <EmptyState
      icon="inbox"
      title="Your pipeline is empty"
      description="Add leads from the Lead Discovery page to start building your sales pipeline."
      action={{
        label: "Discover Leads",
        onClick: () => window.location.href = "/leads",
      }}
    />
  );
}

export function EmptyEmailsState() {
  return (
    <EmptyState
      icon="inbox"
      title="No emails yet"
      description="Generate and send your first outreach email to a lead."
      action={{
        label: "Go to Lead Discovery",
        onClick: () => window.location.href = "/leads",
      }}
    />
  );
}
