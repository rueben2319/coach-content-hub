
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, Clock, XCircle, Send } from 'lucide-react';
import { usePublishingWorkflows, useSubmitForApproval } from '@/hooks/usePublishingWorkflow';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

interface PublishingWorkflowManagerProps {
  courseId?: string;
  contentId?: string;
}

const PublishingWorkflowManager: React.FC<PublishingWorkflowManagerProps> = ({
  courseId,
  contentId
}) => {
  const { user } = useAuth();
  const [submissionNotes, setSubmissionNotes] = useState('');
  const { data: workflows, isLoading } = usePublishingWorkflows(courseId);
  const submitForApproval = useSubmitForApproval();

  const handleSubmitForApproval = () => {
    if (!user?.id) return;

    submitForApproval.mutate({
      course_id: courseId,
      content_id: contentId,
      workflow_type: courseId ? 'course' : 'content',
      submitted_by: user.id,
      approval_notes: submissionNotes,
    });

    setSubmissionNotes('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'published':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive',
      published: 'default',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading workflows...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Publishing Workflow
        </CardTitle>
        <CardDescription>
          Submit content for approval and track publishing status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="submission-notes">Submission Notes (Optional)</Label>
            <Textarea
              id="submission-notes"
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              placeholder="Add any notes for the reviewer..."
              rows={3}
            />
          </div>
          
          <Button
            onClick={handleSubmitForApproval}
            disabled={submitForApproval.isPending}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            Submit for Approval
          </Button>
        </div>

        {workflows && workflows.length > 0 && (
          <div className="space-y-3 mt-6">
            <h4 className="font-medium">Workflow History</h4>
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="p-3 border rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(workflow.status)}
                    <span className="font-medium">
                      {workflow.workflow_type} Approval
                    </span>
                    {getStatusBadge(workflow.status)}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(workflow.submitted_at).toLocaleDateString()}
                  </span>
                </div>
                
                {workflow.approval_notes && (
                  <p className="text-sm text-gray-600 mb-2">
                    {workflow.approval_notes}
                  </p>
                )}
                
                {workflow.rejection_reason && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    <strong>Rejection Reason:</strong> {workflow.rejection_reason}
                  </div>
                )}
                
                {workflow.approved_at && (
                  <p className="text-sm text-green-600">
                    Approved on {new Date(workflow.approved_at).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PublishingWorkflowManager;
