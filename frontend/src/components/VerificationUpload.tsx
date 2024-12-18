import React, { useState } from 'react';
import { Upload } from 'lucide-react';

export function VerificationUpload() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      
      // TODO: Backend Integration - Upload ID verification
      // - Endpoint: POST /api/drivers/verify
      // - Send file as multipart/form-data
      // - Handle upload progress
      // - Update verification status in user profile
      // - Implement secure file storage with encryption
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-xl shadow-md overflow-hidden p-8">
      <h3 className="text-xl font-semibold mb-4">ID Verification</h3>
      <p className="text-gray-600 mb-6">
        Please upload a clear photo of your driver's license for verification.
      </p>

      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              Supported formats: PNG, JPG, PDF (Max. 10MB)
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*,.pdf"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {file && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">Selected file: {file.name}</p>
        </div>
      )}
    </div>
  )
}