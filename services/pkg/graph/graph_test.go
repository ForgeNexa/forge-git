package graph

import (
	"context"
	"os"
	"os/exec"
	"path/filepath"
	"testing"
)

func TestEngine_BuildGraph(t *testing.T) {
	tmpDir := t.TempDir()
	ctx := context.Background()

	_ = exec.Command("git", "init", tmpDir).Run()
	_ = exec.Command("git", "-C", tmpDir, "config", "user.name", "ForgeNexa Tester").Run()
	_ = exec.Command("git", "-C", tmpDir, "config", "user.email", "test@forgenexa.org").Run()

	testFile := filepath.Join(tmpDir, "index.ts")
	_ = os.WriteFile(testFile, []byte("export const version = '1.0.0';"), 0644)

	_ = exec.Command("git", "-C", tmpDir, "add", "-A").Run()
	_ = exec.Command("git", "-C", tmpDir, "commit", "-m", "feat: initial commit").Run()

	engine := NewEngine(tmpDir)
	nodes, err := engine.BuildGraph(ctx, 10)
	if err != nil {
		t.Fatalf("BuildGraph failed: %v", err)
	}

	if len(nodes) != 1 {
		t.Fatalf("expected 1 node, got %d", len(nodes))
	}
	if nodes[0].Subject != "feat: initial commit" {
		t.Fatalf("expected subject 'feat: initial commit', got '%s'", nodes[0].Subject)
	}
}
