package server

import (
	"flag"
	"testing"

	"github.com/urfave/cli"
)

func TestExec(t *testing.T) {
	command := cli.Command{Name: "server"}
	set := flag.NewFlagSet("test", 0)
	globalSet := flag.NewFlagSet("test", 0)
	globalCtx := cli.NewContext(nil, globalSet, nil)
	c := cli.NewContext(nil, set, globalCtx)
	c.Command = command

	res := Exec(c)
	if res.Error() != "NOT IMPLEMENTED" {
		t.Errorf("server not ok:\n", res.Error())
	}
}
