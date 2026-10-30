package graph

import (
	"context"
	"fmt"
	"os/exec"
	"strings"
	"time"
)

// CommitNode represents a single Git commit formatted for visual rendering.
type CommitNode struct {
	Hash       string    `json:"hash"`
	ShortHash  string    `json:"shortHash"`
	Author     string    `json:"author"`
	Email      string    `json:"email"`
	Timestamp  time.Time `json:"timestamp"`
	Subject    string    `json:"subject"`
	Parents    []string  `json:"parents"`
	BranchLane int       `json:"branchLane"`
}

// DiffHunk represents changes inside a file.
type DiffHunk struct {
	OldStart int      `json:"oldStart"`
	OldLines int      `json:"oldLines"`
	NewStart int      `json:"newStart"`
	NewLines int      `json:"newLines"`
	Lines    []string `json:"lines"`
}

// FileDiff represents a file comparison diff.
type FileDiff struct {
	OldPath string     `json:"oldPath"`
	NewPath string     `json:"newPath"`
	IsNew   bool       `json:"isNew"`
	IsDel   bool       `json:"isDel"`
	Hunks   []DiffHunk `json:"hunks"`
}

// Engine provides repository graph computation and diff extraction.
type Engine struct {
	repoDir string
}

// NewEngine initializes a Git visualizer engine.
func NewEngine(repoDir string) *Engine {
	return &Engine{repoDir: repoDir}
}

// BuildGraph extracts commit nodes with parent relationships.
func (e *Engine) BuildGraph(ctx context.Context, maxCount int) ([]CommitNode, error) {
	if maxCount <= 0 {
		maxCount = 100
	}
	format := "%H%x00%h%x00%an%x00%ae%x00%at%x00%s%x00%P"
	cmd := exec.CommandContext(ctx, "git", "-C", e.repoDir, "log", fmt.Sprintf("-n%d", maxCount), fmt.Sprintf("--pretty=format:%s", format))
	out, err := cmd.CombinedOutput()
	if err != nil {
		return nil, fmt.Errorf("git log failed: %w", err)
	}

	raw := strings.TrimSpace(string(out))
	if len(raw) == 0 {
		return []CommitNode{}, nil
	}

	var nodes []CommitNode
	lines := strings.Split(raw, "\n")
	laneCounter := 0

	for _, line := range lines {
		parts := strings.Split(line, "\x00")
		if len(parts) < 7 {
			continue
		}
		var parents []string
		if len(parts[6]) > 0 {
			parents = strings.Fields(parts[6])
		}

		node := CommitNode{
			Hash:       parts[0],
			ShortHash:  parts[1],
			Author:     parts[2],
			Email:      parts[3],
			Subject:    parts[5],
			Parents:    parents,
			BranchLane: laneCounter % 4,
		}
		nodes = append(nodes, node)
		laneCounter++
	}

	return nodes, nil
}
