"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModelControlsProps } from "@/types";

export function ModelControls({
  onLoadModel,
  onUnloadModel,
  isModelLoaded,
  isModelLoading,
}: ModelControlsProps) {
  const [selectedModel, setSelectedModel] = useState<string>("nomic-ai/nomic-embed-text-v1.5");
  const [encodingFormat, setEncodingFormat] = useState<string>("float");

  const handleLoadModel = () => {
    onLoadModel(selectedModel, encodingFormat);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="space-y-2 min-w-[200px]">
            <label htmlFor="model-select" className="text-sm font-medium">
              Embedding Model
            </label>
            <Select
              value={selectedModel}
              onValueChange={setSelectedModel}
              disabled={isModelLoaded || isModelLoading}
            >
              <SelectTrigger id="model-select" className="w-full">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nomic-ai/nomic-embed-text-v1.5">
                  Nomic Embed
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 min-w-[200px]">
            <label htmlFor="encoding-format" className="text-sm font-medium">
              Encoding Format
            </label>
            <Select
              value={encodingFormat}
              onValueChange={setEncodingFormat}
              disabled={isModelLoaded || isModelLoading}
            >
              <SelectTrigger id="encoding-format" className="w-full">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="float">Float (Raw vectors)</SelectItem>
                <SelectItem value="base64">Base64 (Compact storage)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end space-x-2">
            <Button
              onClick={handleLoadModel}
              disabled={isModelLoaded || isModelLoading}
            >
              Load Model
            </Button>
            <Button
              onClick={onUnloadModel}
              disabled={!isModelLoaded || isModelLoading}
              variant="outline"
            >
              Unload Model
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}