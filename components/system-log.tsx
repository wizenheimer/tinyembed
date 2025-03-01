"use client";

import React, { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SystemLogProps } from "@/types";

export function SystemLog({ logs }: SystemLogProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const scrollToBottom = () => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 overflow-y-auto rounded-md bg-black text-white p-4 font-mono text-sm">
          {logs.map((log, index) => (
            <div key={index} className="mb-2">
              <span className="text-gray-400">[{log.timestamp}]</span>{" "}
              {log.message}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </CardContent>
    </Card>
  );
}