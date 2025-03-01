"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SystemStatusProps } from "@/types";
import { formatBytes, formatTime } from "@/lib/utils";

export function SystemStatus({
  webGPUStatus,
  fp16Status,
  modelStatus,
  backendValue,
  progress
}: SystemStatusProps) {
  const getStatusColor = (status: string): string => {
    if (status === "available" || status === "supported" || status === "loaded")
      return "bg-green-500";
    if (status === "loading") return "bg-amber-500";
    if (status === "error") return "bg-red-500";
    return "bg-slate-300";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center">
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusColor(
                webGPUStatus
              )}`}
            />
            <div>
              <strong>WebGPU:</strong>{" "}
              <span>
                {webGPUStatus === "available"
                  ? "Available"
                  : "Not Available"}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusColor(
                fp16Status
              )}`}
            />
            <div>
              <strong>FP16 Support:</strong>{" "}
              <span>
                {fp16Status === "supported" ? "Supported" : "Not Supported"}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusColor(
                modelStatus
              )}`}
            />
            <div>
              <strong>Model Status:</strong>{" "}
              <span>
                {modelStatus === "loaded"
                  ? "Loaded"
                  : modelStatus === "loading"
                  ? "Loading..."
                  : "Not Loaded"}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <div>
              <strong>Backend:</strong> <span>{backendValue}</span>
            </div>
          </div>
        </div>

        {modelStatus === "loading" && progress && (
          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span>{progress.message || "Loading model..."}</span>
              <span>{progress.percentComplete}%</span>
            </div>
            <Progress value={progress.percentComplete} className="h-2" />

            {progress.overall && (
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <div>
                  <span>{progress.overall.formattedLoaded || "0 B"}</span> /{" "}
                  <span>{progress.overall.formattedTotal || "0 B"}</span>
                </div>
                <div>
                  <span>{progress.overall.formattedSpeed || "0 B/s"}</span> •{" "}
                  <span>{progress.overall.formattedRemaining || "--"}</span>
                </div>
              </div>
            )}

            {progress.files && progress.files.length > 0 && (
              <div className="mt-2 max-h-40 overflow-y-auto">
                {progress.files.map((file) => (
                  <div key={file.id} className="mb-1 border rounded p-2">
                    <div className="flex justify-between text-sm">
                      <div className="truncate max-w-xs">{file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        <span className="mr-2">{file.percentComplete}%</span>
                        {file.bytesLoaded !== undefined && file.bytesTotal !== undefined && (
                          <span className="mr-2">
                            {formatBytes(file.bytesLoaded)} /{" "}
                            {formatBytes(file.bytesTotal)}
                          </span>
                        )}
                        {file.speed && (
                          <span className="mr-2">
                            {formatBytes(file.speed)}/s
                          </span>
                        )}
                        {file.timeRemaining && (
                          <span>ETA: {formatTime(file.timeRemaining)}</span>
                        )}
                      </div>
                    </div>
                    <Progress
                      value={file.percentComplete}
                      className="h-1 mt-1"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}