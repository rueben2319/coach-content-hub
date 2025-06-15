import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X, FileIcon, Image, Video, Music, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import MediaPreview from './MediaPreview';

interface EnhancedFileUploadProps {
  onUpload: (url: string, metadata?: FileMetadata) => void;
  currentUrl?: string;
  accept?: string;
  maxSizeMB?: number;
  contentType?: 'video' | 'audio' | 'text' | 'pdf' | 'image' | 'interactive';
}

interface FileMetadata {
  fileName: string;
  mimeType: string;
  fileSize: number;
  duration?: number;
  thumbnailUrl?: string;
}

const EnhancedFileUpload: React.FC<EnhancedFileUploadProps> = ({
  onUpload,
  currentUrl,
  accept = "*",
  maxSizeMB = 100,
  contentType
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const getBucketName = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'course-thumbnails';
    if (mimeType.startsWith('video/') || mimeType.startsWith('audio/')) return 'course-media';
    return 'course-files';
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType.startsWith('video/')) return Video;
    if (mimeType.startsWith('audio/')) return Music;
    if (mimeType === 'application/pdf') return FileText;
    return FileIcon;
  };

  const extractVideoDuration = (file: File): Promise<number | undefined> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('video/')) {
        resolve(undefined);
        return;
      }

      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        resolve(video.duration);
        URL.revokeObjectURL(video.src);
      };
      
      video.onerror = () => {
        resolve(undefined);
        URL.revokeObjectURL(video.src);
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const generateThumbnail = async (file: File): Promise<string | undefined> => {
    if (!file.type.startsWith('video/')) return undefined;

    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        video.currentTime = Math.min(5, video.duration / 2); // Thumbnail at 5s or middle
      };

      video.oncanplay = () => {
        if (!ctx) {
          resolve(undefined);
          return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            uploadThumbnail(blob).then(resolve).catch(() => resolve(undefined));
          } else {
            resolve(undefined);
          }
        }, 'image/jpeg', 0.8);
        
        URL.revokeObjectURL(video.src);
      };

      video.onerror = () => {
        resolve(undefined);
        URL.revokeObjectURL(video.src);
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const uploadThumbnail = async (blob: Blob): Promise<string> => {
    const fileName = `${user?.id}/${Date.now()}_thumb.jpg`;
    
    const { error: uploadError } = await supabase.storage
      .from('course-thumbnails')
      .upload(fileName, blob);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('course-thumbnails')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const uploadFile = useCallback(async (file: File) => {
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
    setUploadProgress(0);

    try {
      // Extract metadata
      const duration = await extractVideoDuration(file);
      const thumbnailUrl = await generateThumbnail(file);

      const fileExt = file.name.split('.').pop();
      const bucketName = getBucketName(file.type);
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      const metadata: FileMetadata = {
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        duration,
        thumbnailUrl
      };

      onUpload(data.publicUrl, metadata);
      
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
      setUploadProgress(0);
    }
  }, [user, maxSizeMB, onUpload, toast]);

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
    // Handle interactive content type by mapping to a supported type for MediaPreview
    const previewType = contentType === 'interactive' ? 'text' : (contentType || 'text');
    return (
      <div className="space-y-4">
        <MediaPreview
          url={currentUrl}
          type={previewType as 'video' | 'audio' | 'image' | 'pdf' | 'text'}
          title="Current File"
        />
        <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            <FileIcon className="h-4 w-4 text-blue-500" />
            <span className="text-sm truncate">
              {currentUrl.split('/').pop()}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
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
        id="enhanced-file-upload"
        disabled={isUploading}
      />
      
      <div className="space-y-4">
        <Upload className="h-8 w-8 mx-auto text-gray-400" />
        <div>
          <label
            htmlFor="enhanced-file-upload"
            className="cursor-pointer text-blue-600 hover:text-blue-500 font-medium"
          >
            {isUploading ? 'Uploading...' : 'Click to upload'}
          </label>
          <span className="text-gray-500"> or drag and drop</span>
        </div>
        
        {isUploading && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
        
        <p className="text-xs text-gray-500">
          Maximum file size: {maxSizeMB}MB
        </p>
      </div>
    </div>
  );
};

export default EnhancedFileUpload;
