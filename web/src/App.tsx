import React, { useState } from 'react';
import { GitBranch, GitCommit, GitPullRequest, Check, Plus, Minus, Shield, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';

interface CommitItem {
  hash: string;
  shortHash: string;
  subject: string;
  author: string;
  branch: string;
  lane: number;
}

export function App() {
  const [commits, setCommits] = useState<CommitItem[]>([
    { hash: '7d970e5e8f86c17bc9e021209d014649da409ba0', shortHash: '7d970e5', subject: 'feat(toolchain): Phase 0 audit and pnpm migration (#20)', author: 'Manish Yadav', branch: 'main', lane: 0 },
    { hash: '27d3771e98d42a94796b945f1a11f056bd977cc4', shortHash: '27d3771', subject: 'chore: remove legacy branding and align with ForgeNexa (#19)', author: 'Manish Yadav', branch: 'main', lane: 0 },
    { hash: 'be6ac13c76f1240238e4f7f3b8df7aa5c1233e5b', shortHash: 'be6ac13', subject: 'docs(ecosystem): document website architecture (#18)', author: 'Manish Yadav', branch: 'feat/docs', lane: 1 },
    { hash: 'cf938ebd089a8123490184bba029381c19847124', shortHash: 'cf938eb', subject: 'feat(core): establish concurrent Go daemon', author: 'Manish Yadav', branch: 'main', lane: 0 },
  ]);

  const [selectedHash, setSelectedHash] = useState<string>(commits[0].hash);
  const [stagedFiles, setStagedFiles] = useState<string[]>(['services/forge-daemon/pkg/git/git.go']);
  const [unstagedFiles, setUnstagedFiles] = useState<string[]>(['README.md', 'package.json']);

  const selectedCommit = commits.find((c) => c.hash === selectedHash) || commits[0];

  const handleStage = (file: string) => {
    setUnstagedFiles(unstagedFiles.filter((f) => f !== file));
    setStagedFiles([...stagedFiles, file]);
  };

  const handleUnstage = (file: string) => {
    setStagedFiles(stagedFiles.filter((f) => f !== file));
    setUnstagedFiles([...unstagedFiles, file]);
  };

  return (
    <div className="flex h-screen bg-[#0F1115] text-[#C9D1D9] font-sans overflow-hidden">
      {/* Sidebar: Branches & Staging */}
      <div className="w-72 border-r border-[#30363D] bg-[#161B22] flex flex-col">
        <div className="p-3 border-b border-[#30363D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#58A6FF]" />
            <span className="font-semibold text-xs text-white">Branches & Remotes</span>
          </div>
          <span className="text-[10px] text-gray-500 font-mono">origin/main</span>
        </div>

        {/* Staging Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-300">Staged Changes ({stagedFiles.length})</span>
              <button
                onClick={() => {
                  setUnstagedFiles([...unstagedFiles, ...stagedFiles]);
                  setStagedFiles([]);
                }}
                className="text-[10px] text-gray-500 hover:text-white"
              >
                Unstage All
              </button>
            </div>
            <div className="space-y-1">
              {stagedFiles.map((file) => (
                <div
                  key={file}
                  className="flex items-center justify-between p-1.5 rounded bg-[#21262D] text-gray-200 font-mono text-[11px]"
                >
                  <span className="truncate">{file}</span>
                  <button
                    onClick={() => handleUnstage(file)}
                    className="p-1 hover:text-red-400"
                    title="Unstage"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-300">Unstaged Changes ({unstagedFiles.length})</span>
              <button
                onClick={() => {
                  setStagedFiles([...stagedFiles, ...unstagedFiles]);
                  setUnstagedFiles([]);
                }}
                className="text-[10px] text-[#58A6FF] hover:underline"
              >
                Stage All
              </button>
            </div>
            <div className="space-y-1">
              {unstagedFiles.map((file) => (
                <div
                  key={file}
                  className="flex items-center justify-between p-1.5 rounded bg-[#0F1115] border border-[#30363D] text-gray-300 font-mono text-[11px]"
                >
                  <span className="truncate">{file}</span>
                  <button
                    onClick={() => handleStage(file)}
                    className="p-1 hover:text-green-400"
                    title="Stage"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Commit Input Box */}
        <div className="p-3 border-t border-[#30363D] bg-[#161B22] space-y-2">
          <input
            type="text"
            placeholder="Commit subject..."
            className="w-full bg-[#0F1115] border border-[#30363D] rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#58A6FF]"
          />
          <button className="w-full bg-[#3FB950] hover:bg-[#2EA043] text-black font-semibold text-xs py-1.5 rounded transition-colors">
            Commit to main
          </button>
        </div>
      </div>

      {/* Main Commit Graph & Diff View */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Graph Header */}
        <div className="h-10 border-b border-[#30363D] bg-[#161B22] px-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-[#BC8CFF]" />
            <span className="font-semibold text-white">Visual Commit Topology</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <span className="flex items-center gap-1">
              <ArrowUp className="w-3 h-3 text-[#3FB950]" /> 0 Ahead
            </span>
            <span className="flex items-center gap-1">
              <ArrowDown className="w-3 h-3 text-[#58A6FF]" /> 0 Behind
            </span>
          </div>
        </div>

        {/* Visual Graph Viewport */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Commit Table */}
          <div className="flex-1 border-r border-[#30363D] overflow-y-auto">
            {commits.map((c) => (
              <div
                key={c.hash}
                onClick={() => setSelectedHash(c.hash)}
                className={`p-3 border-b border-[#21262D] cursor-pointer flex items-center gap-3 text-xs ${
                  c.hash === selectedHash ? 'bg-[#21262D] text-white' : 'hover:bg-[#161B22] text-gray-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      c.lane === 0 ? 'bg-[#58A6FF]' : 'bg-[#BC8CFF]'
                    }`}
                  />
                  <span className="font-mono text-gray-500 text-[11px]">{c.shortHash}</span>
                </div>
                <div className="flex-1 truncate font-medium">{c.subject}</div>
                <div className="text-gray-500 text-[11px]">{c.author}</div>
              </div>
            ))}
          </div>

          {/* Commit Diff & Details */}
          <div className="w-96 bg-[#0F1115] p-4 overflow-y-auto text-xs space-y-4">
            <div className="p-3 bg-[#161B22] border border-[#30363D] rounded space-y-2">
              <div className="font-semibold text-white text-sm">{selectedCommit.subject}</div>
              <div className="text-gray-400 font-mono text-[11px]">
                Commit: {selectedCommit.hash}
              </div>
              <div className="text-gray-400">Author: {selectedCommit.author}</div>
            </div>

            <div>
              <span className="font-semibold text-gray-300 block mb-2">Modified Files in Commit</span>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="p-2 rounded bg-[#161B22] border border-[#30363D] text-[#3FB950]">
                  + services/forge-daemon/pkg/git/service.go
                </div>
                <div className="p-2 rounded bg-[#161B22] border border-[#30363D] text-[#58A6FF]">
                  ~ docs/ECOSYSTEM_COMPLETION_TRACKER.md
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
