
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, Eye, RotateCcw } from 'lucide-react';
import { useContentVersions, useCreateContentVersion } from '@/hooks/useContentVersions';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ContentVersionHistoryProps {
  contentId: string;
  currentContent: {
    title: string;
    content_text?: string;
    content_url?: string;
    description?: string;
  };
  onRestoreVersion?: (version: any) => void;
}

const ContentVersionHistory: React.FC<ContentVersionHistoryProps> = ({
  contentId,
  currentContent,
  onRestoreVersion
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: versions, isLoading } = useContentVersions(contentId);
  const createVersion = useCreateContentVersion();

  const handleCreateVersion = async (changeNotes?: string) => {
    if (!user?.id) return;

    createVersion.mutate({
      content_id: contentId,
      title: currentContent.title,
      content_text: currentContent.content_text,
      content_url: currentContent.content_url,
      description: currentContent.description,
      created_by: user.id,
      is_published: false,
      change_notes: changeNotes,
    });
  };

  const handleRestoreVersion = (version: any) => {
    if (onRestoreVersion) {
      onRestoreVersion(version);
      toast({ title: 'Version restored successfully!' });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading version history...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Version History
        </CardTitle>
        <CardDescription>
          Track changes and restore previous versions of your content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={() => handleCreateVersion('Manual backup')}
          disabled={createVersion.isPending}
          className="w-full"
        >
          Create Current Version Backup
        </Button>

        {versions && versions.length > 0 ? (
          <div className="space-y-3">
            {versions.map((version, index) => (
              <div
                key={version.id}
                className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">v{version.version_number}</Badge>
                      <span className="font-medium">{version.title}</span>
                      {version.is_published && (
                        <Badge variant="default">Published</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(version.created_at).toLocaleString()}
                    </p>
                    {version.change_notes && (
                      <p className="text-sm text-gray-500 mt-1">
                        {version.change_notes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestoreVersion(version)}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            No version history available. Create a backup to start tracking changes.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentVersionHistory;
