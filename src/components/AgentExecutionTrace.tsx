import React, { useState } from 'react';
import { CheckCircle2, Loader2, AlertCircle, ChevronDown, ChevronUp, Cpu } from 'lucide-react';
import type { ToolExecutionStep } from '../types';

interface AgentExecutionTraceProps {
  steps: ToolExecutionStep[];
  thoughtProcess?: string;
  isStreaming?: boolean;
}

export const AgentExecutionTrace: React.FC<AgentExecutionTraceProps> = ({
  steps,
  thoughtProcess,
  isStreaming = false,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!steps || steps.length === 0) return null;

  return (
    <div className="bg-[#FFFFFF] border border-[#E0DED7] p-5 sm:p-6 shadow-sm">
      <div
        className="flex items-center justify-between cursor-pointer border-b border-[#E0DED7] pb-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1A1A1A] text-white flex items-center justify-center font-mono text-xs font-bold">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2">
              Autonomous Genkit Tool Execution Trace
              {isStreaming && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-[#F27D26] uppercase">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Executing Tool Protocol...
                </span>
              )}
            </h3>
            <p className="text-[11px] text-[#666] font-serif italic">
              Flow sequence: <code className="text-[#1A1A1A] font-mono font-bold">get_history</code> → <code className="text-[#1A1A1A] font-mono font-bold">advise_farmer</code> → <code className="text-[#1A1A1A] font-mono font-bold">save_price</code> (Firestore)
            </p>
          </div>
        </div>
        <button
          type="button"
          className="p-1.5 text-[#666] hover:text-[#1A1A1A] hover:bg-[#F0EEE6] transition-colors"
          aria-label="Toggle trace details"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 space-y-4">
          {/* Internal Reasoning Engine Quote */}
          {thoughtProcess && (
            <div className="p-4 bg-[#FDFCF8] border-l-4 border-[#1A1A1A] text-xs">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#888] block mb-1">
                Reasoning Engine Monologue
              </span>
              <p className="text-[#333] font-serif italic leading-relaxed text-sm">
                "{thoughtProcess}"
              </p>
            </div>
          )}

          {/* Ledger of Execution Steps */}
          <div className="space-y-2">
            {steps.map((step, idx) => {
              const isCompleted = step.status === 'completed';
              const isRunning = step.status === 'running';
              const isFailed = step.status === 'failed';

              return (
                <div
                  key={`${step.toolName}-${idx}`}
                  className="bg-[#F9F7F2] border border-[#E0DED7] p-3 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {isCompleted && <CheckCircle2 className="w-4 h-4 text-[#1A1A1A] shrink-0" />}
                      {isRunning && <Loader2 className="w-4 h-4 text-[#F27D26] animate-spin shrink-0" />}
                      {isFailed && <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
                      <span className="px-2 py-0.5 bg-[#1A1A1A] text-[#FDFCF8] text-[9px] font-mono uppercase tracking-widest font-bold">
                        {step.toolName}
                      </span>
                      <span className="font-bold text-[#1A1A1A] font-serif text-sm">{step.title}</span>
                    </div>
                    <span className="text-[10px] text-[#888] font-mono">
                      {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>

                  <p className="mt-1 text-[#555] font-serif ml-6">{step.summary}</p>

                  {step.output && (
                    <div className="mt-2 ml-6 p-2.5 bg-[#FFFFFF] border border-[#E0DED7] text-[11px] font-mono text-[#222] overflow-x-auto">
                      <span className="text-[#888] block text-[9px] uppercase tracking-wider font-bold mb-1">
                        Payload Telemetry:
                      </span>
                      <pre className="text-[#1A1A1A] whitespace-pre-wrap">{JSON.stringify(step.output, null, 2)}</pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
