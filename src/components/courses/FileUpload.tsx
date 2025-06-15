
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X, FileIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface FileUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
  accept?: string;
  maxSizeMB?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onUpload, 
  currentUrl, 
  accept = "*",
  maxSizeMB = 100 
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const uploadFile = async (file: File) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload files",
        variant: "destructive",
      });
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSizeMB}MB`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('course-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('course-files')
        .getPublicUrl(fileName);

      onUpload(data.publicUrl);
      
      toast({
        title: "File uploaded successfully!",
        description: "Your file is now available for the course",
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const removeFile = () => {
    onUpload('');
  };

  if (currentUrl) {
    return (
      <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
        <FileIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
        <span className="flex-1 text-xs sm:text-sm truncate">
          {currentUrl.split('/').pop()}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={removeFile}
          className="p-1 h-6 w-6 sm:h-8 sm:w-8"
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-colors ${
        dragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        onChange={handleFileSelect}
        accept={accept}
        className="hidden"
        id="file-upload"
        disabled={isUploading}
      />
      
      <div className="space-y-2">
        <Upload className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-gray-400" />
        <div>
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-blue-600 hover:text-blue-500 text-sm sm:text-base"
          >
            {isUploading ? 'Uploading...' : 'Click to upload'}
          </label>
          <span className="text-gray-500 text-sm sm:text-base"> or drag and drop</span>
        </div>
        <p className="text-xs text-gray-500">
          Maximum file size: {maxSizeMB}MB
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
